#!/usr/bin/env python3
"""
Deterministic App Store screenshot compositor for Shelf Exposé / Food Exposé.

Builds the panels described in marketing/app-store-screenshots/STORYBOARD.md:
identical 1320x2868 canvas, identical device-frame position/scale, identical
headline typography, real on-device screen captures composited into a
programmatically-drawn phone frame. No AI generation, no network calls.

Usage:
    python scripts/build-appstore-screenshots.py

Re-running produces byte-for-byte-equivalent PNGs (same inputs -> same
pixels; only the PNG encoder's own metadata, if any, could differ across
Pillow versions -- pixel content is fully deterministic).
"""

import os
import sys

from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW_DIR = os.path.join(REPO_ROOT, "marketing", "app-store-screenshots", "raw")
OUT_DIR = os.path.join(REPO_ROOT, "marketing", "app-store-screenshots", "out")
MASCOT_DIR = os.path.join(REPO_ROOT, "assets", "mascot")

# ---------------------------------------------------------------------------
# CONFIG -- every magic number lives here so the design can be tuned in one
# place without touching the compositing logic below.
# ---------------------------------------------------------------------------

CONFIG = {
    # Canvas
    "canvas_w": 1320,
    "canvas_h": 2868,
    "safe_margin": 80,

    # Backgrounds
    "color_dark": "#157A5A",
    "color_light": "#E8F7F2",

    # Headline typography
    "headline_font_path": "C:/Windows/Fonts/seguibl.ttf",  # Segoe UI Black
    "headline_start_size": 96,
    "headline_min_size": 40,
    "headline_size_step": 2,
    "headline_top_y": 200,
    "headline_line_spacing": 1.15,
    "headline_max_lines": 2,
    "headline_color_on_dark": "#FFFFFF",
    "headline_color_on_light": "#1A2E28",
    "headline_emphasis_color": "#2EC090",

    # Wordmark (panel 1)
    "wordmark_font_path": "C:/Windows/Fonts/segoeuib.ttf",  # Segoe UI Bold
    "wordmark_text": "Food Exposé",
    "wordmark_size": 64,
    "wordmark_color": "#FFFFFF",
    "wordmark_gap_below_specs": 56,

    # Device frame -- identical scale + position on every panel that has one
    "frame_width": 840,
    "frame_top_y": 760,
    # Height derived from the real capture aspect ratio (1170x2532) so the
    # drawn bezel reads as a genuine phone silhouette rather than an
    # arbitrary rectangle. Kept in CONFIG (not hardcoded in logic) so a
    # future capture size change only requires editing capture_w/h below.
    "capture_w": 1170,
    "capture_h": 2532,
    "bezel_color": "#1A2E28",
    "bezel_thickness": 14,
    "frame_outer_radius": 64,
    "frame_inner_radius": 52,

    # Drop shadow behind the device frame
    "shadow_color": (0, 0, 0),
    "shadow_alpha": 90,
    "shadow_blur_radius": 36,
    "shadow_offset_y": 22,
    "shadow_expand": 6,  # shadow rect drawn slightly larger than the bezel

    # Specs mascot
    "specs_source": os.path.join(MASCOT_DIR, "specs-standing.png"),
    "specs_hero_height": 900,   # panel 1
    "specs_intro_height": 760,  # panel 2 -- sized to fill the safe width together
                                 # with the enlarged chip column, close to panel 1's
                                 # visual weight (see report for the width math)
    "content_block_bottom_margin": 220,  # bottom breathing room for non-frame panels
    "content_block_top_gap": 100,        # gap between headline bottom and content block

    # Panel 2 verdict-chip crop. Sourced from low-score-hero.png rather than
    # ingredients-breakdown.png: ingredients-breakdown.png's row sits right
    # under the floating back-button defect (a gray semicircle bled into
    # the "Bad" chip when first tried -- caught in review), and
    # low-score-hero.png shows the identical 9 Bad / 19 Okay / 38 Good row
    # further down its scroll position with nothing overlapping it.
    # Coordinates derived by pixel inspection -- see report. Each chip
    # cropped individually and stacked, rather than cropping the wide 3-up
    # strip, so the chips can be scaled to fill the vertical space next to
    # Specs.
    "chip_source": "low-score-hero.png",
    "chip_row_y_top": 1980,
    "chip_row_y_bottom": 2093,
    "chip_bounds_x": {
        "bad": (60, 389),
        "okay": (420, 749),
        "good": (780, 1109),
    },
    "chip_stack_gap": 24,
    "chip_column_gap": 64,  # gap between Specs and the chip column

    # Every device capture has a live iOS status bar (time/signal/battery)
    # burned into the top of the image. Panel 5's defect crop already cuts
    # well past it; crop it out of the other device panels too so the set
    # doesn't show a clock on some panels and not others (see report).
    # 120px clears the status bar icons (which end ~y100) while staying
    # safely above the in-app back button (which starts ~y163) on every
    # capture that has one.
    "status_bar_crop_top": 120,

    # Panel 5 defect workaround: ingredients-breakdown.png has a floating
    # back button overlapping the top of the verdict-chip row (see report
    # for the pixel trace). Cropping the source at this y before scaling
    # into the frame removes the tab row AND the button (and, as a side
    # effect, the status bar too -- 298 > status_bar_crop_top), starting
    # the visible capture right at the verdict chips.
    "ingredients_defect_crop_top": 298,
}

