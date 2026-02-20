/***********************
  1) IMAGES
************************/
const IMAGES = {
  LOGO_DIRECT:  "https://i.ibb.co/Ndxtr33R/Lanka-Trails-Logo.png",
  HERO_DIRECT:  "https://i.ibb.co/4QRzYpw/BIG-PIC-png.jpg",
  // Ashrif photo (Marketing)
  ASHROF_DIRECT:"https://i.ibb.co/rR17f3nH/Ashrif-IMG.png",
  // ✅ fixed link (case sensitive)
  SHIHAB_DIRECT:"https://i.ibb.co/F4Q1Hmfy/Sihab-IMG.png",
  // Manaal photo (Founder)
  MANAL_DIRECT: "https://i.ibb.co/MxZYZ4Wp/MAnal-IMG.jpg"
};

let CURRENT_PACKAGE = "Custom Booking";
let LAST_AI_PLAN_TEXT = "";

/***********************
  2) PACKAGES DATA
************************/
const packages = [
  {
    name: "Hanthana Day Hike",
    difficulty: "Beginner",
    duration: "1 Day",
    includes: ["Guide", "Optional Meals", "Optional Transport", "Safety Support"],
    price: "LKR — (set later)"
  },
  {
    name: "Knuckles Trek",
    difficulty: "Intermediate",
    duration: "2 Days",
    includes: ["Guide", "Meals", "Transport", "Medical Support (optional)"],
    price: "LKR — (set later)"
  },
  {
    name: "Horton Plains Sunrise",
    difficulty: "Beginner",
    duration: "1 Day",
    includes: ["Guide", "Optional Meals", "Optional Transport", "Safety Support"],
    price: "LKR — (set later)"
  },
  {
    name: "Ella Scenic Hike",
    difficulty: "Intermediate",
    duration: "1 Day",
    includes: ["Guide", "Food Options", "Optional Transport", "Safety Support"],
    price: "LKR — (set later)"
  },
  {
    name: "Multi-day Knuckles + Stay",
    difficulty: "Advanced",
    duration: "3+ Days",
    includes: ["Guide", "Meals", "Transport", "Medical Support"],
    price: "LKR — (set later)"
  }
];

/***********************
  3) SHORT HELPERS
************************/
function $(id){ return document.getElementById(id); }

/***********************
  4) MODAL
************************/
function openModal(pkgName) {
  CURRENT_PACKAGE = pkgName || "Custom Booking";

  $("modalPkg").textContent = `Package: ${CURRENT_PACKAGE}`;
  $("modalBackdrop").classList.add("show");
  $("modalBackdrop").setAttribute("aria-hidden", "false");

  // ✅ Fill hidden fields for Formspark
  const pkgField = $("selectedPackageField");
  const planField = $("aiPlanField");
  if (pkgField) pkgField.value = CURRENT_PACKAGE;
  if (planField) planField.value = LAST_AI_PLAN_TEXT || "";
}

function closeModal() {
  $("modalBackdrop").classList.remove("show");
  $("modalBackdrop").setAttribute("aria-hidden", "true");
}

/***********************
  5) PACKAGES RENDER + FILTERS
************************/
function renderPackages(list) {
  const grid = $("packageGrid");
  grid.innerHTML = "";

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <div class="muted small">${p.difficulty} • ${p.duration}</div>

      <ul class="list">
        ${p.includes.map((i) => `<li>${i}</li>`).join("")}
      </ul>

      <div class="muted small">Price: ${p.price}</div>

      <div style="margin-top:14px;">
        <button class="btn btn-primary" data-book="${p.name}" type="button">Book Now</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll("[data-book]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-book")));
  });
}

function applyFilters() {
  const d = $("filterDifficulty").value;
  const du = $("filterDuration").value;
  const q = ($("searchPackage").value || "").toLowerCase().trim();

  const filtered = packages.filter((p) => {
    const okDiff = d === "all" || p.difficulty === d;
    const okDur = du === "all" || p.duration === du;
    const okSearch = !q || p.name.toLowerCase().includes(q);
    return okDiff && okDur && okSearch;
  });

  renderPackages(filtered);
}

/***********************
  6) AI PLANNER
************************/
function generatePlan() {
  const d = Number($("days").value || 1);
  const med = $("medical").value;

  let route =
    d === 1
      ? "Hanthana / Horton Plains (Day hike)"
      : d === 2
      ? "Knuckles (2-day trek)"
      : "Custom multi-day trail (Knuckles + nearby stays)";

  let safety =
    med !== "None"
      ? "Medical support recommended + extra safety checks"
      : "Standard safety kit + trained guide";

  $("planRoute").textContent = route;
  $("planSafety").textContent = safety;

  $("planPrefs").textContent =
    `Days: ${d} • Fitness: ${$("fitness").value} • Experience: ${$("experience").value} • Food: ${$("food").value} • Group: ${$("group").value} • Medical: ${med}`;

  // ✅ Save for booking submission
  LAST_AI_PLAN_TEXT =
    `Route: ${route}\n` +
    `Safety: ${safety}\n` +
    `Prefs: Days ${d}, Fitness ${$("fitness").value}, Exp ${$("experience").value}, Food ${$("food").value}, Group ${$("group").value}, Medical ${med}`;
}

/***********************
  7) INIT
************************/
window.addEventListener("DOMContentLoaded", () => {
  // Images
  $("siteLogo").src = IMAGES.LOGO_DIRECT;

  const hero = $("heroImage");
  hero.style.backgroundImage = `url("${IMAGES.HERO_DIRECT}")`;
  hero.style.backgroundSize = "cover";
  hero.style.backgroundPosition = "center";
  hero.style.backgroundRepeat = "no-repeat";

  // Team photos (IDs match HTML)
  $("imgManal").src = IMAGES.MANAL_DIRECT;   // Manaal Founder
  $("imgShihab").src = IMAGES.SHIHAB_DIRECT; // Sihab Operations
  $("imgAshrof").src = IMAGES.ASHROF_DIRECT; // Ashrif Marketing

  // Modal events
  $("navBookBtn").addEventListener("click", () => openModal("Custom Booking"));
  $("closeModalBtn").addEventListener("click", closeModal);
  $("modalBackdrop").addEventListener("click", (e) => {
    if (e.target === $("modalBackdrop")) closeModal();
  });

  // Packages init + filters
  renderPackages(packages);
  $("filterDifficulty").addEventListener("change", applyFilters);
  $("filterDuration").addEventListener("change", applyFilters);
  $("searchPackage").addEventListener("input", applyFilters);

  // AI buttons
  $("generatePlanBtn").addEventListener("click", generatePlan);

  $("continueToBookingBtn").addEventListener("click", () => {
    if (!LAST_AI_PLAN_TEXT) generatePlan();

    const d = Number($("days").value || 1);
    const suggested =
      d === 1 ? "Hanthana Day Hike" : d === 2 ? "Knuckles Trek" : "Multi-day Knuckles + Stay";

    openModal(suggested);
  });
});