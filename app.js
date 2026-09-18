const SPECIALTIES = [
  { id: "cardiology", name: "Cardiology", icon: "❤️", blurb: "Heart & blood vessels" },
  { id: "dermatology", name: "Dermatology", icon: "✨", blurb: "Skin, hair & nails" },
  { id: "pediatrics", name: "Pediatrics", icon: "🧸", blurb: "Child health" },
  { id: "orthopedics", name: "Orthopedics", icon: "🦴", blurb: "Bones & joints" },
  { id: "gynecology", name: "Gynecology", icon: "🌸", blurb: "Women’s health" },
  { id: "neurology", name: "Neurology", icon: "🧠", blurb: "Brain & nerves" },
  { id: "ent", name: "ENT", icon: "👂", blurb: "Ear, nose & throat" },
  { id: "general", name: "General Physician", icon: "🩺", blurb: "Everyday care" },
  { id: "psychiatry", name: "Psychiatry", icon: "💭", blurb: "Mental health" },
  { id: "ophthalmology", name: "Ophthalmology", icon: "👁️", blurb: "Eye care" },
];

const DOCTORS = [
  { id: "d1", name: "Dr. Ananya Rao", spec: "cardiology", exp: 14, fee: 900, rating: 4.9, hospital: "Heartline Clinic", city: "Bengaluru", avail: "today", slots: ["10:00 AM","11:30 AM","4:30 PM","6:00 PM"] },
  { id: "d2", name: "Dr. Vikram Shah", spec: "cardiology", exp: 21, fee: 1200, rating: 4.8, hospital: "Apex Cardiac Centre", city: "Mumbai", avail: "tomorrow", slots: ["9:00 AM","12:00 PM","3:00 PM"] },
  { id: "d3", name: "Dr. Meera Iyer", spec: "dermatology", exp: 9, fee: 700, rating: 4.7, hospital: "Glow Skin Lab", city: "Chennai", avail: "today", slots: ["2:00 PM","3:30 PM","5:00 PM"] },
  { id: "d4", name: "Dr. Kabir Nair", spec: "dermatology", exp: 12, fee: 800, rating: 4.6, hospital: "DermaOne", city: "Hyderabad", avail: "week", slots: ["11:00 AM","1:00 PM","4:00 PM"] },
  { id: "d5", name: "Dr. Priya Menon", spec: "pediatrics", exp: 11, fee: 650, rating: 4.9, hospital: "Little Steps", city: "Kochi", avail: "today", slots: ["9:30 AM","11:00 AM","5:30 PM"] },
  { id: "d6", name: "Dr. Arjun Das", spec: "orthopedics", exp: 16, fee: 1000, rating: 4.8, hospital: "MoveWell Hospital", city: "Pune", avail: "tomorrow", slots: ["10:00 AM","1:30 PM","6:30 PM"] },
  { id: "d7", name: "Dr. Sneha Kapoor", spec: "gynecology", exp: 13, fee: 850, rating: 4.9, hospital: "Bloom Women’s Clinic", city: "Delhi", avail: "today", slots: ["10:30 AM","12:30 PM","4:00 PM"] },
  { id: "d8", name: "Dr. Rohan Bhatt", spec: "neurology", exp: 18, fee: 1300, rating: 4.7, hospital: "NeuroPath", city: "Ahmedabad", avail: "week", slots: ["11:00 AM","3:00 PM"] },
  { id: "d9", name: "Dr. Fatima Khan", spec: "ent", exp: 8, fee: 600, rating: 4.6, hospital: "ClearTone ENT", city: "Lucknow", avail: "today", slots: ["9:00 AM","2:00 PM","7:00 PM"] },
  { id: "d10", name: "Dr. Nikhil Bose", spec: "general", exp: 10, fee: 500, rating: 4.8, hospital: "City Care Clinic", city: "Kolkata", avail: "today", slots: ["8:30 AM","12:00 PM","6:00 PM"] },
  { id: "d11", name: "Dr. Aisha Rahman", spec: "psychiatry", exp: 15, fee: 1100, rating: 4.9, hospital: "MindSpace", city: "Bengaluru", avail: "tomorrow", slots: ["10:00 AM","2:30 PM","5:00 PM"] },
  { id: "d12", name: "Dr. Dev Patel", spec: "ophthalmology", exp: 20, fee: 950, rating: 4.8, hospital: "VisionFirst", city: "Surat", avail: "week", slots: ["9:30 AM","1:00 PM","4:30 PM"] },
];

