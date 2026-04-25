#!/usr/bin/env python3
"""
Add stylized text overlay to cover images.

Usage:
  python scripts/add_cover_text.py <background> <output> <title> [subtitle] [colors_json]

Colors JSON (optional, auto-generates if omitted):
  {
    "text_color": "#ffffff",      # Main title text
    "accent_color": "#00ffff",    # Accent/decorative elements
    "glow_color": "#00ffff",      # Title glow
    "bg_box_alpha": 120           # Background box opacity (0-255)
  }

Example with colors:
  python scripts/add_cover_text.py bg.png out.png "Title" "Subtitle" '{"text_color":"#ffffff","accent_color":"#00ffff","glow_color":"#00ffff","bg_box_alpha":120}'
"""

import sys
import os
import json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Font paths
FONT_PATHS = [
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/STHeiti Light.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
]


def remove_watermark(img):
    """Remove AI-generated watermark from bottom-right corner by blurring."""
    width, height = img.size
    wm_w, wm_h = int(width * 0.12), int(height * 0.04)
    region = img.crop((width - wm_w, height - wm_h, width, height))
    blurred = region.filter(ImageFilter.GaussianBlur(radius=15))
    img.paste(blurred, (width - wm_w, height - wm_h))
    return img


def hex_to_rgb(hex_str):
    """Convert hex color to RGB tuple."""
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))


def auto_generate_colors(img):
    """Auto-generate colors from background analysis (fallback when no colors provided)."""
    from PIL import ImageStat
    import colorsys

    width, height = img.size
    rx1, ry1 = int(width * 0.2), int(height * 0.3)
    rx2, ry2 = int(width * 0.8), int(height * 0.7)
    region = img.crop((rx1, ry1, rx2, ry2))
    stat = ImageStat.Stat(region)
    avg_r, avg_g, avg_b = [int(v) for v in stat.mean[:3]]
    lum = 0.299 * avg_r + 0.587 * avg_g + 0.114 * avg_b
    is_dark = lum < 140

    h, l, s = colorsys.rgb_to_hls(avg_r/255, avg_g/255, avg_b/255)
    comp_h = (h + 0.5) % 1.0
    accent_l = 0.55 if is_dark else 0.45
    accent_s = min(1.0, s + 0.3)

    r, g, b = colorsys.hls_to_rgb(comp_h, accent_l, accent_s)
    accent = (int(r*255), int(g*255), int(b*255))

    return {
        "text_color": (255, 255, 255) if is_dark else (15, 15, 25),
        "accent_color": accent,
        "glow_color": accent,
        "bg_box_alpha": 120 if is_dark else 130,
        "bg_box_base": (0, 0, 0) if is_dark else (255, 255, 255),
        "is_dark": is_dark,
    }


def get_font(size, bold=True):
    """Load a suitable font."""
    for font_path in FONT_PATHS:
        if os.path.exists(font_path):
            try:
                index = 1 if bold and "PingFang" in font_path else 0
                return ImageFont.truetype(font_path, size, index=index)
            except Exception:
                continue
    return ImageFont.load_default()


def draw_rounded_rect(draw, bbox, radius, color):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = bbox
    draw.rounded_rectangle([(x1, y1), (x2, y2)], radius=radius, fill=color)


def draw_tech_corners(draw, bbox, color, length=30, thickness=3):
    """Draw decorative tech corner brackets."""
    x1, y1, x2, y2 = bbox
    for (lx1, ly1), (lx2, ly2) in [
        ((x1, y1), (x1 + length, y1)),
        ((x1, y1), (x1, y1 + length)),
        ((x2, y1), (x2 - length, y1)),
        ((x2, y1), (x2, y1 + length)),
        ((x1, y2), (x1 + length, y2)),
        ((x1, y2), (x1, y2 - length)),
        ((x2, y2), (x2 - length, y2)),
        ((x2, y2), (x2, y2 - length)),
    ]:
        draw.line([(lx1, ly1), (lx2, ly2)], fill=color, width=thickness)


