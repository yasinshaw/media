#!/usr/bin/env python3
"""
Generate voiceover audio using Volcano Ark TTS API.

Modes:
1. Single file: python generate_voiceover.py <text_file> <output_file> [speaker]
2. Split mode: python generate_voiceover.py split <text_file> <output_dir> [speaker]
   - Generates one audio file per line of text
   - Files named: voiceover-01.mp3, voiceover-02.mp3, etc.
   - Also generates voiceover-full.mp3 (combined)
"""
import os
import sys
import base64
import json
import re
import subprocess
from typing import Optional, Union

try:
    import requests
except ImportError:
    print("Error: requests module not found. Install with: pip install requests")
    sys.exit(1)

# API Configuration
API_URL = "https://openspeech.bytedance.com/api/v3/tts/unidirectional"
RESOURCE_ID = "seed-tts-2.0"  # For TTS 2.0 voices

# Maximum segment length before using weak punctuation for splitting
MAX_SEGMENT_LENGTH = 40

# Default speaker
DEFAULT_SPEAKER = "zh_male_liufei_uranus_bigtts"


def get_audio_duration(audio_file_path: str) -> Optional[float]:
    """
    Get the actual duration of an audio file using ffprobe.

    Args:
        audio_file_path: Path to the audio file

    Returns:
        Duration in seconds, or None if detection fails
    """
    try:
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            audio_file_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        duration = float(result.stdout.strip())
        return duration
    except FileNotFoundError:
        print(f"  Warning: ffprobe not found. Is ffmpeg installed?")
        return None
    except subprocess.CalledProcessError as e:
        print(f"  Warning: Could not get duration for {audio_file_path}: {e}")
        return None
    except ValueError:
        print(f"  Warning: Could not parse duration for {audio_file_path}")
        return None


