"""Dados fictícios de Finanças, contabilidade e tesouraria, e cálculos de referência.
Tudo é inventado. Os números esperados dos exercícios saem daqui, para baterem certo com os ficheiros."""
import os
from openpyxl import Workbook
from comum import eur, sinal, pct, folha, NUM

# ---------- 1. Orçamento vs real (T3) ----------
# (rubrica, tipo, orc_jul, real_jul, orc_ago, real_ago, orc_set, real_set)
RUB = [
    ("Honorários facturados", "Receita", 410000, 398500, 415000, 421300, 420000, 372800),
    ("Outros proveitos", "Receita", 6000, 5200, 6000, 6900, 6000, 6100),
    ("Gastos com pessoal", "Custo", 268000, 268000, 268000, 271500, 268000, 268000),
    ("Rendas e condomínio", "Custo", 42000, 42000, 42000, 42000, 42000, 42000),
    ("Serviços externos", "Custo", 31000, 29400, 31000, 33800, 31000, 41200),
    ("Tecnologia e licenças", "Custo", 18500, 18500, 18500, 19200, 18500, 25300),
    ("Deslocações e formação", "Custo", 9000, 7100, 9000, 8300, 9000, 12600),
    ("Marketing e eventos", "Custo", 14000, 11200, 14000, 13100, 22000, 21400),
    ("Seguros", "Custo", 6500, 6500, 6500, 6500, 6500, 6500),
    ("Consultoria externa pontual", "Custo", 0, 0, 0, 0, 0, 4200),
]
ERRO_TOTAL = 250  # o total de custos reais de Setembro vem 250 acima da soma das linhas
NOTAS = [
    ("Serviços externos", "Set", "Auditoria externa pontual de sistemas, contratada em Setembro."),
    ("Marketing e eventos", "Set", "Evento anual de clientes realizado em Setembro (orçamentado em Setembro)."),
]
LIM_EUR, LIM_PCT = 2000, 10  # limiares dados no pedido: assinalar se |desvio| >= 2.000 € e >= 10 %


def desvios_set():
    out = []
    for r in RUB:
        rub, tipo, _, _, _, _, o, a = r
        d = a - o
        p = None if o == 0 else d / o * 100
        fav = (d >= 0) if tipo == "Receita" else (d <= 0)
        flag = abs(d) >= LIM_EUR and (p is None or abs(p) >= LIM_PCT)
        out.append(dict(rub=rub, tipo=tipo, orc=o, real=a, desv=d, pct=p, fav=fav, flag=flag))
    return out


def totais():
    t = {}
    for tipo in ("Receita", "Custo"):
        for m, (io, ia) in {"Jul": (2, 3), "Ago": (4, 5), "Set": (6, 7)}.items():
            t[(tipo, m, "orc")] = sum(r[io] for r in RUB if r[1] == tipo)
            t[(tipo, m, "real")] = sum(r[ia] for r in RUB if r[1] == tipo)
    return t


def acumulado():
    out = []
    for r in RUB:
        o = r[2] + r[4] + r[6]
        a = r[3] + r[5] + r[7]
        out.append((r[0], r[1], o, a, a - o))
    return out


def mat_orcamento(d):
    wb = Workbook()
    t = totais()
    linhas = [list(r) for r in RUB]
    for tipo, nome in (("Receita", "Total receitas"), ("Custo", "Total custos")):
        l = [nome, "Total"]
        for m in ("Jul", "Ago", "Set"):
            l.append(t[(tipo, m, "orc")])
            real = t[(tipo, m, "real")]
            if tipo == "Custo" and m == "Set":
                real += ERRO_TOTAL
            l.append(real)
        linhas.append(l)
    folha(wb, "Orçamento vs real", ["Rubrica", "Tipo", "Orç. Jul", "Real Jul", "Orç. Ago", "Real Ago", "Orç. Set", "Real Set"],
          linhas, [30, 10, 13, 13, 13, 13, 13, 13], {c: NUM for c in range(3, 9)}, primeira=True)
    folha(wb, "Notas da direcção", ["Rubrica", "Mês", "Nota"], NOTAS, [30, 8, 80])
    wb.save(os.path.join(d, "Fin_Orcamento_vs_Real_T3.xlsx"))


