# Objetivos Específicos — Sprint 1

> Projeto: Chatbot com IA para GoodWe EV Challenge  

---

## Objetivo 1 — Compreender o Problema Central

O desafio da GoodWe não é apenas instalar carregadores — é tornar os eletropostos **operacionalmente inteligentes**. Dois contextos distintos foram identificados:

### ChargeGrid Intelligence (Operação Comercial)
Eletropostos públicos ou semipúblicos (shoppings, estacionamentos, frotas) carecem de mecanismos integrados para:
- **Orquestrar potência** entre múltiplos carregadores ativos sem sobrecarregar o ramal elétrico
- **Registrar ciclos** de carga com rastreabilidade (início, fim, kWh consumido, identificação do veículo)
- **Faturar** o uso de forma automatizada e auditável por sessão ou por cliente
- **Comunicar** falhas, alertas e status em tempo real ao operador e ao usuário final

### EV ChargeOps (Gestão em Condomínios)
Condomínios residenciais enfrentam problemas específicos de uso compartilhado:
- Rateio justo do consumo entre moradores que compartilham infraestrutura elétrica
- Controle de acesso por unidade (quem pode carregar, quando e com qual prioridade)
- Transparência no faturamento individualizado por morador
- Comunicação com síndico e administradora sem demandar presença técnica

**Gap identificado:** a GoodWe possui hardware competitivo (HCA, HCA G2), mas o ecossistema de software de gestão operacional ainda não cobre esses cenários de forma integrada e acessível. O chatbot entra como camada de inteligência e interface sobre esses gaps.

---

## Objetivo 2 — Escopo do Chatbot

### Personas Atendidas

| Persona | Contexto | Necessidade Principal |
|---|---|---|
| **Operador Comercial** | Gerencia eletroposto em estacionamento ou frota | Monitorar sessões, entender faturamento, resolver falhas |
| **Síndico** | Administra condomínio com carregadores compartilhados | Configurar regras de rateio, gerar relatórios por unidade |
| **Morador** | Usuário final do carregador no condomínio | Saber status do carregador, histórico de uso e custo |
| **Técnico / Instalador** | Integrador GoodWe | Dimensionamento, configuração SEMS, troubleshooting |

### Perguntas que o Chatbot Deve Responder

**Operador Comercial:**
- Quantas sessões foram realizadas hoje e qual o kWh total consumido?
- O carregador X está online? Por que está com falha?
- Como configurar um preço por kWh para faturamento?

**Síndico:**
- Como dividir o custo de energia entre os moradores que usaram o carregador este mês?
- Como bloquear o acesso ao carregador fora do horário permitido?
- Qual morador mais usou o carregador em abril?

**Morador:**
- Meu carregador está disponível agora?
- Quanto gastei em kWh este mês?
- Posso agendar um horário de carga para esta noite?

**Técnico / Instalador:**
- Qual carregador GoodWe é indicado para um condomínio trifásico com 8 vagas?
- Como integrar o HCA G2 ao SEMS+ e configurar o modo solar?
- O erro E-04 no HCA significa o quê e como resolver?

### Contexto Injetado no Modelo (System Prompt)

O chatbot receberá no contexto:
- Perfil da persona identificada na abertura da conversa
- Dados do eletroposto vinculado ao usuário (via SEMS API ou mock)
- Base de conhecimento GoodWe (manuais, tabela de produtos, FAQ técnico)
- Histórico da sessão atual (últimas N mensagens)

---

## Objetivo 3 — Tecnologias de IA Selecionadas e Justificativa

### LLM Principal: **Claude (Anthropic) — `claude-sonnet-4-20250514`**

**Justificativa:**
- Excelente desempenho em tarefas de raciocínio técnico e resposta contextualizada
- Janela de contexto longa (permite injetar base de conhecimento e histórico sem truncar)
- API estável com suporte a system prompt estruturado por persona
- Custo-benefício adequado para volume de uso esperado em MVP

### Orquestração: **LangChain (Python)**

**Justificativa:**
- Facilita a construção de cadeias de raciocínio (chains) e recuperação de contexto (RAG)
- Integração nativa com bases de documentos (PDF de manuais GoodWe, FAQ)
- Abstrações prontas para memória de conversa, tool calling e roteamento por persona

### Recuperação de Conhecimento: **RAG com ChromaDB**

**Justificativa:**
- Permite indexar a documentação técnica da GoodWe (manuais HCA, guias SEMS)
- Respostas fundamentadas em documentos reais, reduzindo alucinações
- Leve e fácil de rodar localmente para prototipagem na Sprint 1

### Interface: **WhatsApp Business API (via Twilio)** + fallback **Web Chat (React)**

**Justificativa:**
- WhatsApp é o canal dominante no Brasil para comunicação B2C e B2B
- Síndicos e moradores já usam o app — zero fricção de adoção
- Twilio oferece sandbox gratuito para testes sem aprovação Meta

### Stack Completo

```
LLM:            Claude Sonnet (Anthropic API)
Orquestração:   LangChain (Python)
Vetorização:    ChromaDB + HuggingFace Embeddings
Backend:        FastAPI (Python)
Interface:      WhatsApp (Twilio) + Web Chat (React)
Deploy (MVP):   Railway ou Render (gratuito para prototipagem)
Dados mock:     JSON estático simulando retorno da SEMS API
```

---

