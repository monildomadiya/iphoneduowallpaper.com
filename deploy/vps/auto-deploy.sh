#!/usr/bin/env bash
# Releases the latest GitHub `main` when it differs from the live site.
# Run as root by iphoneduowallpaper-deploy.timer; builds as the application user,
# switches `current` only after a successful build, and rolls back if the health check fails.
set -euo pipefail

APP_USER=iphoneduowallpaper
BASE=/srv/iphoneduowallpaper
REPO_URL=https://github.com/monildomadiya/iphoneduowallpaper.com.git
BRANCH=main
SERVICE=iphoneduowallpaper
NODE_BIN=/opt/node24/bin
KEEP_RELEASES=4
MIRROR=$BASE/repo.git

exec 9>"$BASE/.deploy.lock"
flock -n 9 || exit 0

as_app() {
  runuser -u "$APP_USER" -- env PATH="$NODE_BIN:/usr/local/bin:/usr/bin:/bin" HOME="$BASE" NEXT_TELEMETRY_DISABLED=1 "$@"
}

healthy() {
  for _ in $(seq 1 30); do
    curl -fsS --max-time 5 http://localhost:3000/api/health >/dev/null 2>&1 && return 0
    sleep 2
  done
  return 1
}

[ -d "$MIRROR" ] || as_app git clone --bare --quiet "$REPO_URL" "$MIRROR"
as_app git --git-dir="$MIRROR" fetch --quiet --prune "$REPO_URL" "+refs/heads/$BRANCH:refs/heads/$BRANCH"
target=$(as_app git --git-dir="$MIRROR" rev-parse "refs/heads/$BRANCH")

[ "$target" = "$(cat "$BASE/deployed-commit" 2>/dev/null || true)" ] && exit 0
# A commit that failed is not retried every few minutes; the next push tries again.
[ "$target" = "$(cat "$BASE/failed-commit" 2>/dev/null || true)" ] && exit 0

previous=$(readlink -f "$BASE/current")
release="$BASE/releases/$(date -u +%Y%m%d-%H%M%S)-${target:0:7}"
echo "Deploying ${target:0:7} into $release (live: $previous)"

as_app mkdir -p "$release"
as_app sh -c 'git --git-dir="$1" archive "$2" | tar -x -C "$3"' sh "$MIRROR" "$target" "$release"
install -o "$APP_USER" -g "$APP_USER" -m 600 "$previous/.env.local" "$release/.env.local"

cd "$release"
if ! as_app npm ci --include=dev --no-audit --no-fund || ! as_app npm run build -- --webpack; then
  echo "Build failed for ${target:0:7}; the live site was not changed."
  echo "$target" >"$BASE/failed-commit"
  cd "$BASE" && rm -rf "$release"
  exit 1
fi
cd "$BASE"

ln -sfn "$release" "$BASE/current.next" && mv -T "$BASE/current.next" "$BASE/current"
systemctl restart "$SERVICE"
if ! healthy; then
  echo "Health check failed for ${target:0:7}; restoring $previous."
  ln -sfn "$previous" "$BASE/current.next" && mv -T "$BASE/current.next" "$BASE/current"
  systemctl restart "$SERVICE"
  echo "$target" >"$BASE/failed-commit"
  exit 1
fi

echo "$target" >"$BASE/deployed-commit"
rm -f "$BASE/failed-commit"
echo "Deployed ${target:0:7}."

# Each release holds its own node_modules; keep the newest few, never the live or previous one.
ls -1dt "$BASE"/releases/*/ | tail -n +$((KEEP_RELEASES + 1)) | while read -r dir; do
  dir=${dir%/}
  [ "$dir" = "$release" ] || [ "$dir" = "$previous" ] || rm -rf "$dir"
done
