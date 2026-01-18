// Booking storage (localStorage) 
function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem("bookings")) || [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

// Show saved bookings
function showBookingsSimple() {
  const list = document.getElementById("bookingsList");
  if (!list) return;

  const bookings = loadBookings();

  if (!bookings.length) {
    list.innerHTML = "No appointments yet.";
    return;
  }

  list.innerHTML = bookings
    .map(b => `${b.petName} (${b.ownerName}) - ${b.date} - ${b.service}`)
    .join("<br>");
}

// Clear saved bookings 
const clearBtn = document.getElementById("clearBookingsBtn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (!confirm("Clear all appointments?")) return;
    localStorage.removeItem("bookings");
    showBookingsSimple();
  });
}

// Booking form
const bookingForm = document.getElementById('bookingForm');
const feedback = document.getElementById('formFeedback');

if (bookingForm) {
  bookingForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const owner = document.getElementById('ownerName').value;
    const pet = document.getElementById('petName').value;
    const dateInput = document.getElementById('appointmentDate').value;
    const service = document.getElementById('serviceType').value;

    const selectedDate = new Date(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      feedback.innerHTML = '<p class="text-danger">Error: Please select a future date.</p>';
      return;
    }

    feedback.innerHTML = "";

    const booking = {
      ownerName: owner,
      petName: pet,
      date: selectedDate.toDateString(),
      service: service
    };

    const bookings = loadBookings();
    bookings.unshift(booking);
    saveBookings(bookings);
    showBookingsSimple();

    bookingForm.innerHTML = `
      <div class="alert alert-success mt-4">
        <h3>Booking Confirmed!</h3>
        <p>Thank you, ${owner}. We have scheduled ${pet} for ${selectedDate.toDateString()}.</p>
        <a href="index.html" class="btn btn-primary mt-2">Back to Home</a>
      </div>`;
  });
}

// For adding new records
function setupRecordsForm() {
    const recordsForm = document.getElementById("recordsForm");
    if (recordsForm) {
        recordsForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const owner = document.getElementById("recordOwner").value;
            const pet = document.getElementById("recordPet").value;
            const date = document.getElementById("recordDate").value;
            const notes = document.getElementById("recordNotes").value;
            const newRecord = { owner, pet, date, notes };
            const records = JSON.parse(localStorage.getItem("records")) || [];
            records.push(newRecord);
            localStorage.setItem("records", JSON.stringify(records));
            recordsForm.reset();
            loadRecords();
        });
    }
}

// Display saved records
function loadRecords() {
    const records = JSON.parse(localStorage.getItem("records")) || [];
    const recordsList = document.getElementById("recordsList");
    const searchBox = document.getElementById("recordsSearch");
    const countBadge = document.getElementById("recordsCount");
    const query = searchBox ? searchBox.value.toLowerCase().trim() : "";
    if (!recordsList) return;
    recordsList.innerHTML = "";
    const filtered = records.filter((r) => {
        const owner = (r.owner || "").toLowerCase();
        const pet = (r.pet || "").toLowerCase();
        const date = (r.date || "").toLowerCase();
        const notes = (r.notes || "").toLowerCase();
        return owner.includes(query) || pet.includes(query) || date.includes(query) || notes.includes(query); 
    });
    if (countBadge) {
        countBadge.textContent = `${filtered.length} record${filtered.length === 1 ? "" : "s"}`;
    }
    if (filtered.length === 0) {
        recordsList.innerHTML = "<p>No matching records found.</p>";
        return;
    }
    filtered.forEach((record, index) => {
        const item = document.createElement("div");
        item.className = "record-item";
        item.innerHTML = `
        <div class="record-top">
           <span class="record-title">${record.pet}</span>
           <span class="record-date">${record.date}</span>
        </div>
        <div class="record-meta">Owner: ${record.owner}</div>
        <div class="record-notes">${record.notes}</div>
        <div class="record-actions"></div>
        `;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => {
            if (!confirm("Delete this record?")) return;

            const realIndex = records.indexOf(record);
            if (realIndex > -1) records.splice(realIndex, 1);
            localStorage.setItem("records", JSON.stringify(records));
            loadRecords();
        });
        const actions = item.querySelector(".record-actions");
        if (actions) actions.appendChild(deleteBtn);
        recordsList.appendChild(item);
    });
}

