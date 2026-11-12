"""Dados fictícios de Tesouraria (materiais novos). A previsão a 13 semanas e a reconciliação vêm de financas_dados."""
import os
from datetime import date, timedelta
from openpyxl import Workbook
from comum import folha, NUM
import financas_dados as F

REF = date(2026, 9, 30)


def dmy(s):
    d, m, a = s.split("-")
    return date(int(a), int(m), int(d))


def fmt(d):
    return d.strftime("%d-%m-%Y")


# ---------- Mapa de vencimentos ----------
# (id, fornecedor, factura, data, prazo em dias ou None, valor, estado)
VENC = [("V01", "Cloud Norte", "F-2201", "01-09-2026", 30, 1476.00, "Por pagar"),
        ("V02", "Papelaria Central", "F-2202", "10-08-2026", 30, 959.40, "Por pagar"),
        ("V03", "Limpezas Ribeira", "F-2203", "30-09-2026", 30, 1537.50, "Por pagar"),
        ("V04", "Tech Suporte", "F-2204", "12-09-2026", 30, 3013.50, "Por pagar"),
        ("V05", "Eventos Ponte", "F-2205", "20-09-2026", 60, 640.00, "Por pagar"),
        ("V06", "Serra Serviços", "F-2206", "27-09-2026", None, 3690.00, "Por pagar"),
        ("V07", "Mobiliário Ribeira", "F-2207", "11-09-2026", 30, 3025.80, "Por pagar"),
        ("V08", "Formação Norte", "F-2208", "16-08-2026", 45, 900.00, "Por pagar"),
        ("V09", "Seguros Atlântico", "F-2209", "15-07-2026", 90, 18400.00, "Por pagar"),
        ("V10", "Papelaria Central", "F-2210", "05-08-2026", 30, 780.00, "Pago em 28-09-2026"),
        ("V11", "Cloud Norte", "F-2211", "29-09-2026", 30, 1476.00, "Por pagar"),
        ("V12", "Redes Atlântico", "F-2105", "27-09-2026", 15, 1230.00, "Por pagar")]
INTERVALOS = ["Vencida", "Vence em 0 a 7 dias", "Vence em 8 a 30 dias", "Vence em mais de 30 dias", "Sem prazo"]


def venc_linha(v):
    i, forn, fac, data, prazo, valor, estado = v
    if estado != "Por pagar":
        return dict(id=i, excl=True, valor=valor)
    if prazo is None:
        return dict(id=i, forn=forn, fac=fac, valor=valor, venc=None, dias=None, bucket="Sem prazo")
    venc = dmy(data) + timedelta(days=prazo)
    dias = (venc - REF).days
    b = "Vencida" if dias < 0 else "Vence em 0 a 7 dias" if dias <= 7 else "Vence em 8 a 30 dias" if dias <= 30 else "Vence em mais de 30 dias"
    return dict(id=i, forn=forn, fac=fac, valor=valor, venc=venc, dias=dias, bucket=b)


def vencimentos():
    ls = [venc_linha(v) for v in VENC]
    por = {b: [l for l in ls if not l.get("excl") and l["bucket"] == b] for b in INTERVALOS}
    tot = {b: round(sum(l["valor"] for l in por[b]), 2) for b in INTERVALOS}
    return dict(linhas=ls, por=por, tot=tot, n_ab=sum(1 for l in ls if not l.get("excl")), total=round(sum(tot.values()), 2))


