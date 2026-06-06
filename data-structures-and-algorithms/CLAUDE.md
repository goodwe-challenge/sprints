# CLAUDE.md — Thunderbolt · GoodWe Challenge
> Disciplina: Data Structures and Algorithms  
> Aluno: Álvaro Alexandre Rezende Gonçalves

---

## Estrutura do repositório

```
sprints/data-structures-and-algorithms/
├── CLAUDE.md                             ← este arquivo
├── first-sprint/                         ← Sprint 1 (referência — não modificar)
└── second-sprint/                        ← Sprint 2 (construir do zero)
    ├── index.html                        ← entry point
    ├── css/
    │   └── base/
    │       ├── tokens.css                ← design tokens (CSS vars)
    │       ├── reset.css
    │       └── animations.css
    ├── js/
    │   └── core/
    │       ├── state.js                  ← estado global centralizado
    │       ├── constants.js              ← PLANS, GRID_CAPACITY, etc.
    │       ├── helpers.js                ← funções puras utilitárias
    │       ├── tariff.js                 ← calcPricePerKwh, tariffRules
    │       ├── session-manager.js        ← activeSessions (Map), throttling
    │       ├── queue.js                  ← classe Queue (FIFO)
    │       ├── ocpp.js                   ← OCPPMessageBus
    │       └── modbus.js                 ← modbusRegisters, updateFromSession
    └── components/
        ├── station-card/
        │   ├── station-card.js           ← render + eventos do card
        │   └── station-card.css
        ├── demand-bar/
        │   ├── demand-bar.js
        │   └── demand-bar.css
        ├── session-form/
        │   ├── session-form.js           ← modal de configuração da sessão
        │   └── session-form.css
        ├── tariff-breakdown/
        │   ├── tariff-breakdown.js       ← exibe base × horário × demanda × tipo
        │   └── tariff-breakdown.css
        ├── ocpp-log/
        │   ├── ocpp-log.js               ← log de mensagens OCPP em tempo real
        │   └── ocpp-log.css
        ├── modbus-table/
        │   ├── modbus-table.js           ← tabela de registros MODBUS
        │   └── modbus-table.css
        ├── waiting-queue/
        │   ├── waiting-queue.js          ← fila de veículos aguardando
        │   └── waiting-queue.css
        ├── wallet/
        │   ├── wallet.js
        │   └── wallet.css
        └── sidebar/
            ├── sidebar.js
            └── sidebar.css
```

**Regras críticas de diretório:**
- ✅ Todo código novo vai EXCLUSIVAMENTE em `second-sprint/` — é a única pasta de trabalho
- 🔒 `first-sprint/` é somente leitura — pode ser consultada para entender a lógica existente, mas NUNCA modificada
- Nunca criar, editar ou deletar arquivos dentro de `first-sprint/`

**Regras de arquivo:**
- Nenhum arquivo `.js` ou `.css` com mais de 100 linhas — se ultrapassar, dividir
- Cada componente vive na sua pasta com seu próprio `.js` e `.css`
- `css/base/` é o único CSS global — tudo mais é escopado ao componente
- `js/core/` contém lógica de negócio pura, sem tocar no DOM
- `components/` contém apenas renderização e eventos — sem lógica de negócio
- `first-sprint/` é somente leitura — serve como referência de lógica

---

## Design System — Sprint 2

### Tipografia
- **Fonte única:** Montserrat (Google Fonts)
- Carregar via `<link>` no `<head>`: pesos 400, 500, 600, 700
- `font-family: 'Montserrat', sans-serif` no `*` ou `:root`

### Unidades — regras absolutas
```
✅ rem   → espaçamentos, tamanhos, larguras, alturas
✅ em    → font-size (escala relativa ao pai)
✅ vw/vh → telas completas, hero sections
❌ px    → BANIDO — nenhuma exceção
❌ %     → BANIDO
```

### Espaçamento — regras absolutas
```
✅ padding  → espaço interno de qualquer elemento
✅ gap      → espaço entre filhos no flex/grid
❌ margin   → BANIDO — nenhuma exceção
```

> Para centralizar ou separar blocos, usar `padding` no pai ou `gap` no container flex/grid.  
> Para empurrar um item ao fim, usar `margin-left: auto` é a **única exceção permitida** (utilidade flex, não espaçamento).

### Layout
- Todo elemento que posiciona filhos **deve declarar `display` explicitamente**:
  ```css
  /* coluna */
  display: flex;
  flex-direction: column;

  /* linha (padrão flex, mas declarar explicitamente) */
  display: flex;
  flex-direction: row;

  /* grid */
  display: grid;
  grid-template-columns: ...;
  ```
- Nunca assumir direção padrão — sempre declarar `flex-direction`.

