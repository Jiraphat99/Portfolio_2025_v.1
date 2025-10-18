const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");

let w, h;
const fontFamily = "Meiryo, monospace";
const firstName = "Jirapat";
const lastName = "Wonganan";
const alphabet = "0123456789#+-/|=アイウエオあいうえお♡⋆˙⟡";

const maskCanvas = document.createElement("canvas");
const maskCtx = maskCanvas.getContext("2d");

let letterPositions = [];
let step; // will be dynamic

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  // Step size and font scale with window
  step = Math.floor(Math.min(w, h) * 0.013); // smaller = more dense
  if (step < 2) step = 2; // minimum size

  maskCanvas.width = w;
  maskCanvas.height = h;

  createMask();
  samplePositions();
}

function createMask() {
  maskCtx.clearRect(0, 0, w, h);

  const lineHeight = step * 10; // proportional to step size
  maskCtx.font = `bold ${lineHeight}px ${fontFamily}`;
  maskCtx.textAlign = "center";
  maskCtx.textBaseline = "middle";
  maskCtx.fillStyle = "white";

  maskCtx.fillText(firstName, w / 2, h / 2 - lineHeight / 2);
  maskCtx.fillText(lastName, w / 2, h / 2 + lineHeight / 2);
}

function samplePositions() {
  letterPositions.length = 0;
  const maskData = maskCtx.getImageData(0, 0, w, h);

  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y += step) {
      const idx = (y * w + x) * 4;
      if (maskData.data[idx + 3] > 128) {
        letterPositions.push({ x, y });
      }
    }
  }
}

let frameCount = 0;
const changeEvery = 10;

function tick() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#0F0";
  ctx.font = `${step}px ${fontFamily}`; // font matches step for responsive spacing

  frameCount++;
  const update = frameCount % changeEvery === 0;

  letterPositions.forEach((pos) => {
    const char = update
      ? alphabet[Math.floor(Math.random() * alphabet.length)]
      : pos.char || alphabet[Math.floor(Math.random() * alphabet.length)];
    pos.char = char;
    ctx.fillText(char, pos.x, pos.y);
  });

  requestAnimationFrame(tick);
}

window.addEventListener("resize", resize);

resize();
tick();