def draw_glow(img, text, x, y, font, glow_color, blur_radius=8):
    """Draw glowing text effect."""
    temp = Image.new("RGBA", (1, 1), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp)
    bbox = temp_draw.textbbox((0, 0), text, font=font, anchor="mm")
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    margin = blur_radius * 4
    glow_w, glow_h = tw + margin * 2, th + margin * 2

    glow = Image.new("RGBA", (glow_w, glow_h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.text((glow_w // 2, glow_h // 2), text, font=font, fill=glow_color, anchor="mm")
    glow = glow.filter(ImageFilter.GaussianBlur(radius=blur_radius))

    paste_x, paste_y = int(x - glow_w // 2), int(y - glow_h // 2)
    full_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    full_layer.paste(glow, (paste_x, paste_y), glow)
    result = Image.alpha_composite(img, full_layer)
    img.paste(result)


def add_text_overlay(background_path, output_path, title, subtitle="", colors_json=None):
    """Add stylized text overlay with AI-recommended or auto-generated colors."""
    img = Image.open(background_path).convert("RGBA")
    img = remove_watermark(img)
    draw = ImageDraw.Draw(img)
    width, height = img.size

    # Parse or generate colors
    if colors_json:
        user_colors = json.loads(colors_json)
        c = {
            "text_color": hex_to_rgb(user_colors.get("text_color", "#ffffff")),
            "accent_color": hex_to_rgb(user_colors.get("accent_color", "#00ffff")),
            "glow_color": hex_to_rgb(user_colors.get("glow_color", "#00ffff")),
            "bg_box_alpha": user_colors.get("bg_box_alpha", 120),
            "bg_box_base": (0, 0, 0),  # Default to dark box
            "is_dark": True,  # Assume dark when user provides colors
        }
        # Create RGBA colors
        bg_box_color = (*c["bg_box_base"], c["bg_box_alpha"])
        glow_color_rgba = (*c["glow_color"], 100)
    else:
        c = auto_generate_colors(img)
        bg_box_color = (*c["bg_box_base"], c["bg_box_alpha"])
        glow_color_rgba = (*c["glow_color"], 100)

    # Font sizes
    title_font_size = max(48, int(width * 0.11))
    subtitle_font_size = max(28, int(width * 0.045))

    title_font = get_font(title_font_size, bold=True)
    subtitle_font = get_font(subtitle_font_size, bold=True)

    # Calculate positions (vertically centered)
    total_text_height = title_font_size * 1.15 + (subtitle_font_size * 1.3 if subtitle else 0)
    title_y = (height - total_text_height) / 2 + title_font_size * 0.5
    subtitle_y = title_y + title_font_size * 1.15

    # Text dimensions
    temp = Image.new("RGBA", (1, 1), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp)
    title_bbox = temp_draw.textbbox((0, 0), title, font=title_font, anchor="mm")
    title_width = title_bbox[2] - title_bbox[0]

    subtitle_width = 0
    if subtitle:
        sub_bbox = temp_draw.textbbox((0, 0), subtitle, font=subtitle_font, anchor="mm")
        subtitle_width = sub_bbox[2] - sub_bbox[0]

    max_text_width = max(title_width, subtitle_width)

    # ===== Background design elements =====
    box_padding = 40
    box_height = title_font_size * 1.8 + (subtitle_font_size * 1.3 if subtitle else 0)
    box_x1 = (width - max_text_width) // 2 - box_padding
    box_x2 = (width + max_text_width) // 2 + box_padding
    box_y1 = title_y - title_font_size * 0.7
    box_y2 = box_y1 + box_height

    draw_rounded_rect(draw, (box_x1, box_y1, box_x2, box_y2), radius=20, color=bg_box_color)
    draw_tech_corners(draw, (box_x1 - 10, box_y1 - 10, box_x2 + 10, box_y2 + 10),
                      c["accent_color"], length=25, thickness=4)

    # Decorative line
    line_y = box_y2 + 15
    draw.line([(width // 2 - 50, line_y), (width // 2 + 50, line_y)], fill=c["accent_color"], width=3)
    draw.ellipse([(width // 2 - 55, line_y - 4), (width // 2 - 47, line_y + 4)], fill=c["accent_color"])
    draw.ellipse([(width // 2 + 47, line_y - 4), (width // 2 + 55, line_y + 4)], fill=c["accent_color"])

    # ===== Draw text =====
    draw_glow(img, title, width // 2, title_y, title_font, glow_color_rgba, blur_radius=10)

    # Title stroke
    shadow_alpha = 220 if c["is_dark"] else 150
    for offset in [(4, 4), (3, 3), (2, 2), (1, 1)]:
        draw.text((width // 2 + offset[0], title_y + offset[1]), title,
                 font=title_font, fill=(0, 0, 0, shadow_alpha), anchor="mm")

    # Main title
    draw.text((width // 2, title_y), title, font=title_font, fill=c["text_color"], anchor="mm")

    # Subtitle
    if subtitle:
        sub_pill_padding_x, sub_pill_padding_y = 30, 12
        sub_bbox = temp_draw.textbbox((0, 0), subtitle, font=subtitle_font, anchor="mm")
        sub_width, sub_height = sub_bbox[2] - sub_bbox[0], sub_bbox[3] - sub_bbox[1]

        pill_x1 = (width - sub_width) // 2 - sub_pill_padding_x
        pill_x2 = (width + sub_width) // 2 + sub_pill_padding_x
        pill_y1 = subtitle_y - sub_height // 2 - sub_pill_padding_y
        pill_y2 = subtitle_y + sub_height // 2 + sub_pill_padding_y

        draw_rounded_rect(draw, (pill_x1, pill_y1, pill_x2, pill_y2), radius=15,
                         color=(*c["accent_color"][:3], 180))

        for offset in [(2, 2), (1, 1)]:
            draw.text((width // 2 + offset[0], subtitle_y + offset[1]), subtitle,
                     font=subtitle_font, fill=(0, 0, 0, 200), anchor="mm")

        sub_text_color = (255, 255, 255) if c["is_dark"] else (15, 15, 25)
        draw.text((width // 2, subtitle_y), subtitle, font=subtitle_font, fill=sub_text_color, anchor="mm")

    # Corner dots
    corner_dot_size = 8
    for cx, cy in [(50, 50), (width - 50, 50), (50, height - 50), (width - 50, height - 50)]:
        draw.ellipse([(cx - corner_dot_size, cy - corner_dot_size),
                     (cx + corner_dot_size, cy + corner_dot_size)], fill=c["accent_color"])

    # Save
    rgb_img = Image.merge("RGB", img.split()[:3])
    rgb_img.save(output_path, quality=95)

    mode = "auto" if not colors_json else "AI recommended"
    print(f"✅ Saved: {output_path}")
    print(f"   Color mode: {mode}")
    print(f"   Text: {c['text_color']}, Accent: {c['accent_color']}, Glow: {c['glow_color']}")


def main():
    if len(sys.argv) < 4:
        print("Usage: python add_cover_text.py <background> <output> <title> [subtitle] [colors_json]")
        print("\nColors JSON (optional):")
        print('  {"text_color":"#ffffff","accent_color":"#00ffff","glow_color":"#00ffff","bg_box_alpha":120}')
        sys.exit(1)

    background = sys.argv[1]
    output = sys.argv[2]
    title = sys.argv[3]
    subtitle = sys.argv[4] if len(sys.argv) > 4 else ""
    colors_json = sys.argv[5] if len(sys.argv) > 5 else None

    if not os.path.exists(background):
        print(f"❌ Background image not found: {background}")
        sys.exit(1)

    add_text_overlay(background, output, title, subtitle, colors_json)


if __name__ == "__main__":
    main()