def read_env_vars():
    """Read API credentials from .env file."""
    # Find .env file by going up from script location
    # Script is at: project_root/.claude/skills/voiceover-tts/scripts/generate_voiceover.py
    # Need to go up 5 levels to reach project_root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(script_dir))))
    env_file = os.path.join(project_root, ".env")

    env_vars = {}
    try:
        with open(env_file, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    env_vars[key.strip()] = value.strip()
    except FileNotFoundError:
        pass

    return env_vars


def parse_voiceover_text(content):
    """
    Parse voiceover.md content to extract voiceover text lines.

    Format:
    ---
    [voiceover line 1]

    [voiceover line 2]

    ...
    """
    # Find the content after the --- separator
    if "---" in content:
        content = content.split("---", 1)[1]

    # Extract voiceover lines (from 口播: lines or plain text paragraphs)
    lines = []
    current_segment = []

    for line in content.strip().split("\n"):
        line = line.strip()

        # Skip empty lines (but save current segment)
        if not line:
            if current_segment:
                lines.append(" ".join(current_segment))
                current_segment = []
            continue

        # Skip metadata headers
        if line.startswith("#") or line.startswith(">"):
            continue

        # Skip shot labels like "### 镜头 1"
        if re.match(r"^#{1,6}\s*镜头", line):
            if current_segment:
                lines.append(" ".join(current_segment))
                current_segment = []
            continue

        # Extract text from 口播: "xxx" format
        match = re.search(r'口播["\s:：]+(.+?)["\s]*$', line)
        if match:
            text = match.group(1).strip()
            # Remove quotes
            text = text.strip('"').strip("'").strip('"""').strip()
            if current_segment:
                lines.append(" ".join(current_segment))
                current_segment = []
            if text:
                lines.append(text)
            continue

        # Regular text line
        current_segment.append(line)

    # Don't forget the last segment
    if current_segment:
        lines.append(" ".join(current_segment))

    # Filter out empty lines and metadata
    result = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#") and not line.startswith(">"):
            # Remove markdown formatting
            line = re.sub(r'\*\*(.+?)\*\*', r'\1', line)  # bold
            line = re.sub(r'\*(.+?)\*', r'\1', line)  # italic
            line = re.sub(r'`(.+?)`', r'\1', line)  # code
            result.append(line)

    return result


def split_text_into_sentences(text: str) -> list[tuple[str, int]]:
    """
    Split Chinese text into sentences by punctuation.

    Rules:
    - Split by 。！？（strong stops)
    - Also split by ，；、（weak stops) for longer segments
    - Preserve quotes and parentheses

    Args:
        text: Input text string

    Returns:
        list of tuples: [(sentence_text, char_count), ...]
    """
    import re

    # First, try strong punctuation (sentence boundaries)
    strong_pattern = r'([^。！？\n]+[。！？]?)'
    sentences = re.split(strong_pattern, text)

    # Filter out empty strings and rejoin with what was captured
    result = []
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        # Check if this segment is still too long
        if len(s) > MAX_SEGMENT_LENGTH:
            # Split by weak punctuation (comma, semicolon, pause mark)
            # Using capturing group so delimiters are included in result
            weak_parts = re.split(r'([，；、])', s)
            current = ""
            for part in weak_parts:
                if part in '，；、':
                    current += part
                    if current:
                        result.append(current)
                        current = ""
                else:
                    current += part
            if current:
                result.append(current)
        else:
            result.append(s)

    # Return as list of (text, length) tuples
    return [(s, len(s)) for s in result if s.strip()]


def calculate_subtitle_timing(
    sub_segments: list[tuple[str, int]],
    total_duration: float
) -> list[dict[str, Union[float, str]]]:
    """
    Calculate timing for each subtitle segment proportionally to character count.

    Args:
        sub_segments: List of (text, char_count) tuples
        total_duration: Total audio duration in seconds

    Returns:
        List of dicts with start, end, text, duration keys
    """
    if not sub_segments:
        return []

    total_chars = sum(count for _, count in sub_segments)
    result = []
    current_time = 0

    for text, count in sub_segments:
        # Proportional duration
        duration = (count / total_chars) * total_duration if total_chars > 0 else total_duration
        result.append({
            'text': text,
            'start': round(current_time, 2),
            'end': round(current_time + duration, 2),
            'duration': round(duration, 2)
        })
        current_time += duration

    # Fix floating-point drift: ensure last segment ends exactly at total_duration
    if result:
        result[-1]['end'] = round(total_duration, 2)

    return result


def generate_tts(text, speaker=None):
    """
    Generate TTS audio using Volcano Ark API.

    Args:
        text: Text to synthesize
        speaker: Speaker voice ID (default: zh_male_liufei_uranus_bigtts)

    Returns:
        bytes: Audio data (MP3 format)
    """
    if speaker is None:
        speaker = DEFAULT_SPEAKER

    # Read credentials from .env
    env = read_env_vars()
    api_key = env.get("VOLC_TTS_API_KEY", "")

    # Support both new (X-Api-Key) and old (X-Api-App-Id + X-Api-Access-Key) auth
    if api_key:
        # New console: only need X-Api-Key
        headers = {
            "X-Api-Key": api_key,
            "X-Api-Resource-Id": RESOURCE_ID,
            "Content-Type": "application/json",
        }
    else:
        # Old console: need X-Api-App-Id + X-Api-Access-Key
        app_id = env.get("VOLC_TTS_APP_ID", "")
        access_key = env.get("VOLC_TTS_ACCESS_KEY", "")
        if not app_id or not access_key:
            raise ValueError(
                "Missing API credentials. Please set VOLC_TTS_API_KEY in .env file (new console) "
                "or VOLC_TTS_APP_ID and VOLC_TTS_ACCESS_KEY (old console)"
            )
        headers = {
            "X-Api-App-Id": app_id,
            "X-Api-Access-Key": access_key,
            "X-Api-Resource-Id": RESOURCE_ID,
            "Content-Type": "application/json",
        }

    # Request body
    payload = {
        "user": {"uid": "media-toolkit"},
        "req_params": {
            "text": text,
            "speaker": speaker,
            "audio_params": {
                "format": "mp3",
                "sample_rate": 24000,
            },
        },
    }

    # Make request
    session = requests.Session()
    response = session.post(API_URL, headers=headers, json=payload, stream=True)

    if response.status_code != 200:
        raise RuntimeError(f"API request failed: {response.status_code} - {response.text}")

    # Collect audio chunks
    audio_chunks = []

    for line in response.iter_lines():
        if line:
            try:
                data = json.loads(line)
                if data.get("code") == 0 and data.get("data"):
                    # Base64 encoded audio data
                    audio_chunk = base64.b64decode(data["data"])
                    audio_chunks.append(audio_chunk)
                elif data.get("code") == 20000000:
                    # Session finish - success
                    pass
                elif data.get("code") != 0:
                    # Error occurred
                    raise RuntimeError(f"TTS error: {data.get('message', 'Unknown error')}")
            except json.JSONDecodeError:
                # Skip non-JSON lines
                continue

    if not audio_chunks:
        raise RuntimeError("No audio data received from API")

    return b"".join(audio_chunks)


def generate_split_mode(text_file, output_dir, speaker):
    """Generate separate audio files for each line of text."""
    # Read and parse text file
    try:
        with open(text_file, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: Text file not found: {text_file}")
        sys.exit(1)

    # Extract voiceover lines
    lines = parse_voiceover_text(content)

    if not lines:
        print("Error: No voiceover text found in file")
        sys.exit(1)

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Generate audio for each line
    audio_files = []
    all_audio_data = []

    for i, line in enumerate(lines, 1):
        if not line.strip():
            continue

        try:
            print(f"[{i}/{len(lines)}] Generating: {line[:30]}...")
            audio_data = generate_tts(line.strip(), speaker)

            # Save individual file
            filename = f"voiceover-{i:02d}.mp3"
            filepath = os.path.join(output_dir, filename)
            with open(filepath, "wb") as f:
                f.write(audio_data)

            audio_files.append((filename, len(audio_data), line))
            all_audio_data.append(audio_data)

            print(f"  OK {filename} ({len(audio_data)} bytes)")

        except Exception as e:
            print(f"  ERROR: {e}")
            continue

    # Generate combined file
    if all_audio_data:
        combined_path = os.path.join(output_dir, "voiceover-full.mp3")
        with open(combined_path, "wb") as f:
            f.write(b"".join(all_audio_data))
        print(f"\nOK Combined audio saved: voiceover-full.mp3")

    # Generate manifest file
    manifest_path = os.path.join(output_dir, "voiceover-manifest.json")
    manifest = {
        "total_segments": len(audio_files),
        "speaker": speaker,
        "segments": [
            {
                "index": i + 1,
                "file": filename,
                "size_bytes": size,
                "text": text
            }
            for i, (filename, size, text) in enumerate(audio_files)
        ]
    }
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"OK Manifest saved: voiceover-manifest.json")

    return audio_files


def generate_single_mode(text_file, output_file, speaker):
    """Generate a single audio file for all text."""
    # Read text file
    try:
        with open(text_file, "r", encoding="utf-8") as f:
            text = f.read().strip()
    except FileNotFoundError:
        print(f"Error: Text file not found: {text_file}")
        sys.exit(1)

    if not text:
        print("Error: Text file is empty")
        sys.exit(1)

    # Parse and combine lines
    lines = parse_voiceover_text(text)
    combined_text = " ".join(lines)

    # Generate audio
    try:
        print(f"Generating TTS audio with speaker: {speaker}...")
        print(f"Text length: {len(combined_text)} characters")
        audio_data = generate_tts(combined_text, speaker)

        # Create output directory if needed
        output_dir = os.path.dirname(output_file)
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)

        # Save audio
        with open(output_file, "wb") as f:
            f.write(audio_data)

        print(f"OK Audio saved: {output_file}")
        print(f"  Size: {len(audio_data)} bytes")

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


def main():
    if len(sys.argv) < 3:
        print("Usage:")
        print("  Single file: python generate_voiceover.py <text_file> <output_file> [speaker]")
        print("  Split mode:  python generate_voiceover.py split <text_file> <output_dir> [speaker]")
        print(f"\nDefault speaker: {DEFAULT_SPEAKER}")
        sys.exit(1)

    mode = sys.argv[1]

    if mode == "split":
        # Split mode: generate separate files for each line
        if len(sys.argv) < 4:
            print("Usage: python generate_voiceover.py split <text_file> <output_dir> [speaker]")
            sys.exit(1)
        text_file = sys.argv[2]
        output_dir = sys.argv[3]
        speaker = sys.argv[4] if len(sys.argv) > 4 else DEFAULT_SPEAKER
        generate_split_mode(text_file, output_dir, speaker)
    else:
        # Single file mode
        text_file = sys.argv[1]
        output_file = sys.argv[2]
        speaker = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_SPEAKER
        generate_single_mode(text_file, output_file, speaker)


if __name__ == "__main__":
    main()
