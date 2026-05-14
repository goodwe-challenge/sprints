function renderPlans() {
  const grid = document.getElementById("plans-grid");
  grid.innerHTML = "";

  for (let i = 0; i < PLANS.length; i++) {
    const plan = PLANS[i];

    const card = document.createElement("div");
    card.className = "plan-card" + (plan.popular ? " popular" : "");
    card.dataset.id = plan.id;

    const featuresHtml = plan.features
      .map((f) => `<li><i class="fi fi-rr-check"></i>${f}</li>`)
      .join("");

    card.innerHTML = `
      <div class="plan-check"><i class="fi fi-rr-check"></i></div>
      <div class="plan-icon"><i class="fi ${plan.icon}"></i></div>
      <div class="plan-name">${plan.name}</div>
      <div class="plan-power">R$ ${plan.monthlyPrice}<span>/mês</span></div>
      <div class="plan-price">R$ ${plan.pricePerKwh.toFixed(2)}/kWh · ${plan.power} kW</div>
      <div class="plan-divider"></div>
      <ul class="plan-features">${featuresHtml}</ul>
    `;

    card.addEventListener("click", () => selectPlan(plan.id));
    grid.appendChild(card);
  }
}

function selectPlan(id) {
  selectedPlanId = id;
  document.querySelectorAll(".plan-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.id === id);
  });
  clearError("err-plan");
}

function handleLogin() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  clearError("err-login-email");
  clearError("err-login-password");

  let valid = true;

  if (!email || !email.includes("@")) {
    setError("err-login-email", "Informe um e-mail válido.");
    valid = false;
  }

  if (!password) {
    setError("err-login-password", "Informe sua senha.");
    valid = false;
  }

  if (!valid) return;

  const user = findUser(email);

  if (!user) {
    setError("err-login-email", "Conta não encontrada.");
    return;
  }

  if (user.password !== password) {
    setError("err-login-password", "Senha incorreta.");
    return;
  }

  sessionStorage.setItem(
    "loggedUser",
    JSON.stringify({ name: user.name, email: user.email, plan: user.plan })
  );
  window.location.href = "home.html";
}

function handleGoToPlans() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm").value;

  ["err-reg-name", "err-reg-email", "err-reg-password", "err-reg-confirm"].forEach(clearError);

  let valid = true;

  if (!name || name.length < 3) {
    setError("err-reg-name", "Nome deve ter ao menos 3 caracteres.");
    valid = false;
  }

  if (!email || !email.includes("@")) {
    setError("err-reg-email", "E-mail inválido.");
    valid = false;
  } else if (findUser(email)) {
    setError("err-reg-email", "E-mail já cadastrado.");
    valid = false;
  }

  if (password.length < 6) {
    setError("err-reg-password", "Senha deve ter ao menos 6 caracteres.");
    valid = false;
  }

  if (confirm !== password) {
    setError("err-reg-confirm", "As senhas não coincidem.");
    valid = false;
  }

  if (!valid) return;

  pendingRegistration = { name, email, password };
  showScreen("screen-register-2");
}

function handleRegister() {
  if (!selectedPlanId) {
    setError("err-plan", "Selecione um plano para continuar.");
    return;
  }

  const plan = PLANS.find((p) => p.id === selectedPlanId);
  const { name, email, password } = pendingRegistration;

  saveRegisteredUser({ name, email, password, plan });

  sessionStorage.setItem(
    "loggedUser",
    JSON.stringify({ name, email, plan })
  );
  window.location.href = "home.html";
}

document.getElementById("btn-login").addEventListener("click", handleLogin);

document.getElementById("go-register").addEventListener("click", (e) => {
  e.preventDefault();
  showScreen("screen-register-1");
});

document.getElementById("go-login-from-reg").addEventListener("click", (e) => {
  e.preventDefault();
  showScreen("screen-login");
});

document.getElementById("btn-go-plans").addEventListener("click", handleGoToPlans);

document.getElementById("go-back-step1").addEventListener("click", (e) => {
  e.preventDefault();
  showScreen("screen-register-1");
});

document.getElementById("btn-register").addEventListener("click", handleRegister);

renderPlans();
