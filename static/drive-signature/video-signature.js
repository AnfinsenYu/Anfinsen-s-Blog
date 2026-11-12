/* Frames extracted from the user's recording (route2). */
(() => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  const query = new URLSearchParams(location.search);
  const themes = [
    {id:'cyan-crystal', name:'青色菱晶', w:328, nx:68, nend:282, bx:33, by:38, color:'#4af9ed', fill:'#08191c'},
    {id:'violet-energy-ring', name:'紫色能量环', w:307, nx:73, nend:262, bx:37, by:38, color:'#f5eaff', fill:'#110a32'},
    {id:'cyan-pink-wings', name:'青粉双翼', w:365, nx:108, nend:323, bx:60, by:38, color:'#c4fffd', fill:'#365b68'},
    {id:'red-gold-pixels', name:'红金像素环', w:320, nx:66, nend:269, bx:30, by:38, color:'#ffe2ac', fill:'#2c0809'},
    {id:'green-waveform', name:'绿色均衡器', w:340, nx:77, nend:291, bx:28, by:38, color:'#e1ff37', fill:'#06160b'},
    {id:'silver-blue-polygon', name:'银蓝多边形', w:313, nx:62, nend:277, bx:25, by:38, color:'#ffde38', fill:'#1b252d'},
    {id:'pink-violet-ring', name:'粉紫能量环', w:313, nx:60, nend:277, bx:27, by:38, color:'#ef8bff', fill:'#290642'},
    {id:'red-trail', name:'红黑拖尾', w:313, nx:50, nend:267, bx:30, by:38, color:'#ff2671', fill:'#240411'},
    {id:'orange-flame', name:'橙色火焰', w:313, nx:49, nend:269, bx:25, by:38, color:'#fff2c4', fill:'#2d190c'},
    {id:'blue-violet-tech', name:'蓝紫斜切科技', w:306, nx:48, nend:256, bx:24, by:38, color:'#eea0ff', fill:'#190e3c'}
  ];
  const variant = query.get('variant');
  let theme = themes.find(item => item.id === variant);
  if (variant === 'video-random') {
    let previous = null;
    try { previous = sessionStorage.getItem('drive-signature-last'); } catch (_) {}
    const candidates = themes.filter(item => item.id !== previous);
    theme = candidates[Math.floor(Math.random() * candidates.length)];
    try { sessionStorage.setItem('drive-signature-last', theme.id); } catch (_) {}
  }
  theme ||= themes[0];
  const name = Array.from(query.get('name') || 'ANFINSEN').slice(0, 32).join('');
  const inputPeriod = Number(query.get('period'));
  const period = Number.isInteger(inputPeriod) && inputPeriod >= 1 && inputPeriod <= 60 ? inputPeriod : 10;
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'][(period - 1) % 6];
  const goldCount = Math.floor((period - 1) / 6);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const image = new Image();
  let time = 0;
  let last = 0;
  let lastFrame = -1;

  canvas.setAttribute('aria-label', `${name}，${theme.name}，${roman}，${goldCount} 枚金色标记`);

  function draw(frame) {
    if (!image.naturalWidth) return;
    const left = 11 + Math.ceil(goldCount / 2) * 9;
    const width = left + theme.w + 8;
    const height = 77;
    const factor = Math.max(1, Math.min(4, (canvas.clientWidth || width) / width * (devicePixelRatio || 1)));
    const pixelWidth = Math.round(width * factor);
    const pixelHeight = Math.round(height * factor);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context.setTransform(factor, 0, 0, factor, 0, 0);
    context.clearRect(0, 0, width, height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    const scaleX = image.naturalWidth / (theme.w * 6);
    const scaleY = image.naturalHeight / (77 * 4);
    const imageAt = index => context.drawImage(image, (index % 6) * theme.w * scaleX,
      Math.floor(index / 6) * 77 * scaleY, theme.w * scaleX, 77 * scaleY, left, 0, theme.w, 77);
    imageAt(frame);
    if (frame >= 21 && !reducedMotion.matches) {
      context.save();
      context.globalAlpha = (frame - 20) / 4;
      imageAt(0);
      context.restore();
    }

    const bx = left + theme.bx;
    const by = theme.by;
    context.save();
    context.beginPath();
    if (theme.id === 'red-trail' || theme.id === 'blue-violet-tech') context.roundRect(bx - 13, by - 11.5, 26, 23, 3);
    else context.ellipse(bx, by, 12.5, 11.5, 0, 0, Math.PI * 2);
    context.fillStyle = theme.fill;
    context.fill();
    context.restore();

    context.save();
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    let numeralSize = 22;
    context.font = `500 ${numeralSize}px "DriveConfigMedium", Arial, sans-serif`;
    const numeralWidth = context.measureText(roman).width;
    if (numeralWidth > 21) {
      numeralSize *= 21 / numeralWidth;
      context.font = `500 ${numeralSize}px "DriveConfigMedium", Arial, sans-serif`;
    }
    context.lineJoin = 'round';
    context.lineWidth = 1.4;
    context.strokeStyle = '#080711c9';
    context.strokeText(roman, bx, by + 0.5);
    context.fillStyle = theme.color;
    context.shadowColor = theme.color;
    context.shadowBlur = 2;
    context.fillText(roman, bx, by + 0.5);
    context.restore();

    for (let i = 0; i < goldCount; i++) {
      const column = Math.floor(i / 2);
      const count = Math.min(2, goldCount - column * 2);
      const x = left - 9 - column * 9;
      const y = 38 + (i % 2 - (count - 1) / 2) * 12;
      context.save();
      context.translate(x, y);
      context.shadowColor = '#ffaf24';
      context.shadowBlur = 4;
      context.beginPath();
      context.moveTo(0, -6); context.lineTo(4, -2); context.lineTo(4, 2);
      context.lineTo(0, 6); context.lineTo(-4, 2); context.lineTo(-4, -2); context.closePath();
      const gold = context.createLinearGradient(0, -6, 0, 6);
      gold.addColorStop(0, '#fff5b4'); gold.addColorStop(.52, '#ffc332'); gold.addColorStop(1, '#b55b0d');
      context.fillStyle = gold; context.fill(); context.lineWidth = .8;
      context.strokeStyle = '#7b3b0c'; context.stroke(); context.restore();
    }

    if (name) {
      context.save();
      context.textAlign = 'left'; context.textBaseline = 'middle';
      const cjk = /[\u2e80-\u9fff\uac00-\ud7af]/u.test(name);
      let size = 45;
      const font = value => cjk ? `400 ${value}px "Microsoft YaHei", sans-serif` :
        `italic 400 ${value}px "DriveConfigItalic", Arial, sans-serif`;
      context.font = font(size);
      const measured = context.measureText(name).width;
      const maxWidth = theme.nend - theme.nx;
      if (measured > maxWidth) { size *= maxWidth / measured; context.font = font(size); }
      context.lineWidth = .7; context.lineJoin = 'round'; context.strokeStyle = '#14111ac9';
      context.strokeText(name, left + theme.nx, 38.5);
      context.fillStyle = '#fff'; context.shadowColor = '#182033'; context.shadowBlur = 1;
      context.shadowOffsetY = 1; context.fillText(name, left + theme.nx, 38.5); context.restore();
    }
  }

  function currentFrame() { return reducedMotion.matches ? 0 : Math.floor(time * 7.5) % 24; }
  function tick(now) {
    if (last && !reducedMotion.matches) time += Math.min((now - last) / 1000, .08);
    last = now;
    const frame = currentFrame();
    if (frame !== lastFrame) { draw(frame); lastFrame = frame; }
    requestAnimationFrame(tick);
  }
  image.onload = () => { draw(currentFrame()); requestAnimationFrame(tick); };
  image.onerror = () => { canvas.hidden = true; document.querySelector('#error').hidden = false; };
  image.src = `sprites-hq/${theme.id}.png`;
  new ResizeObserver(() => draw(currentFrame())).observe(canvas);
  Promise.resolve(window.driveFontsReady).then(() => draw(currentFrame()));
})();
