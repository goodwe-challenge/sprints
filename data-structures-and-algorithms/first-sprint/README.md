# Thunderbolt — Simulador de Recarga GoodWe

Aplicação frontend para simular sessões de recarga de veículos elétricos com dashboard de impacto ambiental, carteira virtual e histórico de recargas.

---

## Como a tarifa é calculada

A tarifa base de cada plano é cobrada por kWh consumido. Dois fatores podem ajustar esse valor antes do cálculo final do custo.

Se a sessão for iniciada entre 18h e 22h (horário de pico), a tarifa base é multiplicada por 1,30, acrescentando 30% ao preço. Fora desse horário, a tarifa base é usada diretamente.

Se o usuário tiver o perfil Premium, um desconto de 15% é aplicado sobre o valor já ajustado pelo horário. Isso significa que o pico e o desconto se combinam: em horário de pico com perfil premium, o usuário paga 1,30 × 0,85 = 1,105 vezes a tarifa base.

O custo total de uma sessão é o resultado de: energia carregada em kWh multiplicada pela tarifa efetiva.

---

## Estruturas de dados usadas

O projeto usa JavaScript puro sem frameworks, então as estruturas de dados são as nativas da linguagem.

Arrays armazenam o histórico de sessões e as transações da carteira. Cada elemento é um objeto com as propriedades da sessão ou da transação. Escolhi arrays porque os dados são ordenados por tempo de inserção, é necessário percorrer todos os itens para calcular totais, e o método unshift insere sempre no início para manter a ordem cronológica inversa.

Objetos literais representam o estado ativo de uma sessão em andamento, o estado da carteira e as configurações de tarifas. São usados porque cada dado tem um nome semântico e o acesso é feito por chave, não por índice.

Variáveis de estado simples como sessionHistory, wallet e activeSession ficam no escopo global do módulo app.js, acessíveis pelos demais arquivos. Isso evita passar dados entre funções desnecessariamente e reflete o padrão de estado centralizado sem biblioteca de gerenciamento de estado.

---

## Dashboard de impacto ambiental

O gráfico de pegada de carbono mostra quanto CO₂ foi economizado ao carregar com energia elétrica em vez de dirigir com gasolina.

O número base é 1,18 kg de CO₂ por kWh carregado. Esse valor representa a diferença entre as emissões de um carro a gasolina (210 g por km) e as emissões do sistema elétrico brasileiro (que são menores, resultando em 12 g por km para o EV). Para cada kWh entregue à bateria, o sistema calcula a autonomia gerada (6 km por kWh) e quanto CO₂ deixou de ser emitido em comparação com a gasolina.

A meta da árvore é 21 kg de CO₂, que equivale ao quanto uma árvore adulta absorve em um ano. O anel circular no dashboard mostra o progresso em direção a essa meta. Quando o usuário atinge 21 kg economizados, uma mensagem de celebração aparece.

Os km limpos mostram quantos quilômetros o veículo poderia rodar com a energia carregada sem emitir CO₂ direto. Os dias de absorção mostram o equivalente em quanto tempo uma árvore levaria para absorver o mesmo volume de CO₂ economizado.

---

## Planos e tarifas

Existem três planos com preço mensal fixo e tarifa por kWh decrescente. Quanto mais caro o plano, menor o custo por kWh, o que beneficia usuários que carregam com frequência.

O plano Básico custa R$ 49 por mês e tem tarifa de R$ 1,40 por kWh. É o plano de entrada, com carregador de 3,7 kW, indicado para quem carrega à noite em casa com baixo consumo mensal.

O plano Plus custa R$ 89 por mês e tem tarifa de R$ 1,10 por kWh. Com carregador de 7,4 kW, é o mais equilibrado entre velocidade de carga e custo por sessão.

O plano Ultra custa R$ 139 por mês e tem tarifa de R$ 0,80 por kWh. Com carregador trifásico de 22 kW, oferece a recarga mais rápida e o menor custo por kWh, ideal para quem usa o veículo intensamente.

O desconto do plano não é aplicado automaticamente apenas por ter o plano mais caro. A tarifa já embutida no plano é o benefício: quem escolhe o Ultra paga menos por kWh em todas as sessões, com ou sem horário de pico.
