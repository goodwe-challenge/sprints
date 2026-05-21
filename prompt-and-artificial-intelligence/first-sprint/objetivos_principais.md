# Pesquisa: GoodWe + EV Challenge — Proposta de Chatbot com IA

> Documento gerado como parte do desafio proposto pela GoodWe na disciplina de IA.  

---

## 1. Sobre a GoodWe

A **GoodWe Technologies Co., Ltd.** é uma empresa chinesa fundada em 2010, reconhecida globalmente como fabricante de inversores solares, sistemas de armazenamento de energia e carregadores de veículos elétricos (EVs). Está presente em mais de 100 países, com mais de 100 GW de capacidade instalada no mundo.

No Brasil, a GoodWe tem presença relevante no setor de energia solar fotovoltaica e firmou parceria com a **FIAP** para a inauguração do laboratório **Energy Innovation**, voltado a capacitar profissionais e fomentar pesquisa no setor de energia solar.

### Linha de produtos EV da GoodWe

| Produto | Potência | Destaque |
|---|---|---|
| HCA Series | 7 kW (monofásico) | Integração com PV residencial |
| HCA G2 | 7–22 kW | Smart phase switching, SEMS+ |
| EV Charger US | 9,6 kW | Compatível com inversores ES-US e SBP-US |

**Diferenciais técnicos:**
- Compatível com todas as marcas de veículos elétricos
- Integração com a plataforma SEMS / SEMS+ (monitoramento e agendamento)
- Suporte a Wi-Fi, RS485 e LAN
- IP66 (resistente a água e poeira)
- Múltiplos modos: carga solar, carga da rede, modo agendado

---

## 2. O Problema Central: Distribuição e Rentabilidade dos Carregadores

A GoodWe enfrenta dois desafios principais no mercado de EV Chargers:

### 2.1 Distribuição Geográfica Desigual
- O Brasil possui hoje cerca de **16.880 eletropostos** (agosto/2025), sendo **77% do tipo AC (lento)** e apenas 23% DC rápido.
- A distribuição é altamente concentrada nas capitais e grandes centros — regiões do interior e rodovias de longa distância têm cobertura mínima.
- O país tem aproximadamente **1 carregador para cada 17 veículos elétricos**, criando gargalos de uso.
- 38% dos motoristas cogitam voltar a carros a combustão se a infraestrutura não evoluir.

### 2.2 Rentabilidade Baixa
- As tarifas de energia elétrica no Brasil são altas, o que encarece o custo operacional dos carregadores.
- O sistema tributário complexo reduz as margens nos modelos de negócio de recarga.
- Carregadores AC lentos (como os da GoodWe HCA) têm dificuldade de rentabilização no modelo público, sendo mais viáveis no modelo residencial/empresarial.
- A norma da Ligabom ainda gera instabilidade regulatória para instalações em edifícios residenciais e comerciais.

### 2.3 Barreiras de Adoção pelo Instalador / Revendedor
- Revendedores e integradores têm dificuldade de dimensionar corretamente o produto para cada perfil de cliente (residencial, corporativo, condomínio).
- O processo de qualificação e suporte técnico é fragmentado, dificultando a escala da rede de distribuição.
- A plataforma SEMS, apesar de robusta, demanda curva de aprendizado para novos instaladores.

---

## 3. Contexto do Desafio (EV Challenge — FIAP x GoodWe)

O desafio proposto pela GoodWe no contexto acadêmico parte do problema real enfrentado pela empresa: **como tornar a distribuição de carregadores EV mais rentável e acessível no Brasil**, considerando:

1. Mercado em expansão acelerada (projeção de 200 mil EVs vendidos em 2025, crescimento de 40%/ano)
2. Necessidade de escalar a rede de instaladores e revendedores
3. Carência de ferramentas de apoio à decisão para clientes finais e integradores
4. Baixa taxa de conversão no funil de vendas de soluções EV

---

## 4. Proposta Técnica: Chatbot com IA para a GoodWe

### 4.1 Objetivo

Desenvolver um **chatbot inteligente** capaz de:
- Auxiliar clientes finais (pessoa física / empresa) a identificar o melhor produto EV GoodWe para sua necessidade
- Apoiar instaladores e revendedores no dimensionamento técnico e comercial
- Automatizar o suporte de primeiro nível (FAQ, troubleshooting básico, status de pedidos)
- Gerar leads qualificados e direcionar ao canal de vendas correto

