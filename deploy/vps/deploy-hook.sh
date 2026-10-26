#!/bin/sh
# Answers nginx's POST /__deploy (socket-activated by iphoneduowallpaper-deploy-hook.socket).
# A request only asks the deployer to look at GitHub main again, so the hook needs no secret:
# a caller can make the server fetch the public repository, never choose what is released.

# Read the request headers first so nginx receives a clean response.
cr=$(printf '\r')
while IFS= read -r line; do
  case "$line" in "" | "$cr") break ;; esac
done

systemctl start --no-block iphoneduowallpaper-deploy.service
printf 'HTTP/1.0 202 Accepted\r\nContent-Type: text/plain\r\nContent-Length: 9\r\n\r\naccepted\n'