# ---------- 2. Reconciliação bancária ----------
SALDO_INI = 85400.00
# (data_banco, data_razao, descricao, entrada, saida, so_banco/so_razao/ambos)
REC = [
    ("01-09", "01-09", "Recebimento cliente Aurora", 18450.00, 0),
    ("02-09", "02-09", "Pagamento Cloud Norte", 0, 1476.00),
    ("03-09", "03-09", "Pagamento renda escritório", 0, 14000.00),
    ("05-09", "04-09", "Recebimento cliente Girassol", 9840.00, 0),
    ("08-09", "08-09", "Pagamento Papelaria Central", 0, 312.60),
    ("10-09", "10-09", "Pagamento prémio de seguro", 0, 6500.00),
    ("12-09", "12-09", "Recebimento cliente Vale", 7380.00, 0),
    ("15-09", "15-09", "Transferência de salários", 0, 61900.00),
    ("16-09", "16-09", "Pagamento Formação Norte", 0, 900.00),
    ("18-09", "18-09", "Recebimento cliente Campo Verde", 22140.00, 0),
    ("22-09", "22-09", "Pagamento Tech Suporte", 0, 2214.00),
    ("24-09", "24-09", "Recebimento cliente Rio Claro", 5535.00, 0),
    ("25-09", "25-09", "Reembolso de deslocação a colaborador", 0, 238.40),
    ("26-09", "26-09", "Pagamento Eventos Ponte", 0, 640.00),
]
TRANSPOSICAO = ("09-09", "Pagamento Limpezas Ribeira", 1250.00, 1520.00)  # banco, razão
SO_RAZAO = [("29-09", "Pagamento Serra Serviços (emitido, ainda não debitado)", 0, 3690.00),
            ("30-09", "Depósito de cheque do cliente Pinhal (ainda não creditado)", 12750.00, 0),
            ("26-09", "Pagamento Eventos Ponte (lançamento repetido)", 0, 640.00)]
SO_BANCO = [("30-09", "Comissões bancárias", 0, 33.45)]


def reconciliacao():
    be = sum(x[3] for x in REC) + 0
    bs = sum(x[4] for x in REC) + TRANSPOSICAO[2] + SO_BANCO[0][3]
    banco = SALDO_INI + be - bs
    re_ = be + sum(x[2] for x in SO_RAZAO)
    rs = sum(x[4] for x in REC) + TRANSPOSICAO[3] + sum(x[3] for x in SO_RAZAO)
    razao = SALDO_INI + re_ - rs
    banco_aj = banco + 12750.00 - 3690.00
    razao_aj = razao - 33.45 + (TRANSPOSICAO[3] - TRANSPOSICAO[2]) + 640.00
    return dict(banco=banco, razao=razao, banco_aj=banco_aj, razao_aj=razao_aj, dif=banco - razao)


