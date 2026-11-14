#!/usr/bin/env python3
"""Generate 1200x630 social preview cards for every product."""

from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "scripts" / ".product-og-manifest.json"
OUTPUT = ROOT / "assets" / "og" / "products"

GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
FUTURA = "/System/Library/Fonts/Supplemental/Futura.ttc"

CREAM = (253, 248, 240)
INK = (43, 35, 32)
MUTED = (104, 93, 84)
RED = (200, 16, 46)
GOLD = (179, 122, 23)
WHITE = (255, 255, 255)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def mix(color: tuple[int, int, int], other: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    return tuple(round(a * (1 - amount) + b * amount) for a, b in zip(color, other))


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=face) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def fit_name(draw: ImageDraw.ImageDraw, text: str, width: int) -> tuple[ImageFont.FreeTypeFont, list[str], int]:
    for size in range(56, 31, -2):
        face = font(GEORGIA_BOLD, size)
        lines = wrap(draw, text, face, width)
        if len(lines) <= 3 and all(draw.textlength(line, font=face) <= width for line in lines):
            return face, lines, round(size * 1.06)
    face = font(GEORGIA_BOLD, 32)
    return face, wrap(draw, text, face, width)[:4], 34


def main() -> None:
    products = json.loads(MANIFEST.read_text())
    OUTPUT.mkdir(parents=True, exist_ok=True)

    for index, product in enumerate(products, start=1):
        canvas = Image.new("RGBA", (1200, 630), CREAM + (255,))
        draw = ImageDraw.Draw(canvas)

        accent = product.get("color", "#f5d7df")
        try:
            accent_rgb = tuple(int(accent.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4))
        except (ValueError, IndexError):
            accent_rgb = (245, 215, 223)
        accent_rgb = mix(accent_rgb, (255, 255, 255), 0.32)

        # Warm halo behind the product photo.
        draw.ellipse((625, 38, 1190, 603), fill=accent_rgb + (255,))

        # Brand lock-up.
        draw.ellipse((68, 48, 148, 128), fill=RED + (255,))
        brand_face = font(GEORGIA_BOLD, 45)
        draw.text((108, 87), "P", font=brand_face, fill=WHITE, anchor="mm")
        draw.text((166, 56), "plush story", font=font(GEORGIA_BOLD, 39), fill=INK)
        draw.text((168, 105), "PLUSH TOYS & LITTLE GIFTS", font=font(FUTURA, 11), fill=MUTED)

        # Product copy.
        draw.text((68, 154), "FREE DELIVERY ACROSS INDIA", font=font(FUTURA, 16), fill=GOLD)
        name_face, lines, line_height = fit_name(draw, product["name"], 570)
        name_y = 188
        for line in lines:
            draw.text((66, name_y), line, font=name_face, fill=INK)
            name_y += line_height

        price_y = max(410, name_y + 24)
        draw.text((68, price_y), f"From ₹{product['price']:,}", font=font(GEORGIA_BOLD, 44), fill=RED)
        draw.text(
            (70, price_y + 62),
            "Secure Razorpay checkout · Friendly order support",
            font=font(FUTURA, 15),
            fill=MUTED,
        )

        pill = (66, 522, 400, 580)
        draw.rounded_rectangle(pill, radius=29, fill=RED + (255,))
        draw.text((233, 551), "Shop plushstory.shop", font=font(FUTURA, 19), fill=WHITE, anchor="mm")

        # Product photo with a soft shadow and rounded corners.
        card_path = ROOT / product["card"]
        card = Image.open(card_path).convert("RGB").resize((470, 470), Image.Resampling.LANCZOS)
        mask = Image.new("L", (470, 470), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, 469, 469), radius=30, fill=255)

        shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        ImageDraw.Draw(shadow).rounded_rectangle((695, 97, 1165, 567), radius=36, fill=(43, 35, 32, 48))
        shadow = shadow.filter(ImageFilter.GaussianBlur(18))
        canvas = Image.alpha_composite(canvas, shadow)
        canvas.paste(card, (690, 90), mask)
        draw = ImageDraw.Draw(canvas)

        # Tiny brand dot at the bottom right.
        draw.ellipse((1150, 584, 1158, 592), fill=GOLD + (255,))

        output = OUTPUT / f"{product['id']}.jpg"
        canvas.convert("RGB").save(output, "JPEG", quality=84, optimize=True, progressive=True)
        if index % 25 == 0 or index == len(products):
            print(f"Generated {index}/{len(products)} social cards")

    print(f"Wrote {len(products)} social cards to {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