/**
 * Paste the Google Apps Script web-app URL after you deploy Code.gs
 * (see SETUP.md). Leave empty to keep local-only bookings.
 */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzE7hKgR0WEjryVBVKzZZrqL4mCfCXMyOFqwuHA66PEVOxZMrW_gEWFaV9AEPTvfw-SZQ/exec";
const CLINIC_NOTIFY_EMAIL = "doctynacademy@gmail.com";

const specName = (id) => SPECIALTIES.find((s) => s.id === id)?.name || id;
const initials = (name) => name.split(" ").filter((p) => p !== "Dr.").map((p) => p[0]).join("").slice(0, 2);

let selectedDoctor = null;
let currentSpec = "";
let currentAvail = "";
let currentQuery = "";

function fillSelects() {
  const opts = `<option value="">All specialties</option>` +
    SPECIALTIES.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
  document.getElementById("heroSpecialty").innerHTML = opts;
  document.getElementById("filterSpecialty").innerHTML = opts;
}

function renderSpecialties() {
  document.getElementById("specialtyGrid").innerHTML = SPECIALTIES.map((s) => `
    <article class="spec-card" data-spec="${s.id}">
      <div class="spec-icon">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.blurb}</p>
    </article>
  `).join("");
}

function filteredDoctors() {
  return DOCTORS.filter((d) => {
    const specOk = !currentSpec || d.spec === currentSpec;
    const availOk = !currentAvail || d.avail === currentAvail || (currentAvail === "week");
    const q = currentQuery.trim().toLowerCase();
    const qOk = !q || d.name.toLowerCase().includes(q) || specName(d.spec).toLowerCase().includes(q) || d.city.toLowerCase().includes(q);
    return specOk && availOk && qOk;
  });
}

function renderDoctors() {
  const list = filteredDoctors();
  document.getElementById("doctorCount").textContent =
    `Showing ${list.length} doctor${list.length === 1 ? "" : "s"}` +
    (currentSpec ? ` in ${specName(currentSpec)}` : "");
  document.getElementById("doctorGrid").innerHTML = list.map((d) => `
    <article class="doc-card">
      <div class="doc-top">
        <div class="avatar">${initials(d.name)}</div>
        <div>
          <h3>${d.name}</h3>
          <span class="badge">${specName(d.spec)}</span>
        </div>
      </div>
      <p class="meta">${d.hospital} · ${d.city}</p>
      <p class="meta">${d.exp} yrs exp · ₹${d.fee} · ★ ${d.rating}</p>
      <p class="meta">Next: ${d.avail === "today" ? "Today" : d.avail === "tomorrow" ? "Tomorrow" : "This week"} · ${d.slots[0]}</p>
      <div class="doc-actions">
        <button class="btn btn-primary btn-sm" data-book="${d.id}">Book slot</button>
        <button class="btn btn-ghost btn-sm" data-book="${d.id}">View times</button>
      </div>
    </article>
  `).join("") || `<p class="muted">No doctors match those filters. Try another specialty.</p>`;
}

function openModal(id) {
  selectedDoctor = DOCTORS.find((d) => d.id === id);
  if (!selectedDoctor) return;
  const d = selectedDoctor;
  document.getElementById("modalDoctor").innerHTML =
    `<strong>${d.name}</strong><br>${specName(d.spec)} · ${d.hospital} · ₹${d.fee}`;
  document.getElementById("bookTime").innerHTML =
    d.slots.map((s) => `<option>${s}</option>`).join("");
  const date = document.getElementById("bookDate");
  const today = new Date();
  if (d.avail === "tomorrow") today.setDate(today.getDate() + 1);
  date.min = today.toISOString().slice(0, 10);
  date.value = date.min;
  document.getElementById("modal").classList.add("open");
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
}

function loadAppts() {
  try { return JSON.parse(localStorage.getItem("medibook_appts") || "[]"); }
  catch { return []; }
}

function saveAppts(list) {
  localStorage.setItem("medibook_appts", JSON.stringify(list));
}

