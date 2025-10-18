// small script to toggle 'active' state and aria-selected
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
  void loopText.offsetWidth; // restart animation
  loopText.classList.add("reset");

  i = (i + 1) % titles.length;
}

// trigger first cycle
changeTitle();

// change every 6 seconds (same as animation duration)
setInterval(changeTitle, 6000);
// Marquee effect
const marqueeText = document.getElementById("marquee-text");
marqueeText.textContent = titles.join(" \u00A0 \u00A0 \u00A0 "); // Add spaces between titles
marqueeText.style.animation = "marquee 12s linear infinite";
