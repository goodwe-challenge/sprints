# ⚡ Thunderbolt — Sistema Inteligente de Gestão de Eletropostos

**EV Challenge 2026 · GoodWe × FIAP**  
Sprint 1 — Apresentação do Projeto Sustentável

---

## Equipe

| Nome | RM |
|------|----|
| [Nome do integrante 1] | RM-XXXXX |
| [Nome do integrante 2] | RM-XXXXX |
| [Nome do integrante 3] | RM-XXXXX |
| [Nome do integrante 4] | RM-XXXXX |

---

## Problema

O Brasil registrou crescimento de **+146% nos emplacamentos de veículos elétricos em março de 2026** em relação ao mesmo período do ano anterior (ABVE, 2026). Esse crescimento expõe uma lacuna crítica: eletropostos comerciais como o **GoodWe HCA G2** operam sem inteligência de gestão.

Na prática, isso significa:

- Múltiplos veículos carregando simultaneamente geram picos de consumo que encarecem a conta de energia e sobrecarregam a rede
- Não há rastreabilidade de uso — o operador não sabe quem carrega, quanto consome e quanto isso custa
- Não há feedback de sustentabilidade — o usuário não enxerga o impacto positivo da sua escolha pelo elétrico
- Sem sistema de cobrança, o benefício do eletroposto comercial vira prejuízo para o operador

O resultado é um hardware de alta qualidade — o GoodWe HCA G2 — operando sem o ecossistema de software que o tornaria verdadeiramente viável em escala comercial.

---

## Justificativa

A GoodWe já resolve a geração de energia limpa: seus inversores solares convertem energia fotovoltaica para alimentar desde residências até eletropostos. O elo que falta é a **inteligência que conecta geração, consumo e impacto ambiental em tempo real**.

Nossa solução se apoia em três princípios de sustentabilidade:

**Eficiência no uso de energia renovável**
A energia gerada por painéis solares tem janela de maior disponibilidade no horário solar. Um sistema inteligente prioriza a recarga dos veículos nesse período, maximizando o uso de energia limpa e reduzindo a dependência da rede convencional.

**Redução e mensuração de emissões de CO₂**
Cada kWh carregado com energia elétrica substitui combustível fóssil. Quantificar essa diferença em tempo real é um instrumento de conscientização ambiental e de engajamento do usuário — tornando visível o impacto de uma escolha que normalmente permanece abstrata.

**Redução de desperdício energético**
O controle inteligente de demanda evita picos simultâneos de consumo. Isso reduz a necessidade de acionamento de usinas termoelétricas de ponta — que operam com combustível fóssil — para cobrir esses picos na rede.

---

## Proposta de Solução

O **Thunderbolt** é uma plataforma de gestão inteligente de eletropostos que transforma o hardware GoodWe HCA G2 em um ecossistema completo de recarga comercial, composto por quatro módulos:

**Controle de demanda energética**
Distribui a carga entre múltiplos veículos para evitar picos simultâneos de consumo, protegendo tanto a rede elétrica quanto o operador de custos desnecessários.

**Autenticação por usuário**
Identificação via RFID — recurso já integrado ao GoodWe HCA G2 — para rastrear sessões individuais, viabilizando cobrança por usuário ou por unidade habitacional.

**Cobrança automática**
Cálculo e registro do consumo por sessão com aplicação dinâmica de tarifas (horário de pico e fora de pico), gerando transparência para o operador e para o usuário.

**Dashboard de Impacto Ambiental**
Módulo central da nossa proposta: traduz dados técnicos de consumo em métricas de sustentabilidade compreensíveis, exibidas em tempo real para o usuário.

---

## Dashboard de Impacto Ambiental — Metodologia

O Dashboard de Impacto Ambiental é o diferencial da plataforma Thunderbolt. Ele responde à pergunta que todo usuário de veículo elétrico deveria poder fazer: **"quanto bem eu estou fazendo ao carregar aqui?"**

### Base de cálculo

Os cálculos foram implementados diretamente no sistema e operam sobre o total de energia entregue em todas as sessões do usuário:

```
CO₂ economizado (kg)  = total de kWh carregados × 1,18
Km limpos             = total de kWh carregados × 6
Dias de absorção      = CO₂ economizado ÷ (21 ÷ 365)
```

