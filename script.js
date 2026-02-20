// ==========================================
// 1. PENGATURAN PASSWORD
// Ganti "123456" dengan 6 digit angka yang kamu inginkan
// ==========================================
const CORRECT_PASSWORD = "123456";
let currentInput = "";

// ==========================================
// 2. SISTEM PLAYLIST MUSIK SPOTIFY
// ==========================================
const bgMusic = document.getElementById("bg-music");
let isPlaying = false;
let currentSongIndex = 0;

// Daftar lagu (Pastikan file ini ada di dalam folder assets)
const playlist = [
  {
    title: "Everything U Are",
    artist: "Hindia",
    file: "Hindia1.mp3",
    cover: "Hindia1.jpg",
  },
  {
    title: "Kota ini Tak Sama Tanpamu",
    artist: "Nadif",
    file: "Kotaini2.mp3",
    cover: "assets/cover2.jpg",
  },
  {
    title: "Hanya Rindu",
    artist: "Andmesh",
    file: "assets/lagu3.mp3",
    cover: "assets/cover3.jpg",
  },
];

// Fungsi untuk memuat lagu ke player
function loadSong(index) {
  currentSongIndex = index;
  const song = playlist[index];

  // Ganti sumber audio
  bgMusic.src = song.file;

  // Ganti teks judul, penyanyi, dan cover di layar atas
  document.getElementById("spotify-title").innerText = song.title;
  document.getElementById("spotify-artist").innerText = song.artist;
  document.getElementById("spotify-cover").src = song.cover;

  // Ganti efek terang (active) pada daftar lagu
  const songItems = document.querySelectorAll(".song-item");
  songItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Tombol Play/Pause
function toggleMusic() {
  const playIcon = document.getElementById("play-icon");

  // Jika lagu belum ada sourcenya, load lagu pertama
  if (!bgMusic.src || bgMusic.src === window.location.href) {
    loadSong(0);
  }

  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    if (playIcon) playIcon.innerText = "▶";
  } else {
    bgMusic.play().catch((e) => console.log("Harus interaksi dulu"));
    isPlaying = true;
    if (playIcon) playIcon.innerText = "⏸";
  }
}

// Tombol Next
function nextSong() {
  let nextIndex = currentSongIndex + 1;
  if (nextIndex >= playlist.length) nextIndex = 0;

  loadSong(nextIndex);
  if (isPlaying) bgMusic.play();
}

// Tombol Prev
function prevSong() {
  let prevIndex = currentSongIndex - 1;
  if (prevIndex < 0) prevIndex = playlist.length - 1;

  loadSong(prevIndex);
  if (isPlaying) bgMusic.play();
}

// Klik langsung dari daftar lagu
function selectSong(index) {
  loadSong(index);
  isPlaying = true;
  document.getElementById("play-icon").innerText = "⏸";
  bgMusic.play();
}

// Otomatis ganti lagu kalau lagunya sudah habis
bgMusic.addEventListener("ended", nextSong);

// ==========================================
// 3. LOGIKA KEYPAD (PASSCODE)
// ==========================================
function pressKey(num) {
  if (currentInput.length < 6) {
    currentInput += num;
    updateDots();

    if (currentInput.length === 6) {
      setTimeout(checkPassword, 300);
    }
  }
}

function deleteKey() {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    updateDots();
  }
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    if (index < currentInput.length) {
      dot.classList.add("filled");
      dot.classList.remove("error");
    } else {
      dot.classList.remove("filled");
      dot.classList.remove("error");
    }
  });
}

function checkPassword() {
  if (currentInput === CORRECT_PASSWORD) {
    // Jika Benar: Mainkan musik, pindah ke layar sapaan
    toggleMusic();
    nextStep("step-intro-1");
  } else {
    // Jika Salah: Animasi getar merah
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => dot.classList.add("error"));

    setTimeout(() => {
      currentInput = "";
      updateDots();
    }, 500);
  }
}

// ==========================================
// 4. NAVIGASI ANTAR HALAMAN
// ==========================================
function nextStep(stepId) {
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.remove("active");
  });

  const next = document.getElementById(stepId);
  if (next) {
    next.classList.add("active");
    document.getElementById("app").scrollTop = 0;
  }
}

// ==========================================
// 5. EFEK KETIK & MUNCULKAN PARTIKEL
// ==========================================
function startFinalMessage() {
  nextStep("step-final");

  setInterval(createParticle, 400);

  const textData = document.getElementById("final-text").innerText;
  const typewriterDiv = document.getElementById("typewriter");
  const container = document.querySelector(".typing-container");

  typewriterDiv.innerHTML = "";
  let i = 0;

  function typeWriter() {
    if (i < textData.length) {
      typewriterDiv.innerHTML += textData.charAt(i);
      i++;
      container.scrollTop = container.scrollHeight;
      setTimeout(typeWriter, 40);
    } else {
      setTimeout(() => {
        document.getElementById("btn-restart").classList.remove("hidden");
      }, 1000);
    }
  }

  setTimeout(typeWriter, 500);
}

function createParticle() {
  const app = document.getElementById("app");
  const particle = document.createElement("div");
  particle.classList.add("particle");

  const emojis = ["💙", "💛", "✨", "🤍", "💫"];
  particle.innerText = emojis[Math.floor(Math.random() * emojis.length)];

  particle.style.left = Math.random() * 100 + "vw";
  particle.style.animationDuration = Math.random() * 3 + 3 + "s";

  app.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 6000);
}
