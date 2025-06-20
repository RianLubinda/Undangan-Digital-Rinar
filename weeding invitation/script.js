window.addEventListener("load", function () {
  // === 1. Scroll Section dan Musik ===
  function scrollToSection(id, btn = null) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      highlightSection(el);
    }

    document.querySelectorAll('#navButtons button').forEach(b => b.classList.remove('active'));
    if (btn) {
      btn.classList.add('active');
      const nav = document.getElementById('navButtons');
      const offset = btn.offsetLeft - (nav.clientWidth / 2) + (btn.offsetWidth / 2);
      nav.scrollTo({ left: offset, behavior: 'smooth' });
    }

    if (id === 'opening') {
      const music = document.getElementById("bg-music");
      const musicBtn = document.getElementById("music-btn");
      if (music && music.paused) {
        music.play().then(() => {
          musicBtn.src = "images/asset/pause.gif";
        }).catch(err => console.warn("Autoplay gagal:", err));
      }
    }
  }

  function highlightSection(el) {
    el.classList.add('highlighted');
    setTimeout(() => el.classList.remove('highlighted'), 1000);
  }

  window.scrollToSection = scrollToSection;

  // === 2. Toggle Musik ===
  window.toggleMusic = function () {
    const music = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-btn");

    if (!music) return;
    if (music.paused) {
      music.play().then(() => {
        musicBtn.src = "images/asset/pause.gif";
      }).catch(err => console.warn("Play gagal:", err));
    } else {
      music.pause();
      musicBtn.src = "images/asset/play.gif";
    }
  };

  // === 3. RSVP Dummy Function ===
  window.openRSVP = function () {
    alert("Terima kasih, silakan isi form RSVP nanti.");
  };

  // === 4. Countdown Timer ===
  const targetDate = new Date("2025-06-27T14:00:00").getTime();
  const interval = setInterval(() => {
    const now = Date.now();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const el = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    };

    if (el.days && distance > 0) {
      el.days.textContent = days;
      el.hours.textContent = hours;
      el.minutes.textContent = minutes;
      el.seconds.textContent = seconds;
    } else {
      clearInterval(interval);
      Object.values(el).forEach(e => { if (e) e.textContent = "0"; });
    }
  }, 1000);

  // === 5. Ambil Nama dari URL ===
  const urlParams = new URLSearchParams(window.location.search);
  const panggilan = urlParams.get('p');
  const nama = urlParams.get('n');
  if (panggilan && nama) {
    const tamuUndangan = document.querySelector('#tamu-undangan');
    const decodedPanggilan = decodeURIComponent(panggilan.replace(/\+/g, ' '));
    const decodedNama = decodeURIComponent(nama.replace(/\+/g, ' '));
    if (tamuUndangan) {
      tamuUndangan.innerText = `${decodedPanggilan} ${decodedNama},`;
    }
  }

  // === 6. Galeri Gambar Manual ===
  const galleryImages = document.querySelectorAll('.gallery-img');
  const popup = document.getElementById('popup');
  const popupImg = document.getElementById('popup-img');
  const closeBtn = document.querySelector('.close-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (galleryImages.length && popup && popupImg) {
    let currentIndex = 0;
    const imageSources = Array.from(galleryImages).map(img => img.src);

    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        currentIndex = parseInt(img.dataset.index);
        popupImg.src = imageSources[currentIndex];
        popup.classList.remove('hidden');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => popup.classList.add('hidden'));
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        popupImg.src = imageSources[currentIndex];
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imageSources.length;
        popupImg.src = imageSources[currentIndex];
      });
    }
  }
});

// === 7. Fungsi Salin Nomor Rekening ===
window.salinRekening = function () {
  const rekeningInput = document.getElementById("rekening");
  if (!rekeningInput) return;

  navigator.clipboard.writeText(rekeningInput.value)
    .then(() => {
      alert("Nomor rekening berhasil disalin: " + rekeningInput.value);
    })
    .catch(() => {
      alert("Gagal menyalin nomor rekening. Silakan salin manual.");
    });
};

window.salinRekening = function () {
  const rekeningInput = document.getElementById("rekening");
  const popup = document.getElementById("popup-salin");

  if (!rekeningInput || !popup) return;

  navigator.clipboard.writeText(rekeningInput.value)
    .then(() => {
      popup.classList.remove("hidden");
      setTimeout(() => popup.classList.add("hidden"), 2500); // otomatis hilang 2.5s
    })
    .catch(() => {
      alert("Gagal menyalin nomor rekening.");
    });
};
