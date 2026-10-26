#!/bin/sh
# Forced command for the GitHub Actions SSH key (see README): runs the deployer and nothing else.
# The workflow sends the pushed commit; anything other than a commit hash is ignored.
BASE=/srv/iphoneduowallpaper
sha=$(printf '%s' "${SSH_ORIGINAL_COMMAND:-}" | grep -xE '[0-9a-f]{40}' || true)

# `systemctl start` waits for the oneshot deploy, or joins one the timer already started.
systemctl start iphoneduowallpaper-deploy
status=$?
journalctl -u iphoneduowallpaper-deploy --since "-35min" -n 60 --no-pager -o cat

if [ -n "$sha" ] && [ "$sha" = "$(cat "$BASE/failed-commit" 2>/dev/null)" ]; then
  echo "Commit $sha was not released; the live site still runs $(cat "$BASE/deployed-commit" 2>/dev/null)."
  exit 1
fi
echo "Live commit: $(cat "$BASE/deployed-commit" 2>/dev/null)"
exit $status
