#!/usr/bin/env python3
"""Crée des fichiers *placeholder* pour tout média manquant dans ./assets/.

Les noms attendus sont lus dans src/config.ts (champ `file:` / `image:`), donc
si tu changes un nom de fichier dans la config, ce script suivra.
Un fichier déjà présent n'est JAMAIS écrasé.

Usage : python3 scripts/make_placeholders.py
"""
import json
import math
import random
import re
import shutil
import struct
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
CONFIG = ROOT / "src" / "config.ts"
FONT = ASSETS / "fonts" / "LilitaOne-Regular.ttf"
REGISTRY = ASSETS / ".placeholders.json"

RED, GREEN, GOLD = (214, 40, 40), (27, 94, 32), (255, 195, 0)


def expected_files():
    txt = CONFIG.read_text(encoding="utf-8")
    files = re.findall(r"(?:file|image):\s*['\"]([^'\"]+\.(?:png|jpg|jpeg|mp4|mp3))['\"]", txt)
    seen, out = set(), []
    for f in files:
        if f not in seen and not f.startswith("fonts/"):
            seen.add(f)
            out.append(f)
    return out


def make_png(path: Path, label: str):
    from PIL import Image, ImageDraw, ImageFont

    w, h = 1920, 1080
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        t = y / h
        c = tuple(int(GREEN[i] * (1 - t) + 10 * t) for i in range(3))
        for x in range(w):
            px[x, y] = c
    d = ImageDraw.Draw(img)
    rnd = random.Random(label)
    # sapins stylisés + cadeaux pour donner du relief au zoom Ken Burns
    for _ in range(18):
        x = rnd.randint(0, w)
        base = rnd.randint(h // 2, h)
        s = rnd.randint(80, 220)
        d.polygon([(x, base - s * 2), (x - s, base), (x + s, base)], fill=(15, 70, 25))
    for _ in range(25):
        x, y, s = rnd.randint(0, w), rnd.randint(h // 2, h), rnd.randint(40, 110)
        d.rectangle([x, y, x + s, y + s], fill=rnd.choice([RED, GOLD, (240, 240, 240)]))
        d.rectangle([x + s // 2 - 6, y, x + s // 2 + 6, y + s], fill=GOLD)
    for _ in range(300):
        x, y, r = rnd.randint(0, w), rnd.randint(0, h), rnd.randint(2, 6)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255))
    font = ImageFont.truetype(str(FONT), 110)
    small = ImageFont.truetype(str(FONT), 60)
    d.text((w / 2, h / 2 - 60), "PLACEHOLDER", font=font, fill="white", anchor="mm",
           stroke_width=8, stroke_fill="black")
    d.text((w / 2, h / 2 + 70), f"remplace assets/{label}", font=small, fill=GOLD, anchor="mm",
           stroke_width=6, stroke_fill="black")
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)


CLIP_COLORS = ["0xD62828", "0x1B5E20", "0xFFC300", "0x1565C0", "0x6A1B9A", "0xEF6C00", "0x00838F", "0xAD1457"]


def make_mp4(path: Path, label: str, index: int):
    c0 = CLIP_COLORS[index % len(CLIP_COLORS)]
    c1 = CLIP_COLORS[(index + 3) % len(CLIP_COLORS)]
    font = str(FONT).replace(":", r"\:")
    vf = (
        f"drawtext=fontfile='{font}':text='CLIP {index + 1}':fontsize=200:fontcolor=white:"
        f"borderw=10:bordercolor=black:x=(w-tw)/2+sin(t*3)*120:y=(h-th)/2-80,"
        f"drawtext=fontfile='{font}':text='remplace assets/{label}':fontsize=70:fontcolor=0xFFC300:"
        f"borderw=6:bordercolor=black:x=(w-tw)/2:y=(h/2)+120"
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "lavfi", "-i", f"gradients=s=1920x1080:c0={c0}:c1={c1}:speed=0.03:d=4:r=30",
        "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23", "-an", str(path),
    ], check=True)