# ---------------------------------------------------------------------------
# Panel specs
# ---------------------------------------------------------------------------

PANELS = [
    {
        "file": "01-hook.png",
        "bg": "dark",
        "headline": "Know what's really in your food.",
        "emphasis": None,
        "kind": "hook",
    },
    {
        "file": "02-specs.png",
        "bg": "light",
        "headline": "Hi, I'm Specs. I read every label so you don't have to.",
        "emphasis": None,
        "kind": "specs_intro",
    },
    {
        "file": "03-problem.png",
        "bg": "dark",
        "headline": "The front of the box is marketing.",
        "emphasis": "marketing.",
        "kind": "device",
        "capture": "low-score-hero.png",
        "source_crop_top": CONFIG["status_bar_crop_top"],
    },
    {
        "file": "04-money.png",
        "bg": "dark",
        "headline": "See who owns your food. And who they pay.",
        "emphasis": "who they pay.",
        "kind": "device",
        "capture": "company-money-trail.png",
        "source_crop_top": CONFIG["status_bar_crop_top"],
    },
    {
        "file": "05-ingredients.png",
        "bg": "light",
        "headline": "Every ingredient, in plain English.",
        "emphasis": "plain English.",
        "kind": "device",
        "capture": "ingredients-breakdown.png",
        "source_crop_top": CONFIG["ingredients_defect_crop_top"],
    },
    {
        "file": "07-better.png",
        "bg": "dark",
        "headline": "Find the better option.",
        "emphasis": "better option.",
        "kind": "device",
        "capture": "better-picks.png",
        "source_crop_top": CONFIG["status_bar_crop_top"],
    },
]

# Panels 06 and 08 are lifestyle panels awaiting imagery (Emily / Maya+Matt
# composites per STORYBOARD.md). Hooks left here intentionally -- do not
# fabricate placeholder people. When the plates exist, add entries with
# kind="lifestyle" and extend build_panel() with a lifestyle branch that
# composites the plate + device-frame score card, matching this same
# CONFIG-driven headline/background system.
LIFESTYLE_PANELS_PENDING = ["06-know-before-you-buy.png", "08-guesswork.png"]


# ---------------------------------------------------------------------------
# Small helpers
# ---------------------------------------------------------------------------

def require_file(path, context):
    if not os.path.isfile(path):
        raise SystemExit(
            f"FATAL: missing required source file for {context}:\n  {path}\n"
            "Refusing to emit a broken panel."
        )
    return path


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


_font_cache = {}


def get_font(path, size):
    key = (path, size)
    if key not in _font_cache:
        require_file(path, f"font @{size}px")
        _font_cache[key] = ImageFont.truetype(path, size)
    return _font_cache[key]


def rounded_rect_mask(w, h, radius, supersample=4):
    """Anti-aliased single-channel mask of a rounded rect, size (w, h)."""
    big = Image.new("L", (w * supersample, h * supersample), 0)
    d = ImageDraw.Draw(big)
    d.rounded_rectangle(
        (0, 0, w * supersample - 1, h * supersample - 1),
        radius=radius * supersample,
        fill=255,
    )
    return big.resize((w, h), Image.LANCZOS)


