/**
 * ============================================
 *   VIDEOCON — Custom Video Player Component
 * ============================================
 * Usage:
 *   Videocon.mount(containerElement, videoUrl, options);
 */
const Videocon = (() => {

  function createPlayer(container, src, options = {}) {
    const poster = options.poster || "";
    const autoplay = options.autoplay || false;

    container.innerHTML = `
      <div class="videocon-wrapper">
        <video class="videocon-video" playsinline ${autoplay ? "autoplay" : ""} poster="${poster}">
          <source src="${src}" type="application/x-mpegURL" />
          <source src="${src}" type="video/mp4" />
        </video>

        <button class="vc-big-play">▶</button>
        <div class="vc-loader">Loading…</div>

        <div class="videocon-controls">
          <button class="vc-btn vc-play">▶</button>
          <input type="range" class="vc-seek" value="0" min="0" max="100" />
          <span class="vc-time">0:00 / 0:00</span>
          <button class="vc-btn vc-mute">🔊</button>
          <input type="range" class="vc-volume" value="1" min="0" max="1" step="0.1" />
          <button class="vc-btn vc-fs">⛶</button>
        </div>
      </div>
    `;

    const video    = container.querySelector(".videocon-video");
    const playBtn  = container.querySelector(".vc-play");
    const bigPlay  = container.querySelector(".vc-big-play");
    const seek     = container.querySelector(".vc-seek");
    const timeLbl  = container.querySelector(".vc-time");
    const muteBtn  = container.querySelector(".vc-mute");
    const volSlider= container.querySelector(".vc-volume");
    const fsBtn    = container.querySelector(".vc-fs");
    const loader   = container.querySelector(".vc-loader");

    // Play / Pause
    function togglePlay() {
      video.paused ? video.play() : video.pause();
    }
    playBtn.onclick = togglePlay;
    bigPlay.onclick = togglePlay;
    video.onclick   = togglePlay;

    video.onplay = () => {
      playBtn.textContent = "❚❚";
      bigPlay.classList.add("hidden");
    };
    video.onpause = () => {
      playBtn.textContent = "▶";
      bigPlay.classList.remove("hidden");
    };

    // Seek bar
    video.ontimeupdate = () => {
      if (video.duration) {
        seek.value = (video.currentTime / video.duration) * 100;
        timeLbl.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
      }
    };
    seek.oninput = () => {
      video.currentTime = (seek.value / 100) * video.duration;
    };

    // Volume
    volSlider.oninput = () => (video.volume = volSlider.value);
    muteBtn.onclick = () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? "🔇" : "🔊";
    };

    // Fullscreen
    fsBtn.onclick = () => {
      if (!document.fullscreenElement) container.requestFullscreen();
      else document.exitFullscreen();
    };

    // Loader
    video.onwaiting = () => loader.style.display = "flex";
    video.onplaying = () => loader.style.display = "none";
    video.oncanplay = () => loader.style.display = "none";

    return video;
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return { mount: createPlayer };
})();
0
