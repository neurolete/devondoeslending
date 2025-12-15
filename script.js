// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Lead gate unlock
const gate = document.getElementById("gate");
const calcBody = document.getElementById("calcBody");
const gateForm = document.getElementById("gateForm");

function setUnlocked() {
  localStorage.setItem("calc_unlocked", "true");
  gate.style.display = "none";
  calcBody.classList.remove("locked");
  calcBody.setAttribute("aria-hidden", "false");
}

const alreadyUnlocked = localStorage.getItem("calc_unlocked") === "true";
if (alreadyUnlocked) setUnlocked();

gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Later: send email to Formspree/Mailchimp endpoint.
  // For now: unlock immediately.
  setUnlocked();
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