| Parâmetro | Valor | Base |
|-----------|-------|------|
| CO₂ economizado por kWh carregado | **1,18 kg** | Diferença entre emissão do carro a gasolina (210 g/km) e do sistema elétrico brasileiro (12 g/km para EV), multiplicada pela autonomia média de 6 km/kWh |
| Autonomia média do EV | **6 km / kWh** | Média do segmento de veículos elétricos compactos e médios |
| Meta da árvore | **21 kg CO₂ / ano** | Média de absorção anual de uma árvore adulta |

### Exemplo prático

Uma carga de **40 kWh** gera:
- **47,2 kg de CO₂** que deixaram de ser emitidos
- **240 km** rodados sem emissão direta
- Equivalente a **820 dias** de absorção de uma árvore adulta

### Meta da árvore

O sistema acompanha o progresso acumulado do usuário em direção a **21 kg de CO₂ economizados** — o equivalente ao que uma árvore adulta absorve em um ano. Um anel de progresso circular exibe a meta em percentual. Ao atingi-la, o sistema exibe uma mensagem de celebração informando quantas árvores o usuário já equivale por ano — criando um ciclo de engajamento positivo e contínuo com a mobilidade elétrica.

### Por que isso importa

Pesquisas em comportamento ambiental indicam que pessoas que visualizam o impacto positivo das suas ações tendem a mantê-las e ampliá-las. Ao tornar visível o CO₂ economizado, os km limpos e a equivalência em árvores, o dashboard vai além da tecnologia: ele **cria engajamento real com a causa da mobilidade sustentável**.

---

## Tecnologias Utilizadas

| Tecnologia | Aplicação | Justificativa sustentável |
|------------|-----------|--------------------------|
| **GoodWe HCA G2** | Hardware de recarga | RFID integrado viabiliza autenticação sem novos dispositivos |
| **GoodWe SEMS Portal** | Monitoramento de geração solar | Integração nativa com dados de energia renovável em tempo real |
| **JavaScript** | Lógica do dashboard e cálculos de CO₂ | Frontend leve, sem dependências de alto consumo computacional |
| **HTML / CSS** | Interface do usuário | Sem frameworks pesados — menor custo energético de processamento |
| **RFID (integrado HCA G2)** | Autenticação de sessões | Reuso de hardware existente — sem necessidade de novos dispositivos |

---

## Impactos Esperados

### Impacto ambiental

| Escala | CO₂ economizado / ano | Equivalência |
|--------|----------------------|--------------|
| 1 eletroposto (20 kWh/dia de uso médio) | ≈ 8.614 kg CO₂ | ≈ 410 árvores adultas |
| 10 eletropostos | ≈ 86.140 kg CO₂ | ≈ 4.100 árvores adultas |
| 100 eletropostos | ≈ 861.400 kg CO₂ | ≈ 41.000 árvores adultas |

> Cálculo: 20 kWh/dia × 365 dias × 1,18 kg CO₂/kWh = 8.614 kg/ano por ponto

### Impacto de negócio

O software resolve as quatro principais objeções do gestor comercial ao instalar um eletroposto: quem usa, quanto consome, como cobrar e se a rede aguenta. Ao eliminar essas barreiras, a plataforma Thunderbolt transforma o primeiro carregador instalado no primeiro de muitos — criando um modelo de expansão natural baseado em dados e confiança.

---

## Relação com Energias Renováveis e Sustentabilidade

O projeto Thunderbolt foi concebido dentro do ecossistema GoodWe, que integra geração solar e mobilidade elétrica. Nossa plataforma potencializa essa integração em três dimensões:

**Geração + consumo inteligente:** ao priorizar recargas no horário de maior geração solar, maximizamos o aproveitamento da energia fotovoltaica e reduzimos a dependência de energia da rede convencional.

**Mensuração de impacto:** a metodologia de cálculo de CO₂ implementada no dashboard transforma cada kWh carregado em uma métrica de sustentabilidade — conectando o usuário ao impacto real da sua escolha.

**Escala sem novos recursos:** a solução é baseada inteiramente em software. Cada eletroposto GoodWe já instalado pode ser integrado à plataforma sem novos equipamentos, tornando o impacto ambiental escalável sem aumento proporcional de recursos materiais.

---

> **Thunderbolt × GoodWe — EV Challenge 2026 · FIAP**  
> *A GoodWe tem o melhor hardware do mercado. Nós somos a inteligência que faz ele gerar impacto real.*
