#!/usr/bin/env python3
"""
Generate an image via an OpenAI-compatible images/generations API.

Reads provider config from project-root .env (or process environment):
  IMAGE_API_KEY       (required)
  IMAGE_API_BASE_URL  (default: https://api.openai.com/v1)
  IMAGE_MODEL         (default: gpt-image-1)

Usage:
  python scripts/generate_image.py <output_path> <prompt> [--size 1024x1024]

Examples:
  python scripts/generate_image.py cover-bg.png "futuristic AI background, neon glow"
  python scripts/generate_image.py shot1-bg.png "cinematic vertical scene" --size 1024x1536
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path
from typing import Optional, Tuple


def load_dotenv(path):  # type: (Path) -> dict
    """Minimal .env parser. Returns dict; never overwrites existing env."""
    if not path.exists():
        return {}
    out = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        if key:
            out[key] = val
    return out


def find_project_root(start):
    """Walk up to find a directory containing .env or .env.example."""
    cur = start.resolve()
    for parent in [cur, *cur.parents]:
        if (parent / ".env").exists() or (parent / ".env.example").exists():
            return parent
    return cur


def resolve_config():  # type: () -> Tuple[str, str, str]
    root = find_project_root(Path(__file__).parent)
    env_file = load_dotenv(root / ".env")

    def get(key, default=None):
        return os.environ.get(key) or env_file.get(key) or default

    api_key = get("IMAGE_API_KEY")
    base_url = (get("IMAGE_API_BASE_URL", "https://api.openai.com/v1") or "").rstrip("/")
    model = get("IMAGE_MODEL", "gpt-image-1")

    if not api_key:
        sys.exit(
            "❌ IMAGE_API_KEY 未配置。请在项目根目录 .env 中设置：\n"
            "  IMAGE_API_KEY=...\n"
            "  IMAGE_API_BASE_URL=https://api.bltcy.ai/v1   # 可选\n"
            "  IMAGE_MODEL=gpt-image-2-all                  # 可选"
        )
    return api_key, base_url, model


def request_image(api_key, base_url, model, prompt, size):
    body = json.dumps({
        "model": model,
        "prompt": prompt,
        "size": size,
        "n": 1,
        "response_format": "b64_json",
    }).encode("utf-8")

    req = urllib.request.Request(
        f"{base_url}/images/generations",
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        sys.exit(f"❌ 图像生成 API 失败 ({e.code}): {detail}")
    except urllib.error.URLError as e:
        sys.exit(f"❌ 网络错误: {e.reason}")


def download_url(url):
    try:
        with urllib.request.urlopen(url, timeout=180) as resp:
            return resp.read()
    except urllib.error.URLError as e:
        sys.exit(f"❌ 下载图像失败: {e}")


def extract_image_bytes(payload):
    """Handle both b64_json and url response variants."""
    data = payload.get("data")
    if not data or not isinstance(data, list):
        sys.exit(f"❌ API 响应缺少 data 字段: {json.dumps(payload)[:500]}")

    item = data[0]
    if "b64_json" in item and item["b64_json"]:
        return base64.b64decode(item["b64_json"])
    if "url" in item and item["url"]:
        return download_url(item["url"])
    sys.exit(f"❌ API 响应里既无 b64_json 也无 url: {json.dumps(item)[:500]}")


def main():
    parser = argparse.ArgumentParser(description="Generate image via OpenAI-compatible API")
    parser.add_argument("output", help="Output image path (e.g. cover-bg.png)")
    parser.add_argument("prompt", help="Image generation prompt")
    parser.add_argument("--size", default="1024x1024", help="WIDTHxHEIGHT (default 1024x1024)")
    args = parser.parse_args()

    api_key, base_url, model = resolve_config()

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"→ Generating image via {base_url} (model={model}, size={args.size})")
    payload = request_image(api_key, base_url, model, args.prompt, args.size)
    image_bytes = extract_image_bytes(payload)
    output_path.write_bytes(image_bytes)

    print(f"✅ Saved: {output_path} ({len(image_bytes) // 1024} KB)")


if __name__ == "__main__":
    main()
