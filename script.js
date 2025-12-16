const LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbw4mbdOL8fOmW7fYfVOljRw_iOzCrjOPMjMMqLT9v-QymTCXUVSBn0D4SDeGRAiwpsg3Q/exec";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Lead gate unlock (Google Apps Script -> Sheet + email to Devon)
const gate = document.getElementById("gate");
const calcBody = document.getElementById("calcBody");
const gateForm = document.getElementById("gateForm");

function unlockCalculator() {
  localStorage.setItem("calc_unlocked", "true");
  gate.style.display = "none";
  calcBody.classList.remove("locked");
  calcBody.setAttribute("aria-hidden", "false");
}

// Auto-unlock for returning visitors
if (localStorage.getItem("calc_unlocked") === "true") {
  unlockCalculator();
}

gateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = gateForm.querySelector('input[name="email"]').value.trim();

  const payload = {
    email,
    source: "Mortgage Calculator",
    page: window.location.href,
    homePrice: document.getElementById("homePrice")?.value || "",
    downPayment: document.getElementById("downPayment")?.value || "",
    rate: document.getElementById("rate")?.value || "",
    years: document.getElementById("years")?.value || ""
  };

  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Failed to submit lead");

    // Only unlock if the lead was actually captured
    unlockCalculator();
  } catch (err) {
    console.error(err);
    alert("Something went wrong saving your email. Please try again.");
  }
});

// Basic mortgage payment calc (principal & interest only)
function formatCurrency(n) {
  if (!isFinite(n)) return "$—";
  return n.toLocaleString(undefined, { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

function calcMonthlyPayment(principal, annualRatePct, years) {
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

document.getElementById("calcBtn").addEventListener("click", () => {
  const homePrice = Number(document.getElementById("homePrice").value || 0);
  const downPayment = Number(document.getElementById("downPayment").value || 0);
  const rate = Number(document.getElementById("rate").value || 0);
  const years = Number(document.getElementById("years").value || 0);

  const principal = Math.max(homePrice - downPayment, 0);
  const monthly = calcMonthlyPayment(principal, rate, years);

  document.getElementById("monthlyPayment").textContent = formatCurrency(monthly);
});