def draw_drop_shadow(canvas_rgba, box, radius, cfg):
    """Paints a soft blurred rounded-rect shadow onto canvas_rgba (RGBA)."""
    x0, y0, x1, y1 = box
    expand = cfg["shadow_expand"]
    blur = cfg["shadow_blur_radius"]
    pad = blur * 3  # room for the blur to breathe without edge clipping

    layer_w = (x1 - x0) + 2 * pad
    layer_h = (y1 - y0) + 2 * pad
    shadow_layer = Image.new("RGBA", (layer_w, layer_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(shadow_layer)
    sx0 = pad - expand
    sy0 = pad - expand + cfg["shadow_offset_y"]
    sx1 = pad + (x1 - x0) + expand
    sy1 = pad + (y1 - y0) + expand + cfg["shadow_offset_y"]
    d.rounded_rectangle(
        (sx0, sy0, sx1, sy1),
        radius=radius + expand,
        fill=cfg["shadow_color"] + (cfg["shadow_alpha"],),
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(blur))

    paste_x = x0 - pad
    paste_y = y0 - pad
    canvas_rgba.alpha_composite(shadow_layer, (paste_x, paste_y))


# ---------------------------------------------------------------------------
# Headline rendering (auto-shrink, 2-line max, centered, optional emphasis
# run rendered in the accent colour -- built as word-level runs so the
# emphasis phrase colours correctly even if it straddles the line break)
# ---------------------------------------------------------------------------

def build_word_runs(text, emphasis):
    """Return list of (word, is_emphasis) preserving text's word order."""
    if not emphasis or emphasis not in text:
        return [(w, False) for w in text.split()]
    idx = text.find(emphasis)
    before, after = text[:idx], text[idx + len(emphasis):]
    runs = [(w, False) for w in before.split()]
    runs += [(w, True) for w in emphasis.split()]
    runs += [(w, False) for w in after.split()]
    return runs


def wrap_runs(draw, runs, font, max_width, space_width):
    lines = []
    current = []
    current_width = 0
    for word, is_emph in runs:
        w = draw.textlength(word, font=font)
        add_width = w if not current else w + space_width
        if current and current_width + add_width > max_width:
            lines.append(current)
            current = [(word, is_emph, w)]
            current_width = w
        else:
            current.append((word, is_emph, w))
            current_width += add_width
    if current:
        lines.append(current)
    return lines


def fit_headline(draw, text, emphasis, max_width, cfg):
    runs = build_word_runs(text, emphasis)
    size = cfg["headline_start_size"]
    min_size = cfg["headline_min_size"]
    step = cfg["headline_size_step"]
    max_lines = cfg["headline_max_lines"]

    while True:
        font = get_font(cfg["headline_font_path"], size)
        space_width = draw.textlength(" ", font=font)
        lines = wrap_runs(draw, runs, font, max_width, space_width)
        if len(lines) <= max_lines or size <= min_size:
            return font, lines, size
        size -= step


def render_headline(draw, text, emphasis, cfg, on_dark):
    max_width = cfg["canvas_w"] - 2 * cfg["safe_margin"]
    font, lines, size = fit_headline(draw, text, emphasis, max_width, cfg)
    if len(lines) > cfg["headline_max_lines"]:
        print(
            f"WARNING: headline '{text}' still wraps to {len(lines)} lines "
            f"at floor size {size}px -- consider shortening it.",
            file=sys.stderr,
        )

    base_color = cfg["headline_color_on_dark"] if on_dark else cfg["headline_color_on_light"]
    emphasis_color = cfg["headline_emphasis_color"]

    ascent, descent = font.getmetrics()
    line_height = int((ascent + descent) * cfg["headline_line_spacing"])
    space_width = draw.textlength(" ", font=font)

    y = cfg["headline_top_y"]
    cx = cfg["canvas_w"] / 2
    for line in lines:
        total_width = sum(w for _, _, w in line) + space_width * (len(line) - 1)
        x = cx - total_width / 2
        for word, is_emph, w in line:
            color = emphasis_color if is_emph else base_color
            draw.text((x, y), word, font=font, fill=color)
            x += w + space_width
        y += line_height

    block_bottom = cfg["headline_top_y"] + line_height * len(lines)
    return block_bottom


# ---------------------------------------------------------------------------
# Device frame
# ---------------------------------------------------------------------------

def frame_geometry(cfg):
    fw = cfg["frame_width"]
    fh = round(fw * cfg["capture_h"] / cfg["capture_w"])
    fx = (cfg["canvas_w"] - fw) // 2
    fy = cfg["frame_top_y"]
    return fx, fy, fw, fh


def draw_device_frame(canvas_rgb, screenshot_path, cfg, source_crop_top=0):
    fx, fy, fw, fh = frame_geometry(cfg)
    t = cfg["bezel_thickness"]
    inner_x0, inner_y0 = fx + t, fy + t
    inner_w, inner_h = fw - 2 * t, fh - 2 * t

    # Shadow + bezel drawn on an RGBA overlay, then flattened onto the RGB
    # canvas (keeps the final export alpha-free, per Apple's requirement).
    overlay = Image.new("RGBA", canvas_rgb.size, (0, 0, 0, 0))
    draw_drop_shadow(overlay, (fx, fy, fx + fw, fy + fh), cfg["frame_outer_radius"], cfg)

    bezel_layer = Image.new("RGBA", canvas_rgb.size, (0, 0, 0, 0))
    bd = ImageDraw.Draw(bezel_layer)
    bd.rounded_rectangle(
        (fx, fy, fx + fw, fy + fh),
        radius=cfg["frame_outer_radius"],
        fill=hex_to_rgb(cfg["bezel_color"]) + (255,),
    )
    overlay.alpha_composite(bezel_layer)

    canvas_rgba = canvas_rgb.convert("RGBA")
    canvas_rgba.alpha_composite(overlay)
    canvas_rgb.paste(canvas_rgba.convert("RGB"), (0, 0))

    # Screenshot content, cropped/scaled to the inner screen, rounded to
    # match the inner bezel edge on all four corners.
    #
    # "Scale to inner width" alone leaves a gap at the bottom whenever the
    # source's aspect ratio (after any defect crop) is wider than the
    # frame's inner aspect ratio -- the inner screen (812x1790) isn't
    # exactly the capture aspect (1170x2532), and defect-cropping a source
    # shortens it further. Rather than padding that gap with bezel colour
    # (which reads as a broken dark strip -- caught during review of
    # panel 5), use "cover" scaling: scale by whichever axis needs more
    # zoom so the frame is always fully covered, top-aligned, with any
    # horizontal overflow trimmed evenly from both sides.
    shot = Image.open(screenshot_path).convert("RGB")
    if source_crop_top:
        shot = shot.crop((0, source_crop_top, shot.width, shot.height))

    scale = max(inner_w / shot.width, inner_h / shot.height)
    scaled_w = max(inner_w, round(shot.width * scale))
    scaled_h = max(inner_h, round(shot.height * scale))
    shot = shot.resize((scaled_w, scaled_h), Image.LANCZOS)

    crop_left = (scaled_w - inner_w) // 2
    shot = shot.crop((crop_left, 0, crop_left + inner_w, inner_h))

    # The pasted screen must fully cover the frame's inner rect -- no
    # bezel-coloured dead space should ever be visible behind it.
    assert shot.size == (inner_w, inner_h), (
        f"screen content {shot.size} does not exactly cover the frame's "
        f"inner rect {(inner_w, inner_h)} for {screenshot_path}"
    )

    mask = rounded_rect_mask(inner_w, inner_h, cfg["frame_inner_radius"])
    canvas_rgb.paste(shot, (inner_x0, inner_y0), mask)

    return fx, fy, fw, fh


# ---------------------------------------------------------------------------
# Specs mascot + chip crops (panels 1 and 2)
# ---------------------------------------------------------------------------

def load_specs(target_height, cfg):
    path = require_file(cfg["specs_source"], "Specs mascot")
    im = Image.open(path)
    im = im.convert("RGBA") if im.mode != "RGBA" else im
    # specs-standing.png already carries a real alpha channel (verified by
    # inspection: alpha extrema (0, 255)) so no background keying needed.
    scale = target_height / im.height
    target_width = round(im.width * scale)
    return im.resize((target_width, target_height), Image.LANCZOS)


def paste_rgba(canvas_rgb, rgba_img, xy):
    canvas_rgba = canvas_rgb.convert("RGBA")
    canvas_rgba.alpha_composite(rgba_img, xy)
    canvas_rgb.paste(canvas_rgba.convert("RGB"), (0, 0))


def crop_chip(chip_source_path, key, cfg):
    x0, x1 = cfg["chip_bounds_x"][key]
    y0, y1 = cfg["chip_row_y_top"], cfg["chip_row_y_bottom"]
    pad = 6
    im = Image.open(chip_source_path).convert("RGB")
    box = (max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad))
    return im.crop(box)


# ---------------------------------------------------------------------------
# Panel builders
# ---------------------------------------------------------------------------

def new_canvas(bg_key, cfg):
    color = cfg["color_dark"] if bg_key == "dark" else cfg["color_light"]
    return Image.new("RGB", (cfg["canvas_w"], cfg["canvas_h"]), hex_to_rgb(color))


def build_hook_panel(spec, cfg):
    canvas = new_canvas(spec["bg"], cfg)
    draw = ImageDraw.Draw(canvas)
    headline_bottom = render_headline(draw, spec["headline"], spec["emphasis"], cfg, on_dark=True)

    specs_img = load_specs(cfg["specs_hero_height"], cfg)
    wordmark_font = get_font(cfg["wordmark_font_path"], cfg["wordmark_size"])
    wm_bbox = draw.textbbox((0, 0), cfg["wordmark_text"], font=wordmark_font)
    wm_h = wm_bbox[3] - wm_bbox[1]

    content_h = specs_img.height + cfg["wordmark_gap_below_specs"] + wm_h
    top_bound = headline_bottom + cfg["content_block_top_gap"]
    bottom_bound = cfg["canvas_h"] - cfg["content_block_bottom_margin"]
    block_top = top_bound + max(0, (bottom_bound - top_bound - content_h) // 2)

    specs_x = (cfg["canvas_w"] - specs_img.width) // 2
    paste_rgba(canvas, specs_img, (specs_x, block_top))

    wm_y = block_top + specs_img.height + cfg["wordmark_gap_below_specs"]
    wm_w = wm_bbox[2] - wm_bbox[0]
    draw = ImageDraw.Draw(canvas)
    draw.text(
        ((cfg["canvas_w"] - wm_w) / 2 - wm_bbox[0], wm_y - wm_bbox[1]),
        cfg["wordmark_text"],
        font=wordmark_font,
        fill=cfg["wordmark_color"],
    )
    return canvas


def build_specs_intro_panel(spec, cfg, chip_source_path):
    canvas = new_canvas(spec["bg"], cfg)
    draw = ImageDraw.Draw(canvas)
    headline_bottom = render_headline(draw, spec["headline"], spec["emphasis"], cfg, on_dark=False)

    specs_img = load_specs(cfg["specs_intro_height"], cfg)

    chips = [crop_chip(chip_source_path, k, cfg) for k in ("bad", "okay", "good")]
    gap = cfg["chip_stack_gap"]
    available_h = specs_img.height
    chip_h_each = (available_h - gap * (len(chips) - 1)) // len(chips)
    chip_widths = []
    resized_chips = []
    for c in chips:
        scale = chip_h_each / c.height
        w = round(c.width * scale)
        resized_chips.append(c.resize((w, chip_h_each), Image.LANCZOS))
        chip_widths.append(w)
    chip_col_w = max(chip_widths)

    total_w = specs_img.width + cfg["chip_column_gap"] + chip_col_w
    max_w = cfg["canvas_w"] - 2 * cfg["safe_margin"]
    assert total_w <= max_w, (
        f"panel 2 content ({total_w}px) exceeds the safe width ({max_w}px) -- "
        "reduce specs_intro_height."
    )
    content_h = max(specs_img.height, chip_h_each * len(chips) + gap * (len(chips) - 1))

    top_bound = headline_bottom + cfg["content_block_top_gap"]
    bottom_bound = cfg["canvas_h"] - cfg["content_block_bottom_margin"]
    block_top = top_bound + max(0, (bottom_bound - top_bound - content_h) // 2)
    block_left = (cfg["canvas_w"] - total_w) // 2

    specs_y = block_top + (content_h - specs_img.height) // 2
    paste_rgba(canvas, specs_img, (block_left, specs_y))

    chip_x = block_left + specs_img.width + cfg["chip_column_gap"]
    y = block_top
    for chip_img in resized_chips:
        cx = chip_x + (chip_col_w - chip_img.width) // 2
        canvas.paste(chip_img, (cx, y))
        y += chip_h_each + gap

    return canvas


def build_device_panel(spec, cfg, capture_path):
    canvas = new_canvas(spec["bg"], cfg)
    draw = ImageDraw.Draw(canvas)
    on_dark = spec["bg"] == "dark"
    render_headline(draw, spec["headline"], spec["emphasis"], cfg, on_dark=on_dark)

    draw_device_frame(canvas, capture_path, cfg, source_crop_top=spec.get("source_crop_top", 0))
    return canvas


def build_panel(spec, cfg):
    if spec["kind"] == "hook":
        return build_hook_panel(spec, cfg)
    if spec["kind"] == "specs_intro":
        chip_source_path = require_file(
            os.path.join(RAW_DIR, cfg["chip_source"]), spec["file"]
        )
        return build_specs_intro_panel(spec, cfg, chip_source_path)
    if spec["kind"] == "device":
        capture_path = require_file(os.path.join(RAW_DIR, spec["capture"]), spec["file"])
        return build_device_panel(spec, cfg, capture_path)
    raise SystemExit(f"FATAL: unknown panel kind '{spec['kind']}' for {spec['file']}")


# ---------------------------------------------------------------------------
# Contact sheet
# ---------------------------------------------------------------------------

def build_contact_sheet(built_paths, cfg):
    thumb_w = 300
    label_h = 40
    thumbs = []
    for path in built_paths:
        im = Image.open(path)
        scale = thumb_w / im.width
        thumb_h = round(im.height * scale)
        thumbs.append((os.path.basename(path), im.resize((thumb_w, thumb_h), Image.LANCZOS)))

    max_h = max(t.height for _, t in thumbs)
    sheet_w = thumb_w * len(thumbs)
    sheet_h = max_h + label_h
    sheet = Image.new("RGB", (sheet_w, sheet_h), (255, 255, 255))
    draw = ImageDraw.Draw(sheet)
    label_font = get_font(cfg["wordmark_font_path"], 22)

    x = 0
    for name, thumb in thumbs:
        sheet.paste(thumb, (x, 0))
        bbox = draw.textbbox((0, 0), name, font=label_font)
        text_w = bbox[2] - bbox[0]
        draw.text((x + (thumb_w - text_w) / 2, max_h + 6), name, font=label_font, fill=(20, 20, 20))
        x += thumb_w

    out_path = os.path.join(OUT_DIR, "_contact-sheet.png")
    sheet.save(out_path)
    return out_path, sheet.size


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    built_paths = []
    for spec in PANELS:
        canvas = build_panel(spec, CONFIG)

        assert canvas.size == (CONFIG["canvas_w"], CONFIG["canvas_h"]), (
            f"{spec['file']}: expected {CONFIG['canvas_w']}x{CONFIG['canvas_h']}, "
            f"got {canvas.size[0]}x{canvas.size[1]}"
        )
        assert canvas.mode == "RGB", f"{spec['file']}: expected RGB, got {canvas.mode}"

        out_path = os.path.join(OUT_DIR, spec["file"])
        canvas.save(out_path, "PNG")
        built_paths.append(out_path)
        print(f"built {out_path}  ({canvas.width}x{canvas.height}, {canvas.mode})")

    sheet_path, sheet_size = build_contact_sheet(built_paths, CONFIG)
    print(f"built {sheet_path}  ({sheet_size[0]}x{sheet_size[1]})")

    print(
        f"\n{len(built_paths)} panels built. Pending lifestyle panels "
        f"(no imagery yet, not fabricated): {', '.join(LIFESTYLE_PANELS_PENDING)}"
    )


if __name__ == "__main__":
    main()
