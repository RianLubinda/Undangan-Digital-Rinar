// ===== Firebase Configuration =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// === Konfigurasi Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyAO4hKLTpbse-7vTrv31njHbsz92MthLJI",
  authDomain: "rsvp-rinar.firebaseapp.com",
  projectId: "rsvp-rinar",
  storageBucket: "rsvp-rinar.firebasestorage.app",
  messagingSenderId: "338118754611",
  appId: "1:338118754611:web:e4c5b1633a6abfb119fe46",
  measurementId: "G-L1CFYZ9SZ7"
};

// === Inisialisasi Firebase & Firestore ===
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== Submit Form RSVP =====
const form = document.getElementById("rsvp-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const hadir = form.attendance.value;
  const message = form.message.value.trim();

  if (!name || !hadir) {
    alert("Nama dan kehadiran wajib diisi.");
    return;
  }

  try {
    await addDoc(collection(db, "rsvp"), {
      name,
      hadir,
      message,
      timestamp: new Date()
    });

    // Tampilkan popup terima kasih
    const popup = document.getElementById("thankyou-popup");
    popup.classList.remove("hidden");

    setTimeout(() => {
      popup.classList.add("hidden");
    }, 4000);

    form.reset();
    loadComments();
  } catch (err) {
    console.error("❌ Gagal kirim:", err);
    alert("Gagal mengirim. Coba lagi ya.");
  }
});

// ===== Load Semua Komentar =====
async function loadComments() {
  const list = document.getElementById("rsvp-list");
  list.innerHTML = "";

  try {
    const q = query(collection(db, "rsvp"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const data = doc.data();
      const item = document.createElement("div");
      item.innerHTML = `
        <p><strong>${data.name}</strong> (${data.hadir})</p>
        <p>${data.message}</p>
        <hr>
      `;
      list.appendChild(item);
    });
  } catch (err) {
    console.error("❌ Gagal ambil data:", err);
    list.innerHTML = "<p>Gagal memuat ucapan.</p>";
  }
}

function salinRekening() {
  const input = document.getElementById("rekening");
  input.select();
  input.setSelectionRange(0, 99999); // Untuk mobile
  navigator.clipboard.writeText(input.value)
    .then(() => alert("Nomor rekening disalin!"))
    .catch(() => alert("Gagal menyalin."));
}


// === Load Awal ===
loadComments();
