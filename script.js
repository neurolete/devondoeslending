document.getElementById("calcBtn").addEventListener("click", async () => {
  const homePrice = Number(document.getElementById("homePrice").value || 0);
  const downPayment = Number(document.getElementById("downPayment").value || 0);
  const rate = Number(document.getElementById("rate").value || 0);
  const years = Number(document.getElementById("years").value || 0);
  const principal = Math.max(homePrice - downPayment, 0);
  const monthly = calcMonthlyPayment(principal, rate, years);

  document.getElementById("monthlyPayment").textContent = formatCurrency(monthly);

  // NEW — pull saved email
  const email = localStorage.getItem("user_email") || "";

  const payload = {
    email,
    source: "Calc Button",
    page: window.location.href,
    homePrice,
    downPayment,
    rate,
    years
  };

  try {
    await fetch(LEAD_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Failed to log calc:", err);
  }
});
