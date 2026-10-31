import os
import urllib.request
import re

base_url = "https://picasso-ecommerce-template.modulify.website"
dest_dir = "/Users/huynhtronghieu/Documents/Website/clone-website-dep/v2/public"

images = [
    "/picasso/paint-1.jpg",
    "/picasso/paint-2.jpg",
    "/picasso/paint-3.jpg",
    "/picasso/paint-4.jpg",
    "/picasso/paint-5.jpg",
    "/picasso/paint-6.jpg",
    "/picasso/paint-7.jpg",
    "/picasso/frame.png",
    "/picasso/wall-bg.jpg",
    "/picasso/painter-sample-bottom.png",
    "/picasso/left-award-symbol.svg",
    "/picasso/right-award-symbol.svg",
    "/picasso/author-elena.jpg",
    "/picasso/author-tomas.jpg",
    "/picasso/author-amara.jpg",
    "/favicon.png"
]

chunks = [
    "/_next/static/chunks/17nagvry~1smd.js",
    "/_next/static/chunks/0buxfi17ab.by.js",
    "/_next/static/chunks/01urhca42dln0.js",
    "/_next/static/chunks/turbopack-0zsou4i2o1f8t.js",
    "/_next/static/chunks/09t1bkjuvwkrs.js",
    "/_next/static/chunks/turbopack-02r2nl~y-lgvc.js",
    "/_next/static/chunks/0sswu-nb87u3y.js",
    "/_next/static/chunks/0h6f1r2.uhv3f.js",
    "/_next/static/chunks/143re0x3xqmov.js",
    "/_next/static/chunks/0txjufvf6ju__.js",
    "/_next/static/chunks/0qkyt_e2n18cm.js",
    "/_next/static/chunks/0hnb2k5i13_-m.js",
    "/_next/static/chunks/0owcto_a3-i48.js",
    "/_next/static/chunks/16-7n5-6s~y2n.js",
    "/_next/static/-I6RERx90RyiEoRY7pP4c/_buildManifest.js",
    "/_next/static/-I6RERx90RyiEoRY7pP4c/_ssgManifest.js",
    "/_next/static/-I6RERx90RyiEoRY7pP4c/_clientMiddlewareManifest.js",
    "/_next/static/chunks/17b-_nitx5xwj.css"
]

def download_file(path_str):
    url = base_url + path_str
    local_path = os.path.join(dest_dir, path_str.lstrip("/"))
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp, open(local_path, "wb") as f:
            content = resp.read()
            f.write(content)
            print(f"Downloaded: {path_str} ({len(content)} bytes)")
    except Exception as e:
        print(f"FAILED: {path_str} -> {e}")

# 1. Download images
print("--- Downloading images ---")
for img in images:
    download_file(img)

# 2. Download chunks & css
print("--- Downloading JS chunks & CSS ---")
for c in chunks:
    download_file(c)

# 3. Check CSS for fonts & assets
css_path = os.path.join(dest_dir, "_next/static/chunks/17b-_nitx5xwj.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
    fonts = re.findall(r'url\((/[^)]+)\)', css)
    print(f"--- Downloading {len(fonts)} fonts/assets found in CSS ---")
    for font_url in fonts:
        clean_url = font_url.strip("\"' ")
        download_file(clean_url)

# 4. Scan all downloaded JS chunks for additional static files
print("--- Scanning JS chunks for additional references ---")
all_found = set()
for root, _, files in os.walk(os.path.join(dest_dir, "_next/static")):
    for file in files:
        if file.endswith(".js"):
            fp = os.path.join(root, file)
            with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                txt = f.read()
            refs = re.findall(r'static/(?:chunks|media)/[a-zA-Z0-9_\-\.\~]+(?:\.js|\.css|\.woff2)', txt)
            for r in refs:
                all_found.add("/_next/" + r)

print(f"Found {len(all_found)} total references in JS. Downloading any missing ones...")
for ref in all_found:
    download_file(ref)

print("--- Asset download complete! ---")

