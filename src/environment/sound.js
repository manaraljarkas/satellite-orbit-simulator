let audio;
let loaded = false;

export function initWarningSound(url) {
  audio = new Audio(url);
  audio.loop = true;   // ✅ صوت متكرر
  audio.volume = 0.6;
  loaded = true;
}

export function primeWarningSound() {
  if (!audio || !loaded) return;
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
  }).catch(() => {});
}

export function playWarningSound() {
  if (!audio || !loaded) return;
  if (audio.paused) {
    audio.play().catch(() => {});
  }
}

export function stopWarningSound() {
  if (!audio || !loaded) return;
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
  }
}