### Tokens CSS (definir em `css/base/tokens.css`)
```css
:root {
  /* Escala de espaço (rem) */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Tipografia (em — relativa ao contexto) */
  --text-xs:   0.75em;
  --text-sm:   0.875em;
  --text-base: 1em;
  --text-lg:   1.125em;
  --text-xl:   1.25em;
  --text-2xl:  1.5em;
  --text-3xl:  2em;
  --text-4xl:  2.5em;

  /* Raio de borda */
  --radius-sm:   0.25rem;
  --radius-md:   0.5rem;
  --radius-lg:   1rem;
  --radius-full: 9999rem;

  /* Cores — definir paleta Sprint 2 aqui */
  --color-bg:         #0a0a0f;
  --color-surface:    #13131a;
  --color-surface-2:  #1c1c26;
  --color-border:     #2a2a38;
  --color-accent:     #00e5a0;
  --color-accent-dim: #00e5a020;
  --color-text:       #f0f0f5;
  --color-text-muted: #8888a0;
  --color-warning:    #f5a623;
  --color-danger:     #ff4d6d;
  --color-success:    #00e5a0;
}
```

### Estética Sprint 2
- Dark mode como padrão — fundo escuro profundo, não preto puro
- Superfícies com leve elevação via `background` e `border`, nunca `box-shadow` pesado
- Accent verde-elétrico (`#00e5a0`) como cor de ação e dados ativos
- Cards limpos: `padding` generoso, `border` sutil, `border-radius` com `--radius-lg`
- Sem gradientes pesados — usar transparência e bordas para profundidade
- Animações funcionais: transições de estado (ativo/inativo), não decorativas

---

## Lógica herdada da Sprint 1 (referência)

### Estado global (app.js Sprint 1)
```js
PLANS[]          // 3 planos: basic (3.7kW, R$1.40), plus (7.4kW, R$1.10), ultra (22kW, R$0.80)
tariffRules      // peakStart:18, peakEnd:22, peakMultiplier:1.30, premiumDiscount:0.85
sessionHistory[] // array em memória
activeSession    // objeto singular — SUBSTITUIR por activeSessions[] na Sprint 2
wallet           // { balance: 100, transactions: [] }
```

### Tarifação (helpers.js Sprint 1)
```js
function calcPricePerKwh(basePricePerKwh, hour, userType) {
  let price = basePricePerKwh;
  if (hour >= 18 && hour < 22) price *= 1.30;  // pico
  if (userType === "premium")  price *= 0.85;   // desconto
  return price;
}
```

### Planos
| ID | Nome | Potência | Mensalidade | R$/kWh |
|----|------|----------|-------------|--------|
| `"basic"` | Básico | 3,7 kW | R$ 49 | R$ 1,40 |
| `"plus"` | Plus | 7,4 kW | R$ 89 | R$ 1,10 |
| `"ultra"` | Ultra | 22 kW | R$ 139 | R$ 0,80 |

---

## Sprint 2 — O que construir

### Critério 1 — Múltiplas sessões (0–20 pts)
**Meta: nota máxima (16–20)**

Transformar `activeSession` em `activeSessions`:
```js
// Estrutura alvo
const activeSessions = new Map(); // Map<stationId, SessionObject>

const SessionObject = {
  id: "sess_001",
  stationId: "A",
  vehicleId: "VH-01",
  userId: "user_123",
  userType: "premium",    // "standard" | "premium"
  plan: PLANS[0],
  power: 3.7,             // kW alocado (pode ser throttled)
  powerMax: 3.7,          // kW nominal do plano
  pricePerKwh: 0,
  startTime: null,
  elapsedMinutes: 0,
  totalMinutes: 0,
  initialPct: 0,
  batteryCapacity: 75,
  status: "charging",     // "charging" | "queued" | "done"
};
```

UI: lista de cards simultâneos, um por estação.  
Simular ao menos 3 veículos para demonstração.

**Estruturas DSA:** `Map`, `Array`

---

### Critério 2 — Controle de demanda (0–20 pts)
**Meta: nota máxima (16–20)**

```js
// station.js
const GRID_CAPACITY_KW = 50;          // capacidade total da estação
const MAX_STATIONS = 4;               // número de pontos de recarga

function calcTotalActivePower() {
  let total = 0;
  activeSessions.forEach(s => { total += s.power; });
  return total;
}

function applyThrottling() {
  const total = calcTotalActivePower();
  if (total > GRID_CAPACITY_KW) {
    const factor = GRID_CAPACITY_KW / total;
    activeSessions.forEach(s => { s.power = s.powerMax * factor; });
  }
}
```

Fila de espera (Queue FIFO) para quando todas as estações estão ocupadas:
```js
class Queue {
  constructor() { this.items = []; }
  enqueue(item) { this.items.push(item); }
  dequeue()     { return this.items.shift(); }
  peek()        { return this.items[0]; }
  get size()    { return this.items.length; }
  get isEmpty() { return this.items.length === 0; }
}

const waitingQueue = new Queue();
```