def mat_banco(d):
    wb = Workbook()
    ext = []
    saldo = SALDO_INI
    linhas = [("31-08", "Saldo inicial", None, None, SALDO_INI)]
    itens = [(x[0], x[2], x[3], x[4]) for x in REC] + [(TRANSPOSICAO[0], TRANSPOSICAO[1], 0, TRANSPOSICAO[2])] + [(x[0], x[1], x[2], x[3]) for x in SO_BANCO]
    itens.sort(key=lambda i: i[0])
    for data, desc, e, s in itens:
        saldo = round(saldo + e - s, 2)
        linhas.append((data + "-2026", desc, e or None, s or None, saldo))
    linhas[0] = ("31-08-2026",) + linhas[0][1:]
    folha(wb, "Extracto bancário", ["Data", "Descrição", "Entradas", "Saídas", "Saldo"], linhas, [14, 58, 14, 14, 16], {3: NUM, 4: NUM, 5: NUM}, primeira=True)
    rz = [("31-08-2026", "", "Saldo inicial", None, None)]
    itens = [(x[1], x[2], x[3], x[4]) for x in REC] + [(TRANSPOSICAO[0], TRANSPOSICAO[1], 0, TRANSPOSICAO[3])] + [(x[0], x[1], x[2], x[3]) for x in SO_RAZAO]
    itens.sort(key=lambda i: i[0])
    for n, (data, desc, e, s) in enumerate(itens, start=1):
        rz.append((data + "-2026", f"BCO-{n:03d}", desc, e or None, s or None))
    ws = folha(wb, "Razão - Banco", ["Data", "Documento", "Descrição (conta Banco: débito = entrada; crédito = saída)", "Débito", "Crédito"], rz, [14, 12, 66, 14, 14], {4: NUM, 5: NUM})
    ws.append([])
    ws.append(["", "", "Saldo inicial da conta (débito)", SALDO_INI])
    ws.cell(row=ws.max_row, column=4).number_format = NUM
    wb.save(os.path.join(d, "Fin_Reconciliacao_Bancaria_Set.xlsx"))


# ---------- 3. Encomenda – recepção – factura ----------
ENC = [("PO-2301", "Papelaria Central", "Papel A4 (resmas)", 200, 3.90),
       ("PO-2302", "Cloud Norte", "Licenças colaborativas (utilizadores)", 40, 30.00),
       ("PO-2303", "Mobiliário Ribeira", "Cadeiras ergonómicas", 12, 205.00),
       ("PO-2304", "Limpezas Ribeira", "Serviço de limpeza de Setembro", 1, 1250.00),
       ("PO-2305", "Eventos Ponte", "Material para o evento anual", 50, 12.40),
       ("PO-2306", "Tech Suporte", "Monitores", 10, 245.00),
       ("PO-2307", "Papelaria Central", "Toners", 30, 55.00)]
REC3 = [("PO-2301", "03-09-2026", 200), ("PO-2302", "01-09-2026", 40), ("PO-2303", "10-09-2026", 12),
        ("PO-2304", "30-09-2026", 1), ("PO-2305", "20-09-2026", 40), ("PO-2306", "12-09-2026", 6),
        ("PO-2306", "19-09-2026", 4), ("PO-2307", "14-09-2026", 30)]
# (nº factura, fornecedor, PO, data, qtd, preço, taxa, iva_indicado)
FAT = [("F-1001", "Papelaria Central", "PO-2301", "04-09-2026", 200, 3.90, 23, None),
       ("F-1002", "Cloud Norte", "PO-2302", "02-09-2026", 40, 30.00, 23, None),
       ("F-1003", "Mobiliário Ribeira", "PO-2303", "11-09-2026", 12, 205.00, 23, None),
       ("F-1004", "Limpezas Ribeira", "PO-2304", "30-09-2026", 1, 1250.00, 23, None),
       ("F-1005", "Eventos Ponte", "PO-2305", "21-09-2026", 50, 12.40, 23, None),
       ("F-1006", "Tech Suporte", "PO-2306", "20-09-2026", 10, 249.00, 23, None),
       ("F-1007", "Serra Serviços", "", "27-09-2026", 1, 3000.00, 23, None),
       ("F-1008", "Papelaria Central", "PO-2307", "15-09-2026", 30, 55.00, 23, 369.50),
       ("F-1003", "Mobiliário Ribeira", "PO-2303", "28-09-2026", 12, 205.00, 23, None)]


def fat_linha(f):
    n, forn, po, data, q, p, tx, iva = f
    base = round(q * p, 2)
    iva_calc = round(base * tx / 100, 2)
    iva_ind = iva if iva is not None else iva_calc
    return n, forn, po, data, q, p, base, tx, iva_ind, round(base + iva_ind, 2), iva_calc