// Run records functions if records page exists
if (document.getElementById("recordsList")) {
    setupRecordsForm();
    loadRecords();
    const recordsSearch = document.getElementById("recordsSearch");
    if (recordsSearch) recordsSearch.addEventListener("input", loadRecords);
}

// Contact form validation and feedback
function isValidEmail(email) {
    const at = email.indexOf("@");
    const dot = email.lastIndexOf(".");
    return at > 0 && dot > at + 1 && dot < email.length - 1;
}

function setupContactForm() {
    const form = document.getElementById("contactForm");
    const feedbackBox = document.getElementById("contactFeedback");

    if (!form || !feedbackBox) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        const errors = [];

        if (name.length < 2) errors.push("Please enter your full name.");
        if (!isValidEmail(email)) errors.push("Please enter a valid email address.");
        if (subject.length < 3) errors.push("Please enter a subject.");
        if (message.length < 10) errors.push("Please enter a message (at least 10 characters).");

        if (errors.length > 0) {
            feedbackBox.innerHTML = `
                <div class="alert alert-danger py-2 px-3 mb-0">
                    ${errors.join("<br>")}
                </div>
            `;
            return;
        }

        feedbackBox.innerHTML = `
            <div class="alert alert-success py-2 px-3 mb-0">
                Thanks, <strong>${name}</strong> — your message has been sent. We’ll reply within 24 hours.
            </div>
        `;

        form.reset();
    });
}

// Only run on contact page
if (document.getElementById("contactForm")) {
    setupContactForm();
}

// Emergency numbers toggle
const toggleNumbersBtn = document.getElementById("toggleNumbers");
const emergencyNumbersBox = document.getElementById("emergencyNumbers");

if (toggleNumbersBtn && emergencyNumbersBox) {
  toggleNumbersBtn.addEventListener("click", () => {
    emergencyNumbersBox.classList.toggle("d-none");

    toggleNumbersBtn.textContent = emergencyNumbersBox.classList.contains("d-none")
      ? "Show emergency numbers"
      : "Hide emergency numbers";
  });
}

// Vaccinations toggle (dogs/cats)
const btnDogs = document.getElementById("btnDogs");
const btnCats = document.getElementById("btnCats");
const dogsSchedule = document.getElementById("dogsSchedule");
const catsSchedule = document.getElementById("catsSchedule");

if (btnDogs && btnCats && dogsSchedule && catsSchedule) {
  btnDogs.addEventListener("click", () => {
    dogsSchedule.classList.remove("d-none");
    catsSchedule.classList.add("d-none");

    btnDogs.classList.remove("btn-outline-primary");
    btnDogs.classList.add("btn-primary");

    btnCats.classList.remove("btn-primary");
    btnCats.classList.add("btn-outline-primary");
  });

  btnCats.addEventListener("click", () => {
    catsSchedule.classList.remove("d-none");
    dogsSchedule.classList.add("d-none");

    btnCats.classList.remove("btn-outline-primary");
    btnCats.classList.add("btn-primary");

    btnDogs.classList.remove("btn-primary");
    btnDogs.classList.add("btn-outline-primary");
  });
}

// Pharmacy filter buttons
const phAll = document.getElementById("phAll");
const phPrev = document.getElementById("phPrev");
const phCare = document.getElementById("phCare");
const phItems = document.querySelectorAll(".pharmacy-item");

function setActive(btn) {
  [phAll, phPrev, phCare].forEach(b => {
    if (!b) return;
    b.classList.remove("btn-primary");
    b.classList.add("btn-outline-primary");
  });

  if (btn) {
    btn.classList.remove("btn-outline-primary");
    btn.classList.add("btn-primary");
  }
}

function filterItems(cat) {
  phItems.forEach(item => {
    const show = cat === "all" || item.dataset.cat === cat;
    item.classList.toggle("d-none", !show);
  });
}

if (phAll && phPrev && phCare && phItems.length) {
  phAll.addEventListener("click", () => {
    setActive(phAll);
    filterItems("all");
  });

  phPrev.addEventListener("click", () => {
    setActive(phPrev);
    filterItems("prev");
  });

  phCare.addEventListener("click", () => {
    setActive(phCare);
    filterItems("care");
  });
}

// When page loads, show any saved bookings
if (document.getElementById("bookingsList")) {
  showBookingsSimple();
}