function renderAppts() {
  const list = loadAppts();
  const el = document.getElementById("apptList");
  if (!list.length) {
    el.innerHTML = `<div class="appt empty">No bookings yet. Pick a doctor above to reserve a slot.</div>`;
    return;
  }
  el.innerHTML = list.map((a, i) => `
    <div class="appt">
      <div>
        <strong>${a.doctor}</strong> · ${a.spec}<br>
        <span class="meta">${a.date} at ${a.time} · ${a.patient} (${a.phone})</span>
        ${a.reason ? `<br><span class="meta">${a.reason}</span>` : ""}
      </div>
      <button class="btn btn-ghost btn-sm" data-cancel="${i}">Cancel</button>
    </div>
  `).join("");
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

function applySearch() {
  currentSpec = document.getElementById("heroSpecialty").value || document.getElementById("filterSpecialty").value;
  currentQuery = document.getElementById("heroQuery").value;
  document.getElementById("filterSpecialty").value = currentSpec;
  renderDoctors();
  document.getElementById("doctors").scrollIntoView({ behavior: "smooth" });
}

fillSelects();
renderSpecialties();
renderDoctors();
renderAppts();

document.getElementById("specialtyGrid").addEventListener("click", (e) => {
  const card = e.target.closest("[data-spec]");
  if (!card) return;
  currentSpec = card.dataset.spec;
  document.getElementById("filterSpecialty").value = currentSpec;
  document.getElementById("heroSpecialty").value = currentSpec;
  renderDoctors();
  document.getElementById("doctors").scrollIntoView({ behavior: "smooth" });
});

document.body.addEventListener("click", async (e) => {
  const book = e.target.closest("[data-book]");
  if (book) openModal(book.dataset.book);

  const cancel = e.target.closest("[data-cancel]");
  if (cancel) {
    const list = loadAppts();
    const index = Number(cancel.dataset.cancel);
    const appt = list[index];

    if (GOOGLE_SCRIPT_URL && appt) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "cancel",
            patient: appt.patient,
            phone: String(appt.phone || "").replace(/\D/g, ""),
            doctor: appt.doctor,
            date: appt.date,
            time: appt.time
          })
        });
      } catch (err) {
        console.error(err);
        toast("Cancellation sync failed");
        return;
      }
    }

    list.splice(index, 1);
    saveAppts(list);
    renderAppts();
    toast("Appointment cancelled");
  }
});

document.getElementById("filterSpecialty").addEventListener("change", (e) => {
  currentSpec = e.target.value;
  document.getElementById("heroSpecialty").value = currentSpec;
  renderDoctors();
});
document.getElementById("filterAvail").addEventListener("change", (e) => {
  currentAvail = e.target.value;
  renderDoctors();
});
document.getElementById("heroSearchBtn").addEventListener("click", applySearch);
document.getElementById("heroQuery").addEventListener("keydown", (e) => {
  if (e.key === "Enter") applySearch();
});
document.getElementById("navBookBtn").addEventListener("click", () => {
  document.getElementById("doctors").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});

document.getElementById("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = e.target.querySelector("[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Booking…";

  const fd = new FormData(e.target);
  const appt = {
    doctor: selectedDoctor.name,
    spec: specName(selectedDoctor.spec),
    hospital: selectedDoctor.hospital,
    city: selectedDoctor.city,
    fee: selectedDoctor.fee,
    patient: fd.get("name"),
    phone: fd.get("phone"),
    age: fd.get("age"),
    email: fd.get("email"),
    date: fd.get("date"),
    time: fd.get("time"),
    reason: fd.get("reason") || "",
    created: Date.now(),
  };

  const list = loadAppts();
  list.unshift(appt);
  saveAppts(list);
  renderAppts();

  let remoteOk = false;
  if (GOOGLE_SCRIPT_URL) {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...appt,
          notifyEmail: CLINIC_NOTIFY_EMAIL,
        }),
      });
      remoteOk = true;
    } catch (err) {
      console.error(err);
    }
  }

  closeModal();
  e.target.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = "Confirm booking";

  if (!GOOGLE_SCRIPT_URL) {
    toast(`Booked locally. Add your Google Script URL to also update Sheets + email.`);
  } else if (remoteOk) {
    toast(`Booked ${appt.doctor}. Sheet updated and email sent.`);
  } else {
    toast(`Booked ${appt.doctor} locally. Cloud sync failed — check SETUP.md.`);
  }
  document.getElementById("appointments").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});