def make_music(path: Path, bpm=120, seconds=34):
    """Petit morceau festif 120 BPM (grosse caisse, charleston, mélodie de clochettes)."""
    sr = 44100
    n = int(sr * seconds)
    beat = 60 / bpm
    buf = [0.0] * n

    def add(start, dur, fn, gain):
        s0 = int(start * sr)
        for i in range(int(dur * sr)):
            if s0 + i >= n:
                break
            buf[s0 + i] += fn(i / sr) * gain

    kick = lambda t: math.sin(2 * math.pi * (50 + 120 * math.exp(-t * 30)) * t) * math.exp(-t * 9)
    hat_rng = random.Random(1)
    hat = lambda t: (hat_rng.random() * 2 - 1) * math.exp(-t * 60)

    def bell(freq):
        return lambda t: (math.sin(2 * math.pi * freq * t) + 0.4 * math.sin(2 * math.pi * freq * 2.76 * t)) * math.exp(-t * 4)

    # Jingle Bells (domaine public) en notes : (demi-tons depuis E5, durée en temps)
    E, F, G, C, D = 659.25, 698.46, 783.99, 523.25, 587.33
    melody = [(E, 1), (E, 1), (E, 2), (E, 1), (E, 1), (E, 2), (E, 1), (G, 1), (C, 1.5), (D, 0.5), (E, 4),
              (F, 1), (F, 1), (F, 1.5), (F, 0.5), (F, 1), (E, 1), (E, 1), (E, 0.5), (E, 0.5),
              (E, 1), (D, 1), (D, 1), (E, 1), (D, 2), (G, 2)]
    total_beats = int(seconds / beat)
    for b in range(total_beats):
        t = b * beat
        add(t, 0.4, kick, 0.9)
        add(t + beat / 2, 0.08, hat, 0.15)
        if b % 2 == 1:
            add(t, 0.15, lambda x: (hat_rng.random() * 2 - 1) * math.exp(-x * 25), 0.25)  # clap
    t, i = 0.0, 0
    while t < seconds - 1:
        f, d = melody[i % len(melody)]
        add(t, min(d * beat + 0.6, 2.0), bell(f), 0.22)
        add(t, min(d * beat, 1.0), bell(f / 2), 0.10)
        t += d * beat
        i += 1
    peak = max(abs(x) for x in buf) or 1
    wav_path = path.with_suffix(".tmp.wav")
    with wave.open(str(wav_path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(b"".join(struct.pack("<h", int(x / peak * 0.9 * 32767)) for x in buf))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav_path), "-ac", "2",
                    "-c:a", "libmp3lame", "-b:a", "192k", str(path)], check=True)
    wav_path.unlink()


def main():
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg est requis pour créer les placeholders vidéo/audio.")
    # registre {fichier: taille} : un fichier dont la taille a changé a été remplacé par l'utilisateur
    registry = json.loads(REGISTRY.read_text()) if REGISTRY.exists() else {}
    created, clip_i = [], 0
    for rel in expected_files():
        p = ASSETS / rel
        is_clip = rel.endswith(".mp4")
        if p.exists():
            if is_clip:
                clip_i += 1
            continue
        if rel.endswith((".png", ".jpg", ".jpeg")):
            make_png(p, rel)
        elif is_clip:
            make_mp4(p, rel, clip_i)
            clip_i += 1
        elif rel.endswith(".mp3"):
            make_music(p)
        created.append(rel)
        registry[rel] = p.stat().st_size
    # oublie les placeholders que l'utilisateur a remplacés/supprimés
    registry = {r: s for r, s in registry.items() if (ASSETS / r).exists() and (ASSETS / r).stat().st_size == s}
    REGISTRY.write_text(json.dumps(registry, indent=2, sort_keys=True))
    if created:
        print("Placeholders créés :")
        for c in created:
            print(f"  - assets/{c}")
    if registry:
        print("\n⚠️  Fichiers encore en PLACEHOLDER (remplace-les par tes vrais médias, même nom) :")
        for r in sorted(registry):
            print(f"  - assets/{r}")
    else:
        print("Tous les médias sont présents ✅")


if __name__ == "__main__":
    main()
