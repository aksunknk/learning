#!/usr/bin/env bash
set -euo pipefail

export DISPLAY="${DISPLAY:-:1}"
VNC_DISPLAY="${VNC_DISPLAY:-:1}"
VNC_PORT="${VNC_PORT:-5901}"
NOVNC_PORT="${NOVNC_PORT:-26058}"
GEOMETRY="${VNC_GEOMETRY:-1920x1200}"

echo "==> 仮想デスクトップセットアップ (DISPLAY=${DISPLAY})"

if ! pgrep -f "Xtigervnc ${VNC_DISPLAY}" >/dev/null 2>&1; then
  echo "==> VNC サーバー起動 (${VNC_DISPLAY}, port ${VNC_PORT})"
  vncserver "${VNC_DISPLAY}" \
    -geometry "${GEOMETRY}" \
    -depth 24 \
    -localhost no \
    -SecurityTypes None \
    -xstartup /tmp/anyos-xstartup 2>/dev/null \
    || vncserver "${VNC_DISPLAY}" -geometry "${GEOMETRY}" -depth 24
else
  echo "    VNC は既に稼働中"
fi

if ! pgrep -f "websockify.*${NOVNC_PORT}" >/dev/null 2>&1; then
  echo "==> noVNC 起動 (port ${NOVNC_PORT} -> localhost:${VNC_PORT})"
  NOVNC_WEB="/usr/local/novnc/noVNC-1.2.0"
  if [[ -d "${NOVNC_WEB}" ]]; then
    nohup python3 -m websockify --web "${NOVNC_WEB}" "${NOVNC_PORT}" "localhost:${VNC_PORT}" \
      >/tmp/novnc-lemmadesktop.log 2>&1 &
  else
    nohup websockify --web /usr/share/novnc "${NOVNC_PORT}" "localhost:${VNC_PORT}" \
      >/tmp/novnc-lemmadesktop.log 2>&1 &
  fi
  sleep 1
else
  echo "    noVNC は既に稼働中"
fi

echo ""
echo "==> 仮想デスクトップ準備完了"
echo "    DISPLAY=${DISPLAY}"
echo "    VNC:    localhost:${VNC_PORT}"
echo "    noVNC:  http://localhost:${NOVNC_PORT}/vnc.html"
echo ""
echo "    Cursor の Desktop / VNC ビューアで上記に接続してください。"
