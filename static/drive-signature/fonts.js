// Local preview only. Official website font is referenced, never redistributed in dist.
window.driveFontsReady = (async () => {
  if (!['127.0.0.1','localhost','::1'].includes(location.hostname)) return false;
  try {
    const official = new FontFace('DriveNoodleOblique','url(https://blz-contentstack-assets.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt60f9ded45d5c545c/69fd1863d002ee3c94eb5883/big-noodle-too-oblique.woff2)');
    await official.load();document.fonts.add(official);return 'too';
  } catch { /* Offline preview can use the user's original local font. */ }
  try {
    const face = new FontFace('DriveNoodleOblique','url(/__local-font/noodle-oblique.ttf)');
    await face.load();document.fonts.add(face);return 'titling';
  } catch { return false; }
})();