### 4.2 Problema que o Chatbot Resolve

| Problema | Como o chatbot atua |
|---|---|
| Cliente não sabe qual carregador comprar | Fluxo conversacional de qualificação (monofásico/trifásico, integração solar, etc.) |
| Instalador não sabe dimensionar o projeto | Assistente técnico com base de conhecimento GoodWe |
| Alto volume de suporte repetitivo (FAQ) | Resolução automatizada de dúvidas comuns |
| Baixa conversão no funil de vendas | Qualificação de leads e encaminhamento ao time comercial |
| Rentabilidade difícil de demonstrar | Simulador de payback e economia integrado ao chat |

### 4.3 Tecnologias Escolhidas

```
Stack proposto:

Frontend:     Interface web (React) ou WhatsApp Business API
LLM:          Claude (Anthropic) via API — claude-sonnet-4-20250514
Memória:      Histórico de conversa mantido no contexto (stateless com state passado)
Backend:      Node.js + Express (orquestração dos fluxos)
Base de dados: PostgreSQL (leads, sessões, histórico de atendimentos)
Integrações:  SEMS API (GoodWe) · CRM (ex: HubSpot) · WhatsApp via Twilio
Deploy:       AWS Lambda + API Gateway (serverless, custo sob demanda)
```

### 4.4 Fluxo de Funcionamento

```
Usuário inicia conversa
        │
        ▼
[Identificação de perfil]
  ├── Cliente final
  ├── Instalador / Revendedor
  └── Suporte técnico
        │
        ▼
[Fluxo específico por perfil]

── Cliente final:
   → Pergunta sobre tipo de imóvel, fase elétrica, se tem solar
   → Recomenda produto (HCA 7kW / HCA G2 / etc.)
   → Simula economia e payback
   → Coleta dados e encaminha ao canal de vendas

── Instalador:
   → Dimensionamento técnico assistido
   → Consulta à base de documentação GoodWe
   → Dúvidas sobre SEMS e integração

── Suporte técnico:
   → FAQ automatizado (erros comuns, configuração SEMS)
   → Escalonamento para suporte humano se necessário
        │
        ▼
[Registro no CRM + follow-up automatizado]
```

### 4.5 Modelo de Teste (QA)

| Tipo de Teste | Critério de Aceitação |
|---|---|
| **Teste de fluxo** | Todos os caminhos do fluxo conversacional cobertos sem dead ends |
| **Teste de recomendação** | Dado o perfil X, o chatbot recomenda o produto correto em ≥ 90% dos casos |
| **Teste de escalabilidade** | Suporta 100 conversas simultâneas sem degradação |
| **Teste de fallback** | Quando incerto, o chatbot escala corretamente para humano |
| **Teste de satisfação (CSAT)** | Avaliação pós-conversa ≥ 4/5 em amostra piloto |
| **Teste de integração** | Leads registrados corretamente no CRM em 100% dos casos |

### 4.6 Benefícios Esperados

- **Para a GoodWe:** escala no suporte e vendas sem aumento proporcional de equipe
- **Para o distribuidor/instalador:** menos fricção no processo comercial e técnico
- **Para o cliente final:** decisão de compra mais rápida e informada
- **Para a rentabilidade:** funil de vendas mais eficiente → mais conversões → mais receita por carregador instalado

---

## 5. Fontes e Referências

- [GoodWe HCA Series](https://en.goodwe.com/hca-series)
- [GoodWe HCA G2](https://en.goodwe.com/hca-g2)
- [GoodWe SEMS+](https://br.goodwe.com/semsplus-series-smart-energy-management-system)
- [GoodWe Brasil — Solfácil (Distribuidor Oficial)](https://solfacil.com.br/goodwe/)
- [Carros Elétricos no Brasil em 2025 — EletroBidu](https://blog.eletrobidu.com.br/)
- [Pontos de recarga crescem 59% — ClimaInfo](https://climainfo.org.br/2025/09/18/)
- [Mercado EV Brasil 2025–2026 — Carros Elétricos Brasil](https://carroseletricosbrasil.com/mercado-de-carros-eletricos-2025-2026/)
- [FIAP x GoodWe — Energy Innovation Lab](https://www.fiap.com.br/acontece/noticias/)