UI: barra de demanda total vs. capacidade, throttling visível nos cards.

**Estruturas DSA:** `Queue (FIFO)`, algoritmo de distribuição proporcional

---

### Critério 3 — Tarifação dinâmica (0–15 pts)
**Meta: nota máxima (14–15)**

Expandir `calcPricePerKwh()` com fator de demanda e faixa noturna:
```js
// helpers.js Sprint 2
const tariffRules = {
  night:    { start: 0,  end: 6,  multiplier: 0.70 }, // madrugada
  standard: { start: 6,  end: 18, multiplier: 1.00 }, // diurno
  peak:     { start: 18, end: 22, multiplier: 1.30 }, // pico
  premium:  { discount: 0.85 },
  demand: [
    { threshold: 0.0, multiplier: 1.00 }, // 0–40% capacidade
    { threshold: 0.4, multiplier: 1.10 }, // 40–70%
    { threshold: 0.7, multiplier: 1.25 }, // 70–90%
    { threshold: 0.9, multiplier: 1.50 }, // >90%
  ]
};

function calcPricePerKwh(basePricePerKwh, hour, userType, demandRatio) {
  let price = basePricePerKwh;

  // Faixa horária
  if (hour >= 0  && hour < 6)  price *= 0.70;
  if (hour >= 18 && hour < 22) price *= 1.30;

  // Demanda
  const demandRule = [...tariffRules.demand]
    .reverse()
    .find(r => demandRatio >= r.threshold);
  price *= demandRule.multiplier;

  // Tipo de usuário
  if (userType === "premium") price *= 0.85;

  return price;
}
```

UI: breakdown visível — `base × horário × demanda × tipo = efetivo`

**Estruturas DSA:** lookup table, array de regras com busca linear

---

### Critério 4 — Simulação OCPP/MODBUS (0–15 pts)
**Meta: nota máxima (14–15)**

#### `js/ocpp.js`
```js
// Formato OCPP 1.6 — arrays [messageTypeId, uniqueId, action?, payload]
// Call:       [2, id, action, payload]
// CallResult: [3, id, payload]

class OCPPMessageBus {
  constructor() {
    this.messageLog = [];   // histórico visível no UI
    this.queue = new Queue();
  }

  send(action, payload) {
    const id = "msg_" + Date.now();
    const frame = [2, id, action, payload];
    this.queue.enqueue(frame);
    this._log("→ SEND", action, payload);
    // simular resposta automática
    setTimeout(() => this._autoRespond(id, action), 300);
    return id;
  }

  _autoRespond(id, action) {
    const responses = {
      BootNotification:  { status: "Accepted", currentTime: new Date().toISOString(), interval: 30 },
      Authorize:         { idTagInfo: { status: "Accepted" } },
      StartTransaction:  { transactionId: Math.floor(Math.random() * 9000 + 1000), idTagInfo: { status: "Accepted" } },
      StopTransaction:   { idTagInfo: { status: "Accepted" } },
      MeterValues:       {},
    };
    const frame = [3, id, responses[action] || {}];
    this._log("← RECV", action + "Response", responses[action]);
  }

  _log(direction, action, payload) {
    this.messageLog.unshift({ ts: new Date().toISOString(), direction, action, payload });
    if (this.messageLog.length > 50) this.messageLog.pop();
  }
}

const ocppBus = new OCPPMessageBus();
```

#### `js/modbus.js`
```js
// Holding Registers — atualizar a cada tick
const modbusRegisters = {
  0x0001: { value: 0, label: "Tensão",        unit: "V",   factor: 0.1 },
  0x0002: { value: 0, label: "Corrente",      unit: "A",   factor: 0.1 },
  0x0003: { value: 0, label: "Potência Ativa",unit: "W",   factor: 1   },
  0x0004: { value: 0, label: "Energia Total", unit: "Wh",  factor: 1   },
  0x0005: { value: 0, label: "Temperatura",   unit: "°C",  factor: 0.1 },
};

function updateModbusFromSession(session) {
  const voltageRaw   = Math.round((220 + Math.random() * 5) / 0.1);
  const currentRaw   = Math.round((session.power * 1000 / 220) / 0.1);
  const powerRaw     = Math.round(session.power * 1000);
  const energyRaw    = Math.round((session.elapsedMinutes / 60) * session.power * 1000);

  modbusRegisters[0x0001].value = voltageRaw;
  modbusRegisters[0x0002].value = currentRaw;
  modbusRegisters[0x0003].value = powerRaw;
  modbusRegisters[0x0004].value = energyRaw;
}
```

UI: painel lateral com log OCPP rolando + tabela de registros MODBUS.

**Estruturas DSA:** `Queue`, array de frames, objeto registro

---

