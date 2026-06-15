#  Thunderbolt — Simulador de Recarga GoodWe

Prova de Conceito (PoC) desenvolvida para simular sessões de recarga de veículos elétricos (VEs). O sistema atua como uma ferramenta visual e algorítmica para o **Gerenciamento Pelo Lado da Demanda (Demand-Side Management - DSM)**, incentivando a eficiência energética e mapeando o impacto ambiental direto da transição para a mobilidade elétrica.

---

##  Objetivos do Sistema (Sprint 2)

Este protótipo funcional valida a viabilidade técnica da aplicação de algoritmos de precificação dinâmica para influenciar o consumo de energia. O sistema foi projetado com foco em:
1. **Sustentabilidade (SERS):** Mitigar a sobrecarga do sistema elétrico nacional em horários de pico e quantificar a redução da pegada de carbono.
2. **Desempenho (DSA):** Utilizar estruturas de dados otimizadas para gerenciar e consolidar relatórios de múltiplas sessões de carregamento em tempo real.

---

##  Sustentabilidade e Eficiência Energética (SERS)

O Thunderbolt não é apenas um simulador financeiro; a arquitetura de tarifação foi desenvolvida com base em princípios de **Smart Grids** e **Energias Renováveis**:

* **Controle de Demanda via Tarifação Branca (Posto Horário):** Sessões iniciadas no horário de pico (18h às 22h) recebem um multiplicador de sobretaxa (+30%). A justificativa técnica é desincentivar o carregamento veicular quando a matriz elétrica depende do acionamento de usinas termelétricas de ponta (fósseis e poluentes). Ao deslocar a carga para horários fora de pico, o usuário maximiza o uso da geração de energia limpa de base (hidrelétrica e eólica).
* **Métricas de Impacto Ambiental e Pegada de Carbono:** O *Dashboard* calcula ativamente a economia de emissões do usuário. O fator de conversão de **1,18 kg de CO₂/kWh** foi estabelecido confrontando as emissões médias de veículos a combustão interna com a matriz elétrica brasileira. O sistema estipula uma meta visual de **21 kg de CO₂ evitados**, representando o equivalente à capacidade anual de absorção biológica de uma árvore típica, tangibilizando o impacto positivo para o usuário.

---

##  Arquitetura e Estruturas de Dados (DSA)

A solução foi construída utilizando JavaScript puro (Vanilla JS).

### Árvore de Arquitetura do Frontend
```text
    first-sprint/
    ├─ css/
    │  ├─ base/
    │  │  ├─ animations.css
    │  │  ├─ reset.css
    │  │  └─ tokens.css
    │  ├─ components/
    │  │  ├─ brand.css
    │  │  ├─ buttons.css
    │  │  ├─ cards.css
    │  │  ├─ forms.css
    │  │  └─ status.css
    │  ├─ features/
    │  │  ├─ auth.css
    │  │  ├─ carbon.css
    │  │  ├─ dashboard.css
    │  │  ├─ session.css
    │  │  └─ wallet.css
    │  ├─ layout/
    │  │  ├─ auth-shell.css
    │  │  ├─ background.css
    │  │  └─ home-shell.css
    │  └─ main.css
    ├─ js/
    │  ├─ app.js
    │  ├─ auth.js
    │  ├─ helpers.js
    │  └─ home.js
    ├─ home.html
    ├─ index.html
    └─ README.md
```
---

### Estruturas Utilizadas e Justificativa de Complexidade

- ***Arrays de Histórico Dinâmico (sessionHistory e wallet.transactions)***:
Usados para armazenar os registros consolidados de recarga e finanças. O algoritmo utiliza o método .unshift() para as inserções. Isso garante que a visualização seja mantida em ordem cronológica inversa (mais recentes primeiro) diretamente na estrutura de dados, simplificando a renderização na interface.

- ***Objetos Literais para Gerenciamento de Estado (activeSession, tariffRules)***:
Estruturas em formato de dicionário chave-valor (Hash Maps nativos do JS) para acesso à informação em tempo constante O(1). Isso elimina a necessidade de iterações custosas ao buscar os multiplicadores de tarifa e controlar os flags da sessão rodando no event loop.

- ***Consolidação de Relatórios via Iteração Linear***:
O cálculo estatístico total (como a energia total e custo) no Dashboard utiliza laços de repetição tradicionais com complexidade de tempo linear O(n), garantindo estabilidade e baixo consumo de memória no lado do cliente.

---

### Instruções de Uso da PoC
Para executar o protótipo funcional e visualizar a geração de relatórios operacionais:

1. Faça o clone do repositório:

```bash
git clone [https://github.com/goodwe-challenge/sprints.git](https://github.com/goodwe-challenge/sprints.git)
```

2. Navegue até a pasta da aplicação (Sprint 1 / Thunderbolt).

3. Como o projeto é baseado em frontend puro, basta abrir o arquivo index.html em qualquer navegador moderno.

4. Passo a passo para gerar dados:
    > - Crie uma conta (dados ficam armazenados no localStorage).
    > - No painel, adicione saldo na Carteira Virtual.
    > - Configure uma simulação: altere a Carga Inicial, Capacidade da Bateria e a Potência do Carregador.
    > - Modifique o Horário da sessão para testar as regras de tarifação dinâmica (horário de pico vs. fora de pico).
    > - Inicie a recarga. O sistema processará a simulação acelerada por setInterval e gerará o Relatório de Autonomia e Economia de CO₂ ao término ou pausa da sessão.