def mat_3vias(d):
    wb = Workbook()
    folha(wb, "Encomendas", ["Nº encomenda", "Fornecedor", "Descrição", "Qtd", "Preço unitário", "Total sem imposto"],
          [(a, b, c, q, p, round(q * p, 2)) for a, b, c, q, p in ENC], [14, 22, 40, 8, 14, 18], {5: NUM, 6: NUM}, primeira=True)
    folha(wb, "Recepções", ["Nº encomenda", "Data de recepção", "Qtd recebida"], REC3, [14, 18, 14])
    folha(wb, "Facturas", ["Nº factura", "Fornecedor", "Nº encomenda", "Data", "Qtd", "Preço unitário", "Base", "Taxa (%)", "Imposto indicado", "Total"],
          [fat_linha(f)[:10] for f in FAT], [12, 22, 14, 13, 8, 14, 13, 9, 16, 13], {6: NUM, 7: NUM, 9: NUM, 10: NUM})
    wb.save(os.path.join(d, "Fin_Encomenda_Recepcao_Factura.xlsx"))


# ---------- 4. Lançamentos ----------
PLANO = [("B100", "Banco", "Activo"), ("C100", "Clientes", "Activo"), ("C200", "Fornecedores", "Passivo"),
         ("T100", "Imposto indirecto a recuperar", "Activo"), ("T200", "Imposto indirecto a liquidar", "Passivo"),
         ("G100", "Rendas", "Gasto"), ("G110", "Serviços externos", "Gasto"), ("G120", "Tecnologia e licenças", "Gasto"),
         ("G130", "Deslocações", "Gasto"), ("G140", "Formação", "Gasto"), ("G150", "Material de escritório", "Gasto"),
         ("R100", "Honorários", "Rendimento"), ("X999", "Regularização (só com autorização do responsável)", "Transitória")]
# (nº, data, descrição, documento, base, imposto, total)
MOV = [("M01", "02-09-2026", "Licenças colaborativas Cloud Norte", "F-1002", 1200.00, 276.00, 1476.00),
       ("M02", "02-09-2026", "Pagamento a Cloud Norte", "Transferência", None, None, 1476.00),
       ("M03", "05-09-2026", "Honorários facturados ao cliente Girassol", "FT 880", 8000.00, 1840.00, 9840.00),
       ("M04", "05-09-2026", "Recebimento do cliente Girassol", "Transferência", None, None, 9840.00),
       ("M05", "08-09-2026", "Material de escritório, pago na hora (Papelaria Central)", "VD 4471", 254.15, 58.45, 312.60),
       ("M06", "12-09-2026", "Deslocação ao Porto, reembolso a colaborador", "", None, None, 238.40),
       ("M07", "15-09-2026", "Compra de 10 monitores (Tech Suporte)", "F-1006", 2450.00, 563.50, 3013.50),
       ("M08", "16-09-2026", "Formação da equipa (Formação Norte)", "F-0912", None, None, 900.00),
       ("M09", "20-09-2026", "Evento anual de clientes (Eventos Ponte)", "F-1005", 500.00, 115.00, 640.00),
       ("M10", "", "Pagamento a Tech Suporte", "Transferência", None, None, 2214.00),
       ("M11", "30-09-2026", "Comissões bancárias de Setembro", "Extracto", None, None, 33.45),
       ("M12", "30-09-2026", "Renda de Setembro, paga por transferência", "Recibo 09/26", None, None, 14000.00)]
LANC_OK = ["M01", "M02", "M03", "M04", "M05", "M12"]
LANC_PERGUNTAS = {"M06": "sem documento de suporte", "M07": "sem conta de activos no plano; capitalizar ou não é decisão do contabilista",
                  "M08": "falta saber se há imposto e quanto", "M09": "base + imposto = 615,00, mas o total é 640,00",
                  "M10": "sem data", "M11": "o plano não tem conta de serviços bancários"}


def mat_lancamentos(d):
    wb = Workbook()
    folha(wb, "Plano de contas (fictício)", ["Código", "Conta", "Natureza"], PLANO, [10, 54, 14], primeira=True)
    folha(wb, "Movimentos a lançar", ["Nº", "Data", "Descrição", "Documento", "Base", "Imposto", "Total"], MOV, [7, 13, 56, 15, 12, 12, 12], {5: NUM, 6: NUM, 7: NUM})
    wb.save(os.path.join(d, "Fin_Lancamentos_a_propor.xlsx"))