def semana_de(venc):
    d = (venc - REF).days
    return max(1, -(-d // 7))


def mat_vencimentos(d):
    wb = Workbook()
    folha(wb, "Facturas de fornecedores", ["N.º", "Fornecedor", "Factura", "Data da factura", "Prazo (dias)", "Valor", "Estado"], VENC, [7, 22, 12, 16, 12, 14, 24], {6: NUM}, primeira=True)
    folha(wb, "Notas", ["Item", "Nota"], [("Data de referência", "30-09-2026"), ("Vencimento", "Data da factura mais o prazo em dias"),
          ("Intervalos pedidos", "Vencida; vence em 0 a 7 dias; 8 a 30 dias; mais de 30 dias"),
          ("Fins-de-semana e feriados", "Sem ajustes nesta lista"), ("Entidade", "Sociedade Modelo (fictícia)")], [26, 70])
    wb.save(os.path.join(d, "Tes_Mapa_Vencimentos.xlsx"))


# ---------- Antiguidade de saldos de clientes ----------
# (id, cliente, documento, emissão, vencimento, valor, recebido)
COBR = [("C01", "Aurora", "FT-701", "16-08-2026", "15-09-2026", 25000.00, 0.0),
        ("C02", "Girassol", "FT-702", "26-08-2026", "25-09-2026", 9840.00, 0.0),
        ("C03", "Ponte Nova", "FT-688", "13-07-2026", "12-08-2026", 28000.00, 0.0),
        ("C04", "Vale", "FT-690", "10-06-2026", "10-07-2026", 30000.00, 12000.00),
        ("C05", "Campo Verde", "FT-715", "15-09-2026", "15-10-2026", 52000.00, 0.0),
        ("C06", "Rio Claro", "FT-640", "20-04-2026", "20-05-2026", 6150.00, 0.0),
        ("C07", "Pinhal", "FT-699", "30-08-2026", "30-09-2026", 36000.00, 0.0),
        ("C08", "Horizonte", "FT-709", "05-09-2026", "05-10-2026", 40000.00, 0.0),
        ("C09", "Aurora", "NC-12", "20-09-2026", None, -3000.00, 0.0),
        ("C10", "Vale", "FT-691", "21-05-2026", "20-06-2026", 4920.00, 0.0),
        ("C11", "Girassol", "FT-650", "01-05-2026", None, 2460.00, 0.0)]
FAIXAS = ["Não vencida", "1 a 30 dias", "31 a 60 dias", "61 a 90 dias", "Mais de 90 dias"]


def faixa(dias):
    return "Não vencida" if dias <= 0 else "1 a 30 dias" if dias <= 30 else "31 a 60 dias" if dias <= 60 else "61 a 90 dias" if dias <= 90 else "Mais de 90 dias"


def antiguidade():
    linhas, a_parte, sem_data = [], [], []
    for i, cli, doc, em, ve, val, rec in COBR:
        saldo = val - rec
        if val < 0:
            a_parte.append((i, cli, doc, saldo)); continue
        if ve is None:
            sem_data.append((i, cli, doc, saldo)); continue
        dias = (REF - dmy(ve)).days
        linhas.append((i, cli, doc, saldo, dias, faixa(dias)))
    por = {f: round(sum(l[3] for l in linhas if l[5] == f), 2) for f in FAIXAS}
    cli = {}
    for i, c, doc, val, rec in [(x[0], x[1], x[2], x[5], x[6]) for x in COBR]:
        cli[c] = cli.get(c, 0) + val - rec
    return dict(linhas=linhas, por=por, a_parte=a_parte, sem_data=sem_data, total_faixas=round(sum(por.values()), 2),
                nc=round(sum(x[3] for x in a_parte), 2), sd=round(sum(x[3] for x in sem_data), 2), por_cliente={k: round(v, 2) for k, v in cli.items()})


def mat_cobrancas(d):
    wb = Workbook()
    folha(wb, "Facturas a receber", ["N.º", "Cliente", "Documento", "Emissão", "Vencimento", "Valor", "Recebido"], COBR, [7, 18, 12, 14, 14, 14, 14], {6: NUM, 7: NUM}, primeira=True)
    folha(wb, "Notas", ["Item", "Nota"], [("Data de referência", "30-09-2026"), ("Antiguidade", "Dias entre o vencimento e a data de referência"),
          ("Faixas pedidas", "Não vencida; 1 a 30; 31 a 60; 61 a 90; mais de 90 dias"), ("Nota de crédito", "Valor negativo; sem vencimento"),
          ("Entidade", "Sociedade Modelo (fictícia)")], [26, 70])
    wb.save(os.path.join(d, "Tes_Cobrancas_Clientes.xlsx"))


# ---------- Calendário de pagamentos a propor ----------
SALDO0 = 90000.00
MIN = 30000.00
N_SEM = 8
RECEB = {2: 25000.00, 4: 18000.00, 6: 30000.00, 7: 40000.00}
OBRIG = [("Renda", 14000.00, 1), ("Impostos", 28000.00, 3), ("Salários", 45000.00, 5)]
# (factura, fornecedor, valor, semana de vencimento, pode pagar-se até)
def _adiaveis():
    por_id = {v[0]: v for v in VENC}
    def v(i, limite):
        x = por_id[i]
        venc = dmy(x[3]) + timedelta(days=x[4])
        return (x[2], x[1], x[5], semana_de(venc), limite)
    return [v("V01", 3), v("V04", 4), v("V07", 2), v("V09", 5), v("V03", 5), v("V05", 8)]
ADIAV = _adiaveis()
SEM_LIMITE = ("F-2206", "Serra Serviços", 3690.00)


def calendario():
    plano = {}
    for f, forn, val, venc, lim in ADIAV:
        plano[f] = lim  # o mais tarde possível dentro do limite
    s = SALDO0
    sem = []
    for w in range(1, N_SEM + 1):
        e = RECEB.get(w, 0.0)
        o = sum(v for _, v, k in OBRIG if k == w)
        a = sum(val for f, _, val, _, _ in ADIAV if plano[f] == w)
        s = round(s + e - o - a, 2)
        sem.append((w, e, o, a, s))
    s = SALDO0
    base = []
    for w in range(1, N_SEM + 1):
        e = RECEB.get(w, 0.0)
        o = sum(v for _, v, k in OBRIG if k == w)
        a = sum(val for _, _, val, venc, _ in ADIAV if venc == w)
        s = round(s + e - o - a, 2)
        base.append((w, s))
    abaixo = [x for x in sem if x[4] < MIN]
    return dict(plano=plano, sem=sem, base=base, abaixo=abaixo)


def mat_calendario(d):
    wb = Workbook()
    folha(wb, "Premissas", ["Item", "Valor"], [("Saldo inicial (início da semana 1)", SALDO0), ("Saldo mínimo de segurança", MIN),
          ("Horizonte", f"{N_SEM} semanas"), ("Semana 1", "Começa no dia seguinte à data de referência (30-09-2026)")], [40, 60], {2: NUM}, primeira=True)
    folha(wb, "Recebimentos", ["Semana", "Valor"], [(k, v) for k, v in RECEB.items()], [10, 14], {2: NUM})
    folha(wb, "Obrigatórios", ["Descrição", "Valor", "Semana"], OBRIG, [24, 14, 10], {2: NUM})
    folha(wb, "A calendarizar", ["Factura", "Fornecedor", "Valor", "Semana de vencimento", "Pode pagar-se até (semana)"], ADIAV + [SEM_LIMITE + (None, None)], [12, 22, 14, 20, 26], {3: NUM})
    wb.save(os.path.join(d, "Tes_Pagamentos_a_Calendarizar.xlsx"))


def gerar_novos(d):
    os.makedirs(d, exist_ok=True)
    for f in (mat_vencimentos, mat_cobrancas, mat_calendario):
        f(d)


def gerar_materiais(d):
    os.makedirs(d, exist_ok=True)
    F.mat_previsao(d)
    F.mat_banco(d)
    gerar_novos(d)


if __name__ == "__main__":
    v = vencimentos(); print(v["tot"], v["total"], v["n_ab"])
    for l in v["linhas"]: print(l)
    a = antiguidade(); print(a["por"], a["total_faixas"], a["nc"], a["sd"], a["por_cliente"])
    print(ADIAV)
    c = calendario(); print(c["sem"]); print(c["base"]); print([x[0] for x in c["abaixo"]])
