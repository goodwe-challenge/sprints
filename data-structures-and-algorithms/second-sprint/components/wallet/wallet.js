function renderWallet() {
  const balEl = document.getElementById("wallet-balance");
  if (balEl) balEl.textContent = formatBRL(state.wallet.balance);
  renderSidebarBalance();
  renderWalletHistory();
}

function renderWalletHistory() {
  const list = document.getElementById("wallet-tx-list");
  if (!list) return;

  if (state.wallet.transactions.length === 0) {
    list.innerHTML = `<div class="wallet-empty">Nenhuma transação ainda.</div>`;
    return;
  }

  list.innerHTML = "";
  state.wallet.transactions.forEach(tx => {
    const div = document.createElement("div");
    div.className = "wallet-tx-item";
    if (tx.type === "session") {
      div.innerHTML = `
        <div class="wallet-tx-details">
          <div class="wallet-tx-label">${tx.label}</div>
          <div class="wallet-tx-date">${tx.date} · ${formatDuration(tx.durationMinutes)}</div>
        </div>
        <div class="wallet-tx-amount debit">- ${formatBRL(Math.abs(tx.amount))}</div>
      `;
    } else {
      div.innerHTML = `
        <div class="wallet-tx-details">
          <div class="wallet-tx-label">${tx.label}</div>
          <div class="wallet-tx-date">${tx.date}</div>
        </div>
        <div class="wallet-tx-amount credit">+ ${formatBRL(tx.amount)}</div>
      `;
    }
    list.appendChild(div);
  });
}

function initWallet() {
  const btnAdd = document.getElementById("btn-add-funds");
  const form = document.getElementById("wallet-add-form");
  const btnConfirm = document.getElementById("btn-confirm-add");
  const btnCancel = document.getElementById("btn-cancel-add");
  const amtInput = document.getElementById("wallet-add-amount");

  btnAdd.addEventListener("click", () => {
    btnAdd.classList.add("hidden");
    form.classList.remove("hidden");
    amtInput.focus();
  });

  btnCancel.addEventListener("click", () => {
    form.classList.add("hidden");
    btnAdd.classList.remove("hidden");
    amtInput.value = "";
  });

  btnConfirm.addEventListener("click", () => {
    const amount = parseFloat(amtInput.value);
    if (!Number.isFinite(amount) || amount <= 0) return;
    state.wallet.balance += amount;
    state.wallet.transactions.unshift({
      id: Date.now(),
      type: "deposit",
      date: new Date().toLocaleDateString("pt-BR"),
      label: "Recarga de saldo",
      amount,
    });
    saveState();
    form.classList.add("hidden");
    btnAdd.classList.remove("hidden");
    amtInput.value = "";
    renderWallet();
  });
}
