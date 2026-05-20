import pandas as pd

# 1. Carregar a base de dados
try:
    df = pd.read_csv('ev_charging_patterns.csv')
except FileNotFoundError:
    print("\n[ERRO] O arquivo 'ev_charging_patterns.csv' não foi encontrado.")
    print("Certifique-se de que ele está na mesma pasta que este script.")
    exit()

# Ajuste da variável discreta (Idade do Veículo) para números inteiros
df['Vehicle Age (years)'] = df['Vehicle Age (years)'].round().astype(int)

# ==============================================================================
# PANEL DE ANÁLISE - CHALLENGE SPRINT 1 (GOODWE)
# ==============================================================================
print("\n" + "="*80)
print("   GOODWE CHARGING ANALYTICS - SPRINT 1 ".center(80))
print("="*80)

# --- ITEM 02-A: VARIÁVEL QUANTITATIVA DISCRETA ---
print("\n┌──────────────────────────────────────────────────────────────────────────────┐")
print("│ 02-a) TABELA DE FREQUÊNCIA: IDADE DO VEÍCULO (ANOS INTEIROS)                 │")
print("└──────────────────────────────────────────────────────────────────────────────┘")

# Cálculo da frequência absoluta e ordenação
tabela_discreta = df['Vehicle Age (years)'].value_counts().sort_index()

print(f"   {'Idade (Anos)':<20} | {'Frequência Absoluta (Contagem)':<30}")
print("   " + "-"*55)
for idade, contagem in tabela_discreta.items():
    print(f"   {idade:<20} | {contagem:<30}")
print("   " + "-"*55)
print(f"   Total de Observações: {tabela_discreta.sum()}")

# Insights obrigatórios com #
# Insight 1: # A frota analisada é majoritariamente nova (até 3 anos), o que indica um mercado de 'early adopters' altamente propício para a GoodWe.
# Insight 2: # O volume de veículos com 0 anos sugere um crescimento acelerado de vendas de EVs no último período, validando o momento do lançamento do hardware.


# --- ITEM 02-B: VARIÁVEL QUANTITATIVA CONTÍNUA ---
print("\n┌──────────────────────────────────────────────────────────────────────────────┐")
print("│ 02-b) TABELA DE FREQUÊNCIA: ENERGIA CONSUMIDA (KWH)                          │")
print("└──────────────────────────────────────────────────────────────────────────────┘")

# Criação das 5 faixas de consumo (bins)
faixas_energia = pd.cut(df['Energy Consumed (kWh)'], bins=5)
tabela_continua = faixas_energia.value_counts().sort_index()

print(f"   {'Intervalo de Consumo (kWh)':<25} | {'Frequência Absoluta (Contagem)':<30}")
print("   " + "-"*60)

#for para ler o dicionário de boa
for faixa, contagem in tabela_continua.items():
    # Formatando o texto da faixa para remover colchetes/parênteses e deixar mais bonitinho
    faixa_limpa = str(faixa).replace('(', '').replace(']', '').replace(',', ' a')
    print(f"   {faixa_limpa:<25} | {contagem:<30}")
print("   " + "-"*60)
print(f"   Total de Observações: {tabela_continua.sum()}")

# Insights obrigatórios com #
# Insight 1: # A maior frequência de recargas ocorre entre 30kWh e 60kWh, volume perfeitamente atendido por carregadores residenciais GoodWe de 7kW a 11kW em uma única noite.
# Insight 2: # Recargas que ultrapassam 120kWh são raras no ecossistema doméstico, provando que o foco da engenharia deve ser a eficiência em cargas médias diárias.

print("\n" + "="*80)
print("   FIM DA ANÁLISE TÉCNICA".center(80))
print("="*80 + "\n")