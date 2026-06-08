#!/usr/bin/env bash
# Local dev server — auto-reload is built into index.html on local IPs.
cd "$(dirname "$0")"
echo "Serving at http://localhost:8080"
echo "Phone (same Wi-Fi): http://$(ipconfig getifaddr en0 2>/dev/null || echo 'YOUR_LAPTOP_IP'):8080"
echo "Save any file → browser refreshes automatically."
exec python3 -m http.server 8080 --bind 0.0.0.0