### Critério 5 — Estrutura lógica (0–10 pts)
**Meta: nota máxima (9–10)**

Separação clara de responsabilidades:
```
js/core/constants.js        → PLANS, GRID_CAPACITY_KW, MAX_STATIONS
js/core/helpers.js          → funções puras (formatCurrency, formatDuration)
js/core/tariff.js           → calcPricePerKwh, tariffRules
js/core/queue.js            → classe Queue (FIFO)
js/core/session-manager.js  → activeSessions (Map), throttling, startSession, stopSession
js/core/ocpp.js             → OCPPMessageBus, messageLog
js/core/modbus.js           → modbusRegisters, updateFromSession
js/core/state.js            → wallet, sessionHistory, tick global
components/*/               → renderização e eventos — sem lógica de negócio
```

**Regra:** nenhum arquivo em `components/` deve conter lógica de negócio.  
Componentes só chamam funções de `js/core/` e manipulam o DOM.

---

### Critério 6 — Menu e fluxo interativo (0–10 pts)
**Meta: nota máxima (9–10)**

Fluxo completo:
1. Sidebar: Dashboard / Sessões / Carteira / Protocolo
2. Painel de Sessões: grid de cards por estação (A, B, C, D) com status (Livre / Carregando / Falha)
3. Clicar em estação livre → modal de configuração (veículo, plano, % bateria inicial)
4. Confirmar → dispara `ocppBus.send("BootNotification")` → `Authorize` → `StartTransaction`
5. Card entra em modo ativo com contador, potência alocada, tarifa efetiva
6. Botão Encerrar → `StopTransaction` → card volta a Livre → relatório da sessão
7. Fila de espera visível se todas as 4 estações estiverem ocupadas

---

### Critério 7 — Qualidade e robustez (0–10 pts)
**Meta: nota máxima (9–10)**

- Persistir `sessionHistory` e `wallet` no `localStorage`
- Validar todos os campos numéricos com `Number.isFinite()`
- Corrigir bug da Sprint 1: `window.location.href = "index.html"` em `home.js:2` e `auth.js:76/133` → arquivo deletado
- Tick global único (`setInterval` de 1s) iterando sobre `activeSessions` — sem timers individuais por sessão
- Sem vazamento de `intervalId` ao encerrar sessões

---

## Objetivo visual da Sprint 2

Na tela principal, ao mesmo tempo:
1. **Grid de estações** — 4 cards (A/B/C/D) com status em tempo real
2. **Barra de demanda** — total ativo vs. capacidade da grade, com throttling visível
3. **Breakdown de tarifa** — `base × horário × demanda × tipo = efetivo` por sessão
4. **Log OCPP** — mensagens rolando em tempo real (StartTransaction, MeterValues, StopTransaction)
5. **Registros MODBUS** — tabela com valores atualizados a cada tick
6. **Fila de espera** — visível quando todas as estações estão ocupadas

---

## Convenções gerais

### Idioma
- **Todo código em inglês** — variáveis, funções, classes, comentários, nomes de arquivo
- **Interface do usuário em pt-BR** — labels, botões, títulos, mensagens, placeholders, textos de status
- Exemplo:
  ```js
  // ✅ correto
  function calcTotalActivePower() { ... }     // código: inglês
  button.textContent = "Iniciar Recarga";     // UI: pt-BR

  // ❌ errado
  function calcularPotenciaTotal() { ... }    // código em português
  button.textContent = "Start Charging";      // UI em inglês
  ```

### Técnicas
- JS puro, ES6 nativo — sem frameworks, sem bundler
- Comunicação entre arquivos via variáveis globais no `window`
- Sem `import`/`export` — arquivos carregados via `<script>` em sequência
- IDs de plano: exatamente `"basic"`, `"plus"`, `"ultra"` (string lowercase)
- Datas: `new Date()` nativo — sem bibliotecas externas

### Ordem de carregamento em `index.html`
```html
<!-- Base CSS -->
<link rel="stylesheet" href="css/base/tokens.css">
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/animations.css">

<!-- Component CSS -->
<link rel="stylesheet" href="components/sidebar/sidebar.css">
<link rel="stylesheet" href="components/station-card/station-card.css">
<!-- ... demais componentes ... -->

<!-- Core JS (lógica de negócio — sem DOM) -->
<script src="js/core/constants.js"></script>
<script src="js/core/helpers.js"></script>
<script src="js/core/queue.js"></script>
<script src="js/core/tariff.js"></script>
<script src="js/core/ocpp.js"></script>
<script src="js/core/modbus.js"></script>
<script src="js/core/session-manager.js"></script>
<script src="js/core/state.js"></script>

<!-- Component JS (DOM + eventos — carregam por último) -->
<script src="components/sidebar/sidebar.js"></script>
<script src="components/station-card/station-card.js"></script>
<!-- ... demais componentes ... -->
```