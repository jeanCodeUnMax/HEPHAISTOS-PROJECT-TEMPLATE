#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-.}"; SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; DST="$(cd "$TARGET" && pwd)"
for item in .agent .hephaistos .githooks scripts docs evidence .watchdog.json hephaistos.cmd hephaistos.ps1; do [ -e "$SRC/$item" ] && cp -R "$SRC/$item" "$DST/"; done
[ -d "$DST/.git" ] && git -C "$DST" config core.hooksPath .githooks || true
echo '✅ HEPHAISTOS installed.'