# ---------- 5. Previsão de tesouraria ----------
SALDO_PREV, MINIMO = 140000.00, 60000.00
# (cliente, valor, semana, data factura, prazo, nota)
RECB = [("Aurora", 45000, 2, "Semana -2", 30, ""), ("Girassol", 22000, 3, "Semana -1", 30, ""),
        ("Ponte Nova", 28000, 4, "Semana 3", 60, "Previsto antes do fim do prazo contratual"),
        ("Vale", 30000, 5, "Semana 1", 30, ""), ("Campo Verde", 52000, 6, "Semana 2", 30, ""),
        ("Rio Claro", 18000, 8, "Semana 4", 30, ""), ("Pinhal", 36000, 10, "Semana 6", 30, ""),
        ("Horizonte", 40000, 11, "Semana 7", 30, ""), ("Aurora (2.ª factura)", 25000, 15, "Semana 11", 30, "Fora do horizonte")]
PAG = [("Gastos com pessoal", 62000, 4), ("Gastos com pessoal", 62000, 8), ("Gastos com pessoal", 62000, 13),
       ("Rendas", 14000, 1), ("Rendas", 14000, 5), ("Rendas", 14000, 9), ("Rendas", 14000, 13),
       ("Fornecedores correntes", 12000, 2), ("Fornecedores correntes", 12000, 4), ("Fornecedores correntes", 12000, 6),
       ("Fornecedores correntes", 12000, 8), ("Fornecedores correntes", 12000, 10), ("Fornecedores correntes", 12000, 12),
       ("Impostos", 28000, 7), ("Impostos", 28000, 12), ("Investimento em equipamento", 24500, 9),
       ("Seguro anual", 18400, None)]


def previsao():
    sem = []
    s = SALDO_PREV
    for w in range(1, 14):
        e = sum(v for _, v, k, *_ in RECB if k == w)
        sa = sum(v for _, v, k in PAG if k == w)
        s = s + e - sa
        sem.append((w, e, sa, s))
    abaixo = [w for w, _, _, c in sem if c < MINIMO]
    minimo = min(sem, key=lambda x: x[3])
    seguro = 18400
    sem2 = []
    s2 = SALDO_PREV
    for w, e, sa, _ in sem:
        s2 = s2 + e - sa
        sem2.append((w, s2))
    return dict(sem=sem, abaixo=abaixo, minimo=minimo, final=sem[-1][3])


def mat_previsao(d):
    wb = Workbook()
    folha(wb, "Premissas", ["Item", "Valor"], [("Saldo inicial (início da semana 1)", SALDO_PREV), ("Saldo mínimo de segurança", MINIMO),
          ("Horizonte", "13 semanas"), ("Nota", "As semanas são numeradas de 1 a 13; o resto das datas é fictício.")], [40, 60], {2: NUM}, primeira=True)
    folha(wb, "Recebimentos", ["Cliente", "Valor", "Semana prevista", "Factura emitida", "Prazo (dias)", "Nota"], RECB, [24, 12, 16, 16, 12, 44], {2: NUM})
    folha(wb, "Pagamentos", ["Descrição", "Valor", "Semana prevista"], PAG, [32, 12, 16], {2: NUM})
    wb.save(os.path.join(d, "Fin_Previsao_Tesouraria_13s.xlsx"))


def gerar_materiais(d):
    os.makedirs(d, exist_ok=True)
    for f in (mat_orcamento, mat_banco, mat_3vias, mat_lancamentos, mat_previsao):
        f(d)


if __name__ == "__main__":
    import json
    ds = desvios_set()
    for x in ds:
        print(x["rub"], x["desv"], None if x["pct"] is None else round(x["pct"], 1), "FLAG" if x["flag"] else "")
    t = totais()
    print({k: v for k, v in t.items() if k[1] == "Set"})
    print(reconciliacao())
    for f in FAT:
        print(fat_linha(f))
    p = previsao()
    print(p)
