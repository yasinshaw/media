"""Generate synthetic sound effects and BGM for Remotion videos."""

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
import subprocess
import os

SAMPLE_RATE = 44100
OUTPUT_SFX = "/Users/yasin/code/media/remotion/public/audio/sfx"
OUTPUT_BGM = "/Users/yasin/code/media/remotion/public/audio/bgm"


def to_mp3(wav_path: str, mp3_path: str) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-i", wav_path, "-q:a", "2", mp3_path],
        capture_output=True,
        check=True,
    )
    os.remove(wav_path)


def normalize(audio: np.ndarray) -> np.ndarray:
    peak = np.max(np.abs(audio))
    if peak > 0:
        return audio / peak * 0.9
    return audio


def save_wav(path: str, audio: np.ndarray) -> None:
    audio_int = (audio * 32767).astype(np.int16)
    wavfile.write(path, SAMPLE_RATE, audio_int)


def generate_whoosh_in() -> np.ndarray:
    duration = 0.8
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    freq = np.linspace(200, 2000, len(t))
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    signal = np.sin(phase) * 0.6
    envelope = np.exp(-3 * t / duration) * np.minimum(t / 0.05, 1.0)
    noise = np.random.randn(len(t)) * 0.3 * envelope
    return normalize((signal + noise) * envelope)


def generate_whoosh() -> np.ndarray:
    duration = 0.5
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    freq = np.linspace(800, 400, len(t))
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    signal = np.sin(phase) * 0.5
    envelope = np.exp(-4 * t / duration) * np.minimum(t / 0.03, 1.0)
    noise = np.random.randn(len(t)) * 0.25 * envelope
    return normalize((signal + noise) * envelope)


def generate_impact() -> np.ndarray:
    duration = 1.0
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    low = np.sin(2 * np.pi * 60 * t) * np.exp(-8 * t)
    mid = np.sin(2 * np.pi * 150 * t) * np.exp(-12 * t)
    noise = np.random.randn(len(t)) * np.exp(-15 * t) * 0.4
    sub = np.sin(2 * np.pi * 30 * t) * np.exp(-3 * t) * 0.5
    return normalize(low * 0.5 + mid * 0.3 + noise + sub)


def generate_text_pop() -> np.ndarray:
    duration = 0.15
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    freq = np.linspace(1200, 800, len(t))
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    signal = np.sin(phase) * np.exp(-30 * t)
    return normalize(signal)


def generate_outro() -> np.ndarray:
    duration = 1.2
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    freq = np.linspace(1000, 200, len(t))
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    signal = np.sin(phase) * 0.4
    envelope = np.exp(-2.5 * t / duration)
    reverb_tail = np.zeros(int(SAMPLE_RATE * 0.3))
    combined = np.concatenate([signal * envelope, reverb_tail])
    return normalize(combined)


def generate_tech_bgm() -> np.ndarray:
    duration = 90
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)

    pad_a = np.sin(2 * np.pi * 110 * t) * 0.15
    pad_b = np.sin(2 * np.pi * 165 * t) * 0.10
    pad_c = np.sin(2 * np.pi * 220 * t) * 0.08
    pad = pad_a + pad_b + pad_c

    lfo_rate = 0.15
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * lfo_rate * t)
    pad_mod = pad * lfo

    high = np.sin(2 * np.pi * 880 * t) * 0.03 * lfo
    shimmer = np.sin(2 * np.pi * 1320 * t) * 0.02 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.3 * t))

    sub = np.sin(2 * np.pi * 55 * t) * 0.12

    noise = np.random.randn(len(t)) * 0.015
    b, a = butter(2, 2000 / (SAMPLE_RATE / 2), btype="low")
    noise = lfilter(b, a, noise)

    mix = pad_mod + high + shimmer + sub + noise

    fade_in = int(2 * SAMPLE_RATE)
    fade_out = int(3 * SAMPLE_RATE)
    mix[:fade_in] *= np.linspace(0, 1, fade_in)
    mix[-fade_out:] *= np.linspace(1, 0, fade_out)

    return normalize(mix)


def main() -> None:
    os.makedirs(OUTPUT_SFX, exist_ok=True)
    os.makedirs(OUTPUT_BGM, exist_ok=True)

    sfx_generators = {
        "whoosh-in": generate_whoosh_in,
        "whoosh": generate_whoosh,
        "impact": generate_impact,
        "text-pop": generate_text_pop,
        "outro": generate_outro,
    }

    print("Generating SFX...")
    for name, gen in sfx_generators.items():
        wav_path = os.path.join(OUTPUT_SFX, f"{name}.wav")
        mp3_path = os.path.join(OUTPUT_SFX, f"{name}.mp3")
        audio = gen()
        save_wav(wav_path, audio)
        to_mp3(wav_path, mp3_path)
        print(f"  {name}.mp3 ({len(audio)/SAMPLE_RATE:.1f}s)")

    print("Generating BGM...")
    wav_path = os.path.join(OUTPUT_BGM, "tech-medium.wav")
    mp3_path = os.path.join(OUTPUT_BGM, "tech-medium.mp3")
    bgm = generate_tech_bgm()
    save_wav(wav_path, bgm)
    to_mp3(wav_path, mp3_path)
    print(f"  tech-medium.mp3 ({len(bgm)/SAMPLE_RATE:.0f}s)")

    print("Done!")


if __name__ == "__main__":
    main()