## Objetivo 4 — Fluxograma do Chatbot

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO ENVIA MENSAGEM                │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Identificação de     │
              │  Persona              │
              │  (primeira interação) │
              └───────────┬───────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    Operador        Síndico /        Técnico /
    Comercial        Morador         Instalador
          │               │               │
          └───────────────┼───────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Roteador de Intent  │
              │  (LangChain Router)   │
              └───────────┬───────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
     Consulta         Consulta       Consulta
     Operacional      de Rateio      Técnica
     (sessões,        (condomínio,   (produto,
      faturamento)     moradores)     SEMS, erro)
           │              │              │
           └──────────────┼──────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Recuperação RAG      │
              │  (se necessário)      │
              │  Busca em manuais     │
              │  e base de FAQ        │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Montagem do Prompt   │
              │  System + Persona +   │
              │  Contexto + Histórico │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Claude API          │
              │   (LLM inference)     │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Resposta gerada      │
              │  + ação opcional      │
              │  (registrar lead,     │
              │   escalar p/ humano)  │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Entregue ao usuário  │
              │  (WhatsApp / Web)     │
              └───────────────────────┘
```

**Regra de escalonamento:** se o chatbot não atingir confiança suficiente na resposta (fallback de intent), ou se o usuário pedir explicitamente, a conversa é transferida para atendimento humano com histórico completo.

---

## Objetivo 5 — Modelo de Teste (Base para Sprint 2)

Conjunto mínimo de 5 pares pergunta/resposta ideal, cobrindo as principais personas e cenários. Servirá como golden set de avaliação qualitativa.

---

### Teste 1 — Persona: Operador Comercial

**Pergunta:**
> "Quantas sessões de carga foram realizadas hoje no meu eletroposto e qual foi o consumo total em kWh?"

**Resposta Ideal:**
> "Hoje foram registradas **12 sessões** no seu eletroposto. O consumo total foi de **87,4 kWh**, com duração média de 1h23min por sessão. O horário de maior uso foi entre 12h e 14h (4 sessões). Quer ver o detalhamento por sessão ou o relatório do mês?"

**Critério de avaliação:** resposta usa dados do contexto injetado (mock SEMS), apresenta agregações corretas e oferece próximo passo.

---

### Teste 2 — Persona: Síndico

**Pergunta:**
> "Como faço para dividir o custo da energia entre os moradores que usaram o carregador em abril?"

**Resposta Ideal:**
> "Para o rateio de abril, o sistema registrou uso de **3 unidades**: Apto 42 (34,2 kWh), Apto 87 (21,0 kWh) e Apto 15 (12,8 kWh) — total de 68 kWh. Com a tarifa de R$ 0,95/kWh, os valores são:
> - Apto 42: **R$ 32,49**
> - Apto 87: **R$ 19,95**
> - Apto 15: **R$ 12,16**
>
> Posso gerar o relatório em PDF para enviar à administradora, se quiser."

**Critério de avaliação:** cálculo correto com base nos dados do contexto, apresentação clara e oferta de ação concreta.

---

### Teste 3 — Persona: Morador

**Pergunta:**
> "O carregador da vaga 12 está disponível agora?"

**Resposta Ideal:**
> "Sim, o carregador da vaga 12 está **disponível e online** neste momento. Potência disponível: 7 kW. Você pode iniciar a carga agora ou agendar para um horário específico. Quer que eu agende para você?"

**Critério de avaliação:** resposta direta com status correto do mock, sem informações desnecessárias, com oferta de ação.

---

### Teste 4 — Persona: Técnico / Instalador

**Pergunta:**
> "O carregador HCA G2 está mostrando o erro E-04. O que significa e como resolver?"

**Resposta Ideal:**
> "O erro **E-04** no HCA G2 indica **falha de comunicação com o inversor** (link SEMS perdido). Passos para resolução:
> 1. Verifique se o cabo de comunicação RS485 entre o HCA G2 e o inversor está bem conectado.
> 2. Reinicie o carregador pelo botão traseiro (segure por 5s).
> 3. No SEMS+, vá em *Dispositivos > HCA G2 > Diagnóstico* e force uma nova sincronização.
> 4. Se o erro persistir após 10 minutos, pode indicar falha no módulo de comunicação — abra um chamado técnico.
>
> Precisa do manual completo de troubleshooting do HCA G2?"

**Critério de avaliação:** resposta baseada na base de conhecimento RAG (manual HCA G2), passos ordenados e claros, oferta de recurso adicional.

---

### Teste 5 — Persona: Operador Comercial (faturamento)

**Pergunta:**
> "Como configuro o preço por kWh para cobrar dos clientes que usam o eletroposto?"

**Resposta Ideal:**
> "Para configurar o preço por kWh no seu eletroposto GoodWe, siga estes passos no SEMS+:
> 1. Acesse *Configurações > Eletroposto > Tarifação*.
> 2. Selecione o carregador desejado e clique em *Editar tarifa*.
> 3. Defina o valor em R$/kWh (ex: R$ 1,20) e o período de vigência.
> 4. Opcionalmente, configure tarifas diferenciadas por horário (ponta/fora ponta).
> 5. Salve e aguarde a sincronização (~2 minutos).
>
> A cobrança será registrada automaticamente a cada sessão encerrada. Quer que eu te mostre como exportar o relatório de faturamento mensal?"

**Critério de avaliação:** instruções passo a passo corretas com base na documentação SEMS, linguagem acessível para perfil não-técnico.

---

## Resumo dos Entregáveis da Sprint 1

| # | Objetivo | Status |
|---|---|---|
| 1 | Problema central compreendido e documentado | ✅ |
| 2 | Escopo do chatbot definido (personas, perguntas, contexto) | ✅ |
| 3 | Tecnologias selecionadas e justificadas | ✅ |
| 4 | Fluxograma do funcionamento elaborado | ✅ |
| 5 | Modelo de teste com 5 pares Q&A criado | ✅ |
