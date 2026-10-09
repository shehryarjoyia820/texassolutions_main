"""Brand assets for texassolutions.co from the dispatch.texassolutions.co logo.

    python scripts/brand-assets.py   (needs Pillow)

Writes public/brand/*, the favicons, app icons and public/og/default.png.
Sources (logo, icon, font) are in scripts/brand-src, copied from
dispatch.texassolutions.co.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "brand-src"
PUB = ROOT / "public"
FONT = SRC / "Archivo-Variable.ttf"
(PUB / "brand").mkdir(exist_ok=True)

logo = Image.open(SRC / "texas-solutions-logo.png").convert("RGBA")
icon = Image.open(SRC / "texas-solutions-icon.png").convert("RGBA")

# Header/footer logo: 2x of the largest display size (about 56px tall).
w = 480
logo.resize((w, round(logo.height * w / logo.width)), Image.LANCZOS).save(PUB / "brand" / "texas-solutions-logo.png", optimize=True)
h = 128
icon.resize((round(icon.width * h / icon.height), h), Image.LANCZOS).save(PUB / "brand" / "texas-solutions-icon.png", optimize=True)


def square(size, pad=0.12, bg=None):
    canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
    box = int(size * (1 - 2 * pad))
    scale = min(box / icon.width, box / icon.height)
    im = icon.resize((max(1, round(icon.width * scale)), max(1, round(icon.height * scale))), Image.LANCZOS)
    canvas.paste(im, ((size - im.width) // 2, (size - im.height) // 2), im)
    return canvas


square(32, pad=0.04).save(PUB / "favicon-32.png", optimize=True)
square(192).save(PUB / "icon-192.png", optimize=True)
square(512).save(PUB / "icon-512.png", optimize=True)
# Apple touch icons are shown on a tile, so give it a white background.
square(180, pad=0.16, bg=(255, 255, 255, 255)).convert("RGB").save(PUB / "apple-touch-icon.png", optimize=True)
square(48, pad=0.04).save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


def font(size, weight):
    f = ImageFont.truetype(str(FONT), size)
    try:
        f.set_variation_by_axes([weight, 100])
    except Exception:
        pass
    return f


# Open Graph image, light brand style.
W, H = 1200, 630
og = Image.new("RGB", (W, H), (250, 249, 247))
glow = Image.new("L", (W, H), 0)
ImageDraw.Draw(glow).ellipse([700, -260, 1500, 380], fill=60)
glow = glow.filter(ImageFilter.GaussianBlur(110))
og.paste(Image.new("RGB", (W, H), (255, 122, 26)), (0, 0), glow)
lw = 430
lg = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
og.paste(lg, (80, 80), lg)
d = ImageDraw.Draw(og)
d.text((80, 300), "Custom Web Platforms & Software", font=font(60, 800), fill=(20, 17, 15))
d.text((80, 378), "Built for Modern Enterprises", font=font(60, 800), fill=(224, 82, 10))
d.text((80, 520), "texassolutions.co  ·  Published pricing in US dollars  ·  (838) 910-3147", font=font(28, 500), fill=(92, 87, 82))
d.rectangle([0, H - 10, W, H], fill=(224, 82, 10))
og.save(PUB / "og" / "default.png", optimize=True)
print("brand assets written")
