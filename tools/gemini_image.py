#!/usr/bin/env python3
"""Generate or edit a Saya image with the Gemini API (no extra packages).

Auth: if GEMINI_API_KEY is set it is sent as the x-goog-api-key header. If it is
not set, the request goes out without a key and the environment's network secret
(a custom header on generativelanguage.googleapis.com) supplies it.

  # list image-capable models available to the key
  python3 tools/gemini_image.py --list-models

  # edit: reference images first, then the instruction
  python3 tools/gemini_image.py -o out/saya-08.png \
      -i refs/saya/face-reference-01.png -i refs/saya/character-sheet.png \
      -p "Using the first image, show the same moment from a three-quarter angle..."

Options: --model (default gemini-2.5-flash-image or $GEMINI_IMAGE_MODEL),
--aspect (default 9:16). Every image part returned is saved; extra ones get
-2, -3 suffixes. Any text the model returns is printed.
"""
import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request

API = "https://generativelanguage.googleapis.com/v1beta"
DEFAULT_MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")


def call(url, key, body=None):
    headers = {"Content-Type": "application/json"}
    if key:
        headers["x-goog-api-key"] = key
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode() if body is not None else None,
        headers=headers,
        method="POST" if body is not None else "GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Gemini API error {e.code}: {e.read().decode(errors='replace')[:800]}")


def image_part(path):
    mime = mimetypes.guess_type(path)[0] or "image/png"
    with open(path, "rb") as f:
        return {"inline_data": {"mime_type": mime, "data": base64.b64encode(f.read()).decode()}}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-p", "--prompt")
    ap.add_argument("-i", "--image", action="append", default=[], help="reference image, repeatable")
    ap.add_argument("-o", "--out", default="out/gemini.png")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--aspect", default="9:16")
    ap.add_argument("--list-models", action="store_true")
    a = ap.parse_args()

    key = os.environ.get("GEMINI_API_KEY")  # optional: a network secret can inject it

    if a.list_models:
        for m in call(f"{API}/models?pageSize=1000", key).get("models", []):
            name = m["name"].split("/")[-1]
            if "image" in name:
                print(name)
        return

    if not a.prompt:
        sys.exit("--prompt is required.")
    parts = [image_part(p) for p in a.image] + [{"text": a.prompt}]
    body = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {"aspectRatio": a.aspect},
        },
    }
    res = call(f"{API}/models/{a.model}:generateContent", key, body)

    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    base, ext = os.path.splitext(a.out)
    saved = 0
    for cand in res.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            data = part.get("inlineData") or part.get("inline_data")
            if data:
                path = a.out if saved == 0 else f"{base}-{saved + 1}{ext}"
                with open(path, "wb") as f:
                    f.write(base64.b64decode(data["data"]))
                print(path)
                saved += 1
            elif part.get("text"):
                print(part["text"], file=sys.stderr)
    if not saved:
        sys.exit("No image returned: " + json.dumps(res.get("promptFeedback", res))[:800])


if __name__ == "__main__":
    main()
