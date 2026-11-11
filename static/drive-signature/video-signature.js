/* Cyan crystal frames extracted from the user's recording (route2). */
(() => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  const query = new URLSearchParams(location.search);
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

  canvas.setAttribute('aria-label', `${name}，青色菱晶，${roman}，${goldCount} 枚金色标记`);

  function draw(frame) {
    if (!image.naturalWidth) return;
    const left = 11 + Math.ceil(goldCount / 2) * 9;
    const width = left + 328 + 8;
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
    const scaleX = image.naturalWidth / (328 * 6);
    const scaleY = image.naturalHeight / (77 * 4);
    const imageAt = index => context.drawImage(image, (index % 6) * 328 * scaleX,
      Math.floor(index / 6) * 77 * scaleY, 328 * scaleX, 77 * scaleY, left, 0, 328, 77);
    imageAt(frame);
    if (frame >= 21 && !reducedMotion.matches) {
      context.save();
      context.globalAlpha = (frame - 20) / 4;
      imageAt(0);
      context.restore();
    }

    const bx = left + 33;
    const by = 38;
    context.save();
    context.beginPath();
    context.ellipse(bx, by, 12.5, 11.5, 0, 0, Math.PI * 2);
    context.fillStyle = '#08191c';
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
    context.fillStyle = '#4af9ed';
    context.shadowColor = '#4af9ed';
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
      if (measured > 214) { size *= 214 / measured; context.font = font(size); }
      context.lineWidth = .7; context.lineJoin = 'round'; context.strokeStyle = '#14111ac9';
      context.strokeText(name, left + 68, 38.5);
      context.fillStyle = '#fff'; context.shadowColor = '#182033'; context.shadowBlur = 1;
      context.shadowOffsetY = 1; context.fillText(name, left + 68, 38.5); context.restore();
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
  image.src = 'sprites-hq/cyan-crystal.png';
  new ResizeObserver(() => draw(currentFrame())).observe(canvas);
  Promise.resolve(window.driveFontsReady).then(() => draw(currentFrame()));
})();
