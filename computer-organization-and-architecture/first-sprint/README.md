#  EV Charge Optimizer — Eficiência Computacional em Eletropostos

> Sprint 1 — Arquitetura de Computadores | FIAP × GoodWe EV Challenge 2026

---

##  Integrantes

| Nome | RM |
|---|---|
| Davi Ramos | 571744 |
| Lucas Malchior | 574027 |
| Gustavo Rocha | 570672 |
| Victor | 571099 |
| Timothée Campos Ferraz | 568688 |
| Gabriel Cavaloti | 571643 |

---

##  Problema

Eletropostos comerciais modernos processam operações críticas — leitura de sensores, autenticação de usuários, controle de carga e monitoramento de consumo — utilizando software de alto nível sobre hardware genérico. Essa abordagem introduz camadas desnecessárias de abstração que resultam em:

- Consumo energético elevado para tarefas de baixa complexidade computacional
- Maior número de ciclos de CPU por operação
- Dependência de hardware mais potente para suprir ineficiências do software
- Desperdício de recursos em sistemas que poderiam operar de forma embarcada e eficiente

Em um cenário onde a eficiência energética é o núcleo do produto (recarga de veículos elétricos com energia renovável), essa ineficiência computacional representa uma contradição direta com o objetivo de sustentabilidade.

---

##  Justificativa

A escolha do nível de abstração do software tem impacto direto no consumo energético do hardware. Um programa em C compilado com otimizações padrão pode gerar dezenas de instruções de máquina para operações que, escritas diretamente em Assembly, precisariam de apenas algumas. Cada instrução adicional representa ciclos de clock extras, o que se traduz em energia consumida.

No contexto de eletropostos que operam continuamente, 24 horas por dia, essa diferença acumulada tem impacto real na eficiência do sistema como um todo — e consequentemente no aproveitamento da energia renovável gerada.

---

##  Proposta de Solução

Realizar uma comparação técnica e prática entre implementações equivalentes em **C** e **Assembly x86** para operações típicas de um eletroposto, medindo e comparando:

- Número de instruções geradas
- Ciclos de CPU por operação
- Consumo estimado de energia por tarefa

As operações analisadas incluem:

1. **Leitura e validação de sensor** — simula leitura de tensão/corrente
2. **Autenticação de usuário** — comparação de token/ID
3. **Controle de carga** — lógica de ativação/desativação do carregador

A hipótese central é que **Assembly x86 reduz o número de instruções executadas**, resultando em menor consumo energético por operação — e que essa diferença, em sistemas embarcados de baixo consumo, é suficiente para justificar a otimização em nível de hardware.

---

##  Arquitetura Utilizada

**x86 (32/64-bit)**

- Arquitetura CISC (Complex Instruction Set Computer)
- Escolhida por ser a base de simuladores amplamente disponíveis e de fácil acesso para demonstração
- Permite comparação direta com código C compilado via GCC
- Possibilita análise do assembly gerado automaticamente pelo compilador vs. assembly otimizado manualmente

### Conceitos aplicados

| Conceito | Aplicação no projeto |
|---|---|
| Pipeline | Reordenamento de instruções para evitar stalls |
| Cache | Acesso sequencial à memória para melhor hit rate |
| Ciclos de clock | Métrica principal de comparação entre C e Assembly |
| Consumo por instrução | Base do argumento de eficiência energética |

---

##  Trechos de Código Assembly

### Comparação: validação de sensor em C vs x86 Assembly

**C (alto nível):**
```c
int validate_sensor(int value) {
    if (value >= 0 && value <= 100) {
        return 1;
    }
    return 0;
}
```

**Assembly x86 equivalente otimizado:**
```asm
; entrada: EAX = valor do sensor
; saída:   EAX = 1 (válido) ou 0 (inválido)

validate_sensor:
    xor     eax, eax        ; zera resultado
    cmp     edi, 0          ; valor >= 0?
    jl      .done           ; não: retorna 0
    cmp     edi, 100        ; valor <= 100?
    jg      .done           ; não: retorna 0
    inc     eax             ; válido: retorna 1
.done:
    ret
```

> A versão em Assembly elimina o frame de pilha desnecessário que o compilador C cria por padrão, reduzindo o número de instruções de ~12 para ~6.

---

### Comparação: autenticação de token (loop de comparação)

**C:**
```c
int authenticate(char *input, char *stored, int len) {
    for (int i = 0; i < len; i++) {
        if (input[i] != stored[i]) return 0;
    }
    return 1;
}
```

**Assembly x86 com `REPE CMPSB` (instrução de string otimizada):**
```asm
; ESI = ponteiro input, EDI = ponteiro stored, ECX = len
authenticate:
    repe cmpsb              ; compara bytes até divergência ou ECX = 0
    sete al                 ; AL = 1 se todos iguais
    movzx eax, al
    ret
```

> A instrução `REPE CMPSB` executa o loop inteiro em hardware, eliminando o overhead de branch e incremento de índice do loop em C.

---

##  Impactos Esperados

| Métrica | Código C | Assembly Otimizado | Redução Estimada |
|---|---|---|---|
| Instruções por operação de validação | ~12 | ~6 | ~50% |
| Instruções por autenticação (token 8 bytes) | ~40 | ~5 | ~87% |
| Ciclos de CPU (estimativa) | baseline | -40% a -60% | significativa |
| Consumo energético por sessão | baseline | proporcional à redução de ciclos | — |

> Os valores acima são estimativas baseadas na análise das instruções geradas. A medição real dependeria de profiling em hardware específico.

---

##  Relação com Sustentabilidade e Energias Renováveis

A proposta conecta eficiência computacional com sustentabilidade de forma direta:

1. **Menos ciclos de CPU = menos energia consumida pelo processador**
   Cada instrução eliminada é energia que não precisa ser gerada.

2. **Hardware mais simples e eficiente**
   Código otimizado em Assembly permite que microcontroladores de baixo consumo (como ARM Cortex-M ou RISC-V embarcado) substituam processadores mais potentes — reduzindo o consumo base do eletroposto.

3. **Maior aproveitamento da energia renovável**
   Eletropostos integrados à geração solar (ecossistema GoodWe) que consomem menos energia operacional aproveitam melhor cada kWh gerado pelos painéis — aumentando a eficiência do sistema como um todo.

4. **Escalabilidade sustentável**
   Uma rede de centenas de eletropostos com software otimizado representa uma redução agregada relevante no consumo energético da infraestrutura.

---

##  Repositório

[github.com/goodwe-challenge/sprints/tree/main/computer-organization-and-architecture/first-sprint](https://github.com/goodwe-challenge/sprints/tree/main/computer-organization-and-architecture/first-sprint)
