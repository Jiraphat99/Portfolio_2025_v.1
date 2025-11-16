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

// Bottom navigation active link highlighting
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  document.querySelectorAll(".bottom-nav .nav-item").forEach((link) => {
    const href = link.getAttribute("href");

    if (href && path.includes(href.replace("/", ""))) {
      link.classList.add("active");
    }
  });
});
