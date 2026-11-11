// Official Blizzard CSS declares Config Italic and Big Noodle Too. The recording's
// player IDs match Config Italic's wider, lighter letterforms more closely.
window.driveFontsReady = (async () => {
  const load = async (family, url, weight = '400', style = 'normal') => {
    try {
      const face = new FontFace(family, `url(${url})`, {weight, style});
      await face.load();document.fonts.add(face);return true;
    } catch { return false; }
  };
  const assets = await Promise.all([
    load('DriveConfigItalic','https://blz-contentstack-assets.akamaized.net/v3/assets/blt2477dcaf4ebd440c/bltbe4682892c9736f8/69fd1499522053ac3217006c/config-italic-webfont.woff2','400','italic'),
    load('DriveConfigMedium','https://blz-contentstack-assets.akamaized.net/v3/assets/blt2477dcaf4ebd440c/bltc05a7a8f19e3a6cf/69fd14652dc2d3a41c7f8d4f/config-medium.woff2','500','normal'),
    load('DriveNoodleOblique','https://blz-contentstack-assets.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt60f9ded45d5c545c/69fd1863d002ee3c94eb5883/big-noodle-too-oblique.woff2','400','normal')
  ]);
  if (!assets[2] && ['127.0.0.1','localhost','::1'].includes(location.hostname)) {
    assets[2] = await load('DriveNoodleOblique','/__local-font/noodle-oblique.ttf');
  }
  return {configItalic:assets[0],configMedium:assets[1],bigNoodle:assets[2]};
})();
