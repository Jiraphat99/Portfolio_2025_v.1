const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");
let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);

const fontSize = 40;
const fontFamily = "Meiryo, monospace";
const text = "Software Engineer";
const alphabet = "0123456789#+-/|=アイウエオあいうえお♡⋆˙⟡";

// --- Create mask ---
const maskCanvas = document.createElement("canvas");
const maskCtx = maskCanvas.getContext("2d");
maskCanvas.width = w;
maskCanvas.height = h;

function createMask() {
  maskCtx.clearRect(0, 0, w, h);
  maskCtx.font = `bold ${fontSize * 3}px ${fontFamily}`;
  maskCtx.textAlign = "center";
  maskCtx.textBaseline = "middle";
  maskCtx.fillStyle = "white";
  maskCtx.fillText(text, w / 2, h / 2);
  return maskCtx.getImageData(0, 0, w, h);
}

let maskData = createMask();

// --- Sample positions inside the letters ---
const letterPositions = [];
const step = 6; // smaller step → denser glyphs
for (let x = 0; x < w; x += step) {
  for (let y = 0; y < h; y += step) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const idx = (yi * w + xi) * 4;
    if (maskData.data[idx + 3] > 128) {
      letterPositions.push({ x, y });
    }
  }
}

// --- Animation ---
function tick() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#0F0";
  ctx.font = `${step}px ${fontFamily}`;

  // draw glyphs at fixed positions, random char each frame
  letterPositions.forEach((pos) => {
    const char = alphabet[Math.floor(Math.random() * alphabet.length)];
    ctx.fillText(char, pos.x, pos.y);
  });

  requestAnimationFrame(tick);
}

tick();

// --- Handle resize ---
window.addEventListener("resize", () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  maskData = createMask();

  letterPositions.length = 0;
  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y += step) {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const idx = (yi * w + xi) * 4;
      if (maskData.data[idx + 3] > 128) {
        letterPositions.push({ x, y });
      }
    }
  }
});
