function calculate() {
  const balanceKES = parseFloat(document.getElementById('balanceKES').value);
  const rateKESperUSD = parseFloat(document.getElementById('rateKESperUSD').value);
  const leverage = parseFloat(document.getElementById('leverage').value);
  const entry = parseFloat(document.getElementById('entry').value);
  const tp = parseFloat(document.getElementById('tp').value);
  const sl = parseFloat(document.getElementById('sl').value);

  if (isNaN(balanceKES) || isNaN(rateKESperUSD) || isNaN(leverage) || isNaN(entry) || isNaN(tp) || isNaN(sl)) {
    document.getElementById('output').innerHTML =
      '<span style="color:#FF4444;">Please fill in all fields correctly.</span>';
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
    Account Balance: <span class="highlight">${balanceKES.toFixed(2)} KES</span> (${balanceUSD.toFixed(2)} USD)<br>
    Max Lot Size: <span class="highlight">${maxLots.toFixed(2)} lots</span><br>
    TP Distance: <span class="highlight">${tpPips.toFixed(1)} pips</span><br>
    SL Distance: <span class="highlight">${slPips.toFixed(1)} pips</span><br>
    Risk: <span class="highlight">${riskKES.toFixed(2)} KES</span> (${riskUSD.toFixed(2)} USD)<br>
    Reward: <span class="highlight">${rewardKES.toFixed(2)} KES</span> (${rewardUSD.toFixed(2)} USD)<br>
    Reward:Risk Ratio = <span class="highlight">${rrRatio.toFixed(2)} : 1</span>
  `;

  openModal();
}

function openModal() {
  document.getElementById("resultModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}

// Close modal if user clicks outside
window.onclick = function (event) {
  const modal = document.getElementById("resultModal");
  if (event.target === modal) {
    closeModal();
  }
};

// Make Enter act like Tab inside form
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const formElements = Array.from(document.querySelectorAll("#balanceKES, #rateKESperUSD, #leverage, #entry, #tp, #sl, button"));
    const index = formElements.indexOf(document.activeElement);

    if (index > -1) {
      event.preventDefault(); // stop default submit
      const nextElement = formElements[index + 1];
      if (nextElement) {
        nextElement.focus(); // move to next field
      } else {
        // If last element (button), trigger calculate
        calculate();
      }
    }
  }
});
