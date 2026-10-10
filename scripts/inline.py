#!/usr/bin/env python3
"""Inline local stylesheets and scripts into one self-contained HTML file.

A story page is shared as a single file (an artifact, an email attachment, a static host), so the
local <link rel="stylesheet" href="..."> and <script src="..."></script> tags are replaced with the
file contents. Remote URLs (Google Fonts) are left as they are.

Usage:
    python3 scripts/inline.py template/index.html            # writes dist/index.html
    python3 scripts/inline.py my-story.html out/story.html   # explicit output path
"""
import re
import sys
from pathlib import Path

LINK = re.compile(r'<link rel="stylesheet" href="(?!https?:)([^"]+)">')
SCRIPT = re.compile(r'<script src="(?!https?:)([^"]+)"></script>')


def inline(src: Path) -> str:
    html = src.read_text(encoding="utf-8")
    base = src.parent

    def css(m):
        return "<style>\n" + (base / m.group(1)).read_text(encoding="utf-8") + "</style>"

    def js(m):
        return "<script>\n" + (base / m.group(1)).read_text(encoding="utf-8") + "</script>"

    html = LINK.sub(css, html)
    return SCRIPT.sub(js, html)


def main():
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) == 3 else Path("dist") / src.name
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(inline(src), encoding="utf-8")
    print(f"wrote {out} ({out.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
