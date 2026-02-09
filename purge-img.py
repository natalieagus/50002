#!/usr/bin/env python3
"""
Find images under current directory (excluding ./_site) that are NOT referenced
by any .md, .yml/.yaml, or .html file (also excluding ./_site).

Fix: resolves relative image refs (e.g. ../../assets/x.png) relative to the file
they appear in, so comparisons are correct.

Output: purge-image (one repo-relative image path per line)

When you check and want to delete them, use
# from repo root
grep -vE '^\s*($|#)' purge-image | while IFS= read -r f; do
  rm -f -- "./$f"
done
"""

from __future__ import annotations

import os
import re
from pathlib import Path
from urllib.parse import unquote

IMAGE_EXTS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif",
    ".bmp", ".tif", ".tiff", ".ico",
}
TEXT_EXTS = {".md", ".yml", ".yaml", ".html"}

IMG_REF_RE = re.compile(
    r"""(?ix)
    (?P<path>
        (?:[A-Z0-9_./\\\-]|%[0-9A-F]{2})+    # path-ish chars + URL encoding
        \.(?:png|jpe?g|gif|svg|webp|avif|bmp|tiff?|ico)
    )
    (?:[?#][^"' )\]\}\s]*)?                 # optional query/hash
    """
)

def should_skip_dir(dirpath: str) -> bool:
    return "_site" in Path(dirpath).parts

def walk_files(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        if should_skip_dir(dirpath):
            dirnames[:] = []
            continue
        dirnames[:] = [d for d in dirnames if d != "_site"]
        for fn in filenames:
            yield Path(dirpath) / fn

def norm_rel_from_root(p: Path, root: Path) -> str:
    rel = p.resolve().relative_to(root.resolve())
    return rel.as_posix()

def norm_ref_string(raw: str) -> str:
    s = unquote(raw).strip()
    s = re.split(r"[?#]", s, maxsplit=1)[0]
    s = s.replace("\\", "/")
    while s.startswith("./"):
        s = s[2:]
    # keep leading "/" for now; we'll handle it in resolve step
    s = re.sub(r"/{2,}", "/", s)
    return s

def resolve_ref_to_repo_path(ref: str, text_file: Path, repo_root: Path) -> str | None:
    """
    Convert a found reference string into a repo-root-relative POSIX path, if possible.
    Returns None if it can't be mapped into the repo.
    """
    if not ref:
        return None

    # Ignore obvious external/data refs if they sneak in (rare with this regex)
    low = ref.lower()
    if low.startswith("http://") or low.startswith("https://") or low.startswith("data:"):
        return None

    try:
        if ref.startswith("/"):
            # Treat as repo-root-relative (strip leading slash)
            candidate = (repo_root / ref.lstrip("/")).resolve()
        else:
            # Treat as relative to the file containing the reference
            candidate = (text_file.parent / ref).resolve()

        # Must be inside repo
        candidate_rel = candidate.relative_to(repo_root.resolve()).as_posix()
        return candidate_rel
    except Exception:
        return None

def main() -> int:
    repo_root = Path(".").resolve()

    images: list[Path] = []
    text_files: list[Path] = []

    for p in walk_files(Path(".")):
        ext = p.suffix.lower()
        if ext in IMAGE_EXTS:
            images.append(p)
        elif ext in TEXT_EXTS:
            text_files.append(p)

    rel_images: list[str] = [norm_rel_from_root(img, repo_root) for img in images]
    rel_images_set = set(rel_images)

    # Track references as repo-root-relative paths
    referenced_repo_paths: set[str] = set()

    for tf in text_files:
        try:
            data = tf.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        for m in IMG_REF_RE.finditer(data):
            raw = m.group("path")
            ref = norm_ref_string(raw)

            resolved = resolve_ref_to_repo_path(ref, tf.resolve(), repo_root)
            if resolved:
                # Store normalized POSIX path
                referenced_repo_paths.add(resolved)

    # Anything referenced that exists (or could exist) should exclude from purge
    purge = sorted(p for p in rel_images if p not in referenced_repo_paths)

    Path("purge-image").write_text("\n".join(purge) + ("\n" if purge else ""), encoding="utf-8")

    print(f"Images found: {len(rel_images)}")
    print(f"Text files scanned: {len(text_files)}")
    print(f"Referenced (resolved) paths: {len(referenced_repo_paths)}")
    print(f"Unreferenced images: {len(purge)}")
    print("Wrote: purge-image")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
