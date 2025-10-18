// Nav toggle
document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((n) => {
      n.classList.remove("active");
      n.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
  });
});

// Looping titles
const titles = [
  "Software Engineer",
  "UI/UX Designer",
  "Web Developer",
  "Creative Coder",
];
let i = 0;
const loopText = document.getElementById("loop-text");
function changeTitle() {
  loopText.textContent = titles[i];
  loopText.classList.remove("reset");
  void loopText.offsetWidth;
  loopText.classList.add("reset");
  i = (i + 1) % titles.length;
}
changeTitle();
setInterval(changeTitle, 6000);

// Matrix effect
const canvas = document.getElementById("matrix-canvas");
const c = canvas.getContext("2d");
let w, h;
const fontHeight = 14;
const fontFamily = "Meiryo, monospace";

const aboutMe = [
  "Software Engineer",
  "UI/UX Designer",
  "Creative Developer",
  "Problem Solver",
  "Passionate Learner",
];

const numbers = "0123456789";
const operators = "#+-\\/|=";

const katakana =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲ";
const hiragana =
  "あいうえおかきくけこがぎぐげごさしすせそざじずぜぞtたちつてとだぢづでどなにぬねのはひふへほばびぶべぼぱぴぷぺぽまみむめもやゆよらりるれろわゐゑをん";
const alphabet = numbers + operators + katakana + hiragana;

const spawnInterval = 500,
  density = 0.7,
  glitchInterval = 500,
  glitchAmount = 0.01;
const moveScale = 0.012,
  speedBase = 1.0,
  speedDeviation = 0.4,
  streaks = 1.9,
  brightRatio = 0.1;

function randomGlyph() {
  const word = aboutMe[Math.floor(Math.random() * aboutMe.length)];
  return {
    glyph: word,
    bright: true, // always bright for visibility
  };
}
const universe = Array.from({ length: 1000 }, () => randomGlyph());

function setCanvasExtents() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  c.font = fontHeight + "px " + fontFamily;
  c.textBaseline = "top";
  //  const charSize = c.measureText("ネ");
  //  colWidth = charSize.width * 1.15;

  // Taller spacing for words
  charHeight = fontHeight * 1.8; // increase vertical spacing
  colWidth = Math.max(...aboutMe.map((w) => c.measureText(w).width)) * 1.5; // wider spacing
  charsOnCol = Math.ceil(h / charHeight) || 1;
  colsPerLine = Math.ceil(w / colWidth) || 1;
}
window.addEventListener("resize", setCanvasExtents);
setCanvasExtents();

// Trails
const trails = [];
// Trail speed tweaks for smooth motion
function makeTrail(col, maxSpeed = null, headAt = null) {
  let speed =
    speedBase * 0.6 +
    (Math.random() * speedDeviation * 2 - speedDeviation) * 0.5; // slower & smoother
  if (maxSpeed && speed > maxSpeed) speed = maxSpeed;
  if (headAt === null) headAt = -Math.floor(Math.random() * 2 * charsOnCol);
  return {
    col,
    universeAt: Math.floor(Math.random() * universe.length),
    headAt,
    speed,
    length: Math.floor(Math.random() * streaks * charsOnCol) + 4, // shorter streaks
  };
}

function clear() {
  c.fillStyle = "black";
  c.fillRect(0, 0, w, h);
}

function drawTrail(trail) {
  const head = Math.round(trail.headAt);
  if (head < 0) return;
  let x = trail.col * colWidth,
    y = head * charHeight + charHeight * 0.35;
  const rgb = "#008000",
    rgbBright = "#20E020",
    rgbHead = ["#F0FFF0", "#D0F0D0", "#80C080", "#40B040"],
    rgbTail = ["#000500", "#003000", "#005000", "#007000"];
  for (let i = 0; i < trail.length; i++, y -= charHeight) {
    if (y < 0) break;
    if (y > h) continue;
    const idx = (trail.universeAt + head - i) % universe.length;
    const item = universe[idx];
    if (i < rgbHead.length) c.fillStyle = rgbHead[i];
    else if (trail.length - i - 1 < rgbTail.length)
      c.fillStyle = rgbTail[trail.length - i - 1];
    else c.fillStyle = item.bright ? rgbBright : rgb;
    if (item.flipped) {
      c.setTransform(-1, 0, 0, 1, 0, 0);
      c.fillText(item.glyph, -x - colWidth, y);
      c.setTransform(1, 0, 0, 1, 0, 0);
    } else c.fillText(item.glyph, x, y);
  }
}

function moveTrails(distance) {
  const remove = [];
  trails.forEach((t, i) => {
    t.headAt += t.speed * distance;
    if ((t.headAt - t.length) * charHeight > h) remove.push(i);
  });
  while (remove.length > 0) trails.splice(remove.pop(), 1);
}

function spawnTrails() {
  const topTrailPerCol = [];
  trails.forEach((t) => {
    const top = t.headAt - t.length;
    if (
      !topTrailPerCol[t.col] ||
      topTrailPerCol[t.col].headAt - topTrailPerCol[t.col].length > top
    )
      topTrailPerCol[t.col] = t;
  });
  for (let i = 0; i < colsPerLine; i++) {
    let pSpawn = 0,
      maxS = null,
      headAt = null;
    if (!topTrailPerCol[i]) pSpawn = 1.0;
    else {
      const tip =
        Math.round(topTrailPerCol[i].headAt) - topTrailPerCol[i].length;
      if (tip > 0) {
        const empty = tip / charsOnCol;
        pSpawn = empty;
        maxS = topTrailPerCol[i].speed * (1 + empty);
        headAt = 0;
      }
    }
    if (Math.random() < pSpawn * density)
      trails.push(makeTrail(i, maxS, headAt));
  }
}

function glitchUniverse(count) {
  for (let i = 0; i < count; i++) {
    universe[Math.floor(Math.random() * universe.length)] = randomGlyph();
  }
}

let prevTime,
  glitchCollect = 0,
  spawnCollect = 0;
function tick(time) {
  let elapsed = time - prevTime;
  prevTime = time;
  moveTrails(elapsed * moveScale);
  spawnCollect += elapsed;
  while (spawnCollect > spawnInterval) {
    spawnCollect -= spawnInterval;
    spawnTrails();
  }
  glitchCollect += elapsed;
  while (glitchCollect > glitchInterval) {
    glitchCollect -= glitchInterval;
    glitchUniverse(Math.floor(universe.length * glitchAmount));
  }
  clear();
  trails.forEach(drawTrail);
  requestAnimationFrame(tick);
}
requestAnimationFrame((t) => {
  prevTime = t;
  requestAnimationFrame(tick);
});
