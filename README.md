# Personal academic website

A one-page site in plain HTML and CSS. There is no build step. GitHub Pages serves the files as they are.

Design: flat (solid colors, no shadows or gradients), low-saturation blue, green and gray, with a light and a dark mode.

## Files

```text
index.html                 all page content (search for "EDIT" to find what to change)
assets/css/style.css       all styling; colors are tokens at the top of the file
assets/js/main.js          light/dark toggle, phone menu, photo viewer
assets/img/favicon.svg     browser-tab icon
assets/img/photos/         your photographs (full size; thumbs/ holds the grid copies)
tools/make_web_photos.py   prepares new photos for the gallery
files/cv.pdf               your CV (add this file)
.nojekyll                  tells GitHub Pages to serve files as-is
```

## Edit the content

1. Open `index.html` and search for `EDIT`. Replace every `[bracketed]` placeholder and `Your Name`.
2. **Photo of you:** save it as `assets/img/photo.jpg`. In the About section, replace
   `<span aria-hidden="true">YN</span>` with `<img src="assets/img/photo.jpg" alt="Portrait of Your Name">`.
3. **CV:** save your CV as `files/cv.pdf`.
4. **Publications:** copy one `<li class="pub">…</li>` block per paper.
   The type tag uses `type-journal`, `type-conf` or `type-preprint`.

## Add research videos and images

1. Put the files in `assets/media/` (create the folder).
2. In the Research section, replace a `<div class="media media-ph">…</div>` placeholder with one of:
   ```html
   <div class="media"><video src="assets/media/clip.mp4" poster="assets/media/clip.jpg"
        controls muted loop playsinline preload="metadata"></video></div>

   <div class="media"><img src="assets/media/figure.png" alt="Short description"></div>
   ```
3. The frame is 16:9 and shows the whole video or image. Add `cover` (`class="media cover"`) to fill the frame instead,
   or `natural` (`class="media natural"`) to keep a wide figure's own shape (as in the current project).
   Add `data-autoplay` to a `<video>` to make it play muted while it is on screen.
4. Keep videos short and small: MP4 (H.264), under ~10 MB each. GitHub refuses files over 100 MB.
   For long videos, upload to YouTube and embed the player instead.

## Add your photographs

1. Run the helper script on your exported photos:
   ```bash
   python tools/make_web_photos.py "D:/Photos/new-photo.jpg"
   ```
   It writes a 2000-px copy (for the viewer) and a 900-px copy (for the grid) into `assets/img/photos/`,
   removes camera metadata such as GPS location, and prints a `<figure>` block.
2. Paste that block into one of the `<div class="photo-row">` blocks in `index.html` (or start a new row),
   then fill in the title, place and `alt` text.

Each row holds 2–4 photos, and all photos in a row get the same height. This works because each photo's width
is proportional to its aspect ratio `--ar` = width / height (the script prints it). A row's height is
(row width − gaps) / (sum of `--ar`), so a row whose `--ar` values add up to about 3–4 gives a good height.
The first photo (`photo-feature`) is a full-width banner, which suits a wide panorama.
On phones every photo is shown full width, one below the other.

## Change colors

All colors are at the top of `assets/css/style.css`: one block for light mode and one for dark mode.
For example, change `--blue` to recolor buttons, the logo square and the contact panel.

## Preview locally

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Then open http://127.0.0.1:8000.

## Publish on GitHub Pages

1. On GitHub, create a **public** repository named exactly `<your-username>.github.io`.
2. Push these files to its `main` branch.
3. In the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
4. After 1–2 minutes the site is live at `https://<your-username>.github.io`.
