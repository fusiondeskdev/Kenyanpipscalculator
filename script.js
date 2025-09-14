function calculate() {
  const balanceKES = parseFloat(document.getElementById('balanceKES').value);
  const rateKESperUSD = parseFloat(document.getElementById('rateKESperUSD').value);
  const leverage = parseFloat(document.getElementById('leverage').value);
  const entry = parseFloat(document.getElementById('entry').value);
  const tp = parseFloat(document.getElementById('tp').value);
  const sl = parseFloat(document.getElementById('sl').value);

  if (isNaN(balanceKES) || isNaN(rateKESperUSD) || isNaN(leverage) || isNaN(entry) || isNaN(tp) || isNaN(sl)) {
    document.getElementById('output').innerHTML =
      '<span style="color:#c0392b;">Please fill in all fields correctly.</span>';
    openModal();
    return;
  }

  const balanceUSD = balanceKES / rateKESperUSD;
  const pipSize = 0.0001;
  const tpPips = Math.abs(tp - entry) / pipSize;
  const slPips = Math.abs(entry - sl) / pipSize;

  const marginPerLot = 100000.0 / leverage;
  const maxLots = balanceUSD / marginPerLot;

  const pipValuePerLot = 10.0;
  const pipValue = pipValuePerLot * maxLots;

  const riskUSD = slPips * pipValue;
  const rewardUSD = tpPips * pipValue;
  const riskKES = riskUSD * rateKESperUSD;
  const rewardKES = rewardUSD * rateKESperUSD;
  const rrRatio = (riskUSD > 0) ? (rewardUSD / riskUSD) : 0;

  document.getElementById('output').innerHTML = `
    <div>Account Balance: <span class="highlight">${balanceKES.toFixed(2)} KES</span> (${balanceUSD.toFixed(2)} USD)</div>
    <div>Max Lot Size: <span class="highlight">${maxLots.toFixed(2)} lots</span></div>
    <div>TP Distance: <span class="highlight">${tpPips.toFixed(1)} pips</span></div>
    <div>SL Distance: <span class="highlight">${slPips.toFixed(1)} pips</span></div>
    <div>Risk: <span style="color:#c0392b; font-weight:700;">${riskKES.toFixed(2)} KES</span> (${riskUSD.toFixed(2)} USD)</div>
    <div>Reward: <span style="color:#27ae60; font-weight:700;">${rewardKES.toFixed(2)} KES</span> (${rewardUSD.toFixed(2)} USD)</div>
    <div>Reward:Risk Ratio = <span class="highlight">${rrRatio.toFixed(2)} : 1</span></div>
  `;

  openModal();
}

function openModal() {
  document.getElementById("resultModal").style.display = "flex";
}
function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}
window.onclick = function (event) {
  const modal = document.getElementById("resultModal");
  if (event.target === modal) closeModal();
};

// Enter key acts like Tab
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const formElements = Array.from(document.querySelectorAll("#balanceKES, #rateKESperUSD, #leverage, #entry, #tp, #sl, button"));
    const index = formElements.indexOf(document.activeElement);

    if (index > -1) {
      event.preventDefault();
      const nextElement = formElements[index + 1];
      if (nextElement) {
        nextElement.focus();
      } else {
        calculate();
      }
    }
  }
});
