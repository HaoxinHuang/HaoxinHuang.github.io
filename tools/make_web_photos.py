"""Prepare photos for the Photography section.

Usage (from the site folder):
    python tools/make_web_photos.py path/to/photo1.jpg path/to/photo2.jpg ...

For each photo it writes
    assets/img/photos/<name>.jpg          long edge at most 2000 px  (shown in the viewer)
    assets/img/photos/thumbs/<name>.jpg   900 px wide                (shown in the grid)
and prints a ready-to-paste <figure> block for index.html.

Camera metadata (EXIF, including GPS location) is removed. The color profile is kept.
Needs Pillow:  python -m pip install pillow
"""
import os
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_FULL = os.path.join(ROOT, "assets", "img", "photos")
OUT_THUMB = os.path.join(OUT_FULL, "thumbs")
FULL_LONG_EDGE = 2000
THUMB_WIDTH = 900


def save_jpeg(im, path, quality, icc):
    im.save(path, "JPEG", quality=quality, optimize=True, progressive=True, icc_profile=icc)


def main(paths):
    os.makedirs(OUT_THUMB, exist_ok=True)
    for p in paths:
        name = os.path.splitext(os.path.basename(p))[0].lower().replace(" ", "-")
        im = Image.open(p)
        icc = im.info.get("icc_profile")
        im = ImageOps.exif_transpose(im).convert("RGB")  # apply camera rotation, then drop metadata

        full = im.copy()
        full.thumbnail((FULL_LONG_EDGE, FULL_LONG_EDGE), Image.LANCZOS)
        save_jpeg(full, os.path.join(OUT_FULL, name + ".jpg"), 85, icc)

        tw = THUMB_WIDTH
        th = round(im.height * tw / im.width)
        save_jpeg(im.resize((tw, th), Image.LANCZOS), os.path.join(OUT_THUMB, name + ".jpg"), 82, icc)

        print(f"""
<figure class="photo" style="--ar: {tw / th:.4f}">
  <button class="photo-btn" type="button" aria-label="View larger: TITLE">
    <img src="assets/img/photos/thumbs/{name}.jpg" data-full="assets/img/photos/{name}.jpg"
         alt="DESCRIBE THE PHOTO" width="{tw}" height="{th}" loading="lazy">
  </button>
  <figcaption><span class="photo-title">TITLE</span><span class="photo-meta">PLACE</span></figcaption>
</figure>""")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
