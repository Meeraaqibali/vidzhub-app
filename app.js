/* 1. CONTINUE WATCHING */
const animeList = [
  { id: 1, title: "Jujutsu Kaisen", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80" },
  { id: 2, title: "One Piece",       img: "https://images.unsplash.com/photo-1628260412297-a3377e45006f?w=400&q=80" },
  { id: 3, title: "Naruto",          img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80" },
  { id: 4, title: "Demon Slayer",    img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80" }
];
const row = document.getElementById("anime-row");
animeList.forEach(anime => {
  const card = document.createElement("div");
  card.className = "anime-card";
  card.style.backgroundImage = `url(${anime.img})`;
  card.innerHTML = `<span class="x">✕</span>`;
  row.appendChild(card);
});

/* 2. HERO SLIDER */
const slides = [
  { title: "BLACK CLOVER 2ND SEASON", sub: "The second season of Black Clover.", img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80" },
  { title: "TOKYO REVENGERS: SANTEN SENSOU-HEN", sub: "Sequel to Tokyo Revengers: Tenjiku-hen.", img: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&q=80" },
  { title: "JUJUTSU KAISEN", sub: "The ultimate battle begins.", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80" },
  { title: "DEMON SLAYER", sub: "The Hashira Training Arc.", img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80" },
  { title: "ONE PIECE", sub: "The Final Saga begins.", img: "https://images.unsplash.com/photo-1628260412297-a3377e45006f?w=800&q=80" }
];

const heroBg = document.getElementById("hero-bg");
const heroTitle = document.getElementById("hero-title");
const heroSub = document.getElementById("hero-sub");
const sliderBox = document.getElementById("hero-slider");
const heroEl = document.getElementById("hero");

let currentIndex = 0;
let autoTimer = null;
const AUTO_MS = 5000;

slides.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.addEventListener("click", () => goToSlide(i));
  sliderBox.appendChild(dot);
});
const dots = sliderBox.querySelectorAll(".dot");

function goToSlide(index) {
  if (index === currentIndex) return;
  heroBg.classList.add("fade");
  setTimeout(() => {
    currentIndex = index;
    heroBg.style.backgroundImage = `url(${slides[index].img})`;
    heroBg.classList.remove("fade");
    heroTitle.textContent = slides[index].title;
    heroSub.textContent = slides[index].sub;
    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
  }, 300);
  restartAuto();
}
function nextSlide() { goToSlide((currentIndex + 1) % slides.length); }
function startAuto() { autoTimer = setInterval(nextSlide, AUTO_MS); }
function stopAuto() { if (autoTimer) clearInterval(autoTimer); }
function restartAuto() { stopAuto(); startAuto(); }

let startX = 0, startY = 0, isDragging = false;
heroEl.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX; startY = e.touches[0].clientY;
  isDragging = true; stopAuto();
}, { passive: true });
heroEl.addEventListener("touchend", e => {
  if (!isDragging) return;
  isDragging = false;
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : goToSlide((currentIndex - 1 + slides.length) % slides.length); }
  else if (Math.abs(dy) > 40) { dy < 0 ? nextSlide() : goToSlide((currentIndex - 1 + slides.length) % slides.length); }
  else { startAuto(); }
});

heroBg.style.backgroundImage = `url(${slides[0].img})`;
heroTitle.textContent = slides[0].title;
heroSub.textContent = slides[0].sub;
startAuto();

/* 3. SHARE BUTTONS */
function shareTo(platform) {
  const url = window.location.href;
  const text = "Check out VidzHub!";
  let shareUrl = "";
  switch (platform) {
    case "x": shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
    case "whatsapp": shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`; break;
    case "messenger": shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=123456789&redirect_uri=${encodeURIComponent(url)}`; break;
    case "reddit": shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`; break;
    default:
      if (navigator.share) navigator.share({ title: "VidzHub", text: text, url: url });
      else { navigator.clipboard.writeText(url); alert("Link copied!"); }
      return;
  }
  window.open(shareUrl, "_blank", "noopener,noreferrer");
}
