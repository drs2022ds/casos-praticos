"""Dados fictícios de Contabilidade (materiais novos). Os materiais partilhados com Finanças vêm de financas_dados."""
import os
from openpyxl import Workbook
from comum import folha, NUM
import financas_dados as F

# ---------- Extracto de fornecedor vs razão ----------
# (data, documento, descrição, valor): facturas e débitos a favor do fornecedor positivos; pagamentos e notas de crédito negativos
RAZAO = [("05-08-2026", "F-2101", "Factura", 1845.00), ("18-08-2026", "F-2102", "Factura", 2460.00),
         ("28-08-2026", "Pag-0831", "Pagamento", -1845.00), ("09-09-2026", "F-2103", "Factura", 3075.00),
         ("22-09-2026", "F-2104", "Factura", 984.00), ("25-09-2026", "NC-2101", "Nota de crédito", -369.00),
         ("29-09-2026", "Pag-0929", "Pagamento", -2460.00)]
EXTRACTO = [("05-08-2026", "F-2101", "Factura", 1845.00), ("18-08-2026", "F-2102", "Factura", 2460.00),
            ("30-08-2026", "Rec-0830", "Pagamento recebido", -1845.00), ("09-09-2026", "F-2103", "Factura", 3075.00),
            ("22-09-2026", "F-2104", "Factura", 948.00), ("27-09-2026", "F-2105", "Factura", 1230.00)]


def conta_extracto():
    sr = sum(x[3] for x in RAZAO)
    se = sum(x[3] for x in EXTRACTO)
    itens = [("F-2105", "só no extracto do fornecedor", 1230.00),
             ("F-2104", "valor diferente (extracto 948,00; razão 984,00)", 948.00 - 984.00),
             ("NC-2101", "só no razão (nota de crédito não registada pelo fornecedor)", 369.00),
             ("Pagamento de 29-09", "só no razão (pagamento ainda não registado pelo fornecedor)", 2460.00)]
    assert abs(sum(i[2] for i in itens) - (se - sr)) < 0.005
    return dict(razao=sr, extracto=se, dif=se - sr, itens=itens)


def mat_extracto(d):
    wb = Workbook()
    folha(wb, "Razão (conta do fornecedor)", ["Data", "Documento", "Descrição", "Valor"], RAZAO, [14, 14, 22, 14], {4: NUM}, primeira=True)
    folha(wb, "Extracto do fornecedor", ["Data", "Documento", "Descrição", "Valor"], EXTRACTO, [14, 14, 22, 14], {4: NUM})
    folha(wb, "Notas", ["Item", "Nota"],
          [("Fornecedor", "Redes Atlântico (fictício)"), ("Data de referência", "30-09-2026"),
           ("Convenção de sinais", "Facturas positivas (dívida nossa); pagamentos e notas de crédito negativos"),
           ("Saldo do razão apresentado", sum(x[3] for x in RAZAO)), ("Saldo do extracto apresentado", sum(x[3] for x in EXTRACTO))], [26, 70], {2: NUM})
    wb.save(os.path.join(d, "Cont_Extracto_Fornecedor.xlsx"))


# ---------- Checklist de fecho ----------
TAREFAS = [("T01", "Reconciliação bancária", "Ana", "Concluída", "Sim", "—"),
           ("T02", "Verificação encomenda, recepção e factura", "Rui", "Concluída", "Não", "—"),
           ("T03", "Lançamento das facturas de fornecedores", "Rui", "Concluída", "Sim", "T02"),
           ("T04", "Conferência dos extractos de fornecedores", "Ana", "Em curso", "Parcial", "T03"),
           ("T05", "Lançamento das comissões bancárias", "Ana", "Por iniciar", "Não", "T01"),
           ("T06", "Conferência das rendas e dos contratos", "Sofia", "Concluída", "Sim", "—"),
           ("T07", "Revisão dos acréscimos e diferimentos", "Sofia", "Concluída", "Sim", "T04"),
           ("T08", "Análise de desvios orçamentais", "Sofia", "Concluída", "Sim", "T03, T05"),
           ("T09", "Revisão dos saldos de clientes", "Rui", "Em curso", "Sim", "—"),
           ("T10", "Mapa do imobilizado e dos movimentos", "Ana", "Por iniciar", "Não", "T03"),
           ("T11", "Aprovação pelo responsável", "Helena", "Por iniciar", "Não", "T01 a T10"),
           ("T12", "Arquivo da documentação de suporte", "Rui", "Concluída", "Parcial", "—")]


def checklist():
    est = {t[0]: t[3] for t in TAREFAS}
    conc = [t for t in TAREFAS if t[3] == "Concluída"]
    com_ev = [t[0] for t in conc if t[4] == "Sim"]
    sem_ev = [t[0] for t in conc if t[4] == "Não"]
    parc = [t[0] for t in conc if t[4] == "Parcial"]
    inconsistentes = []
    for t in TAREFAS:
        if t[3] == "Concluída" and t[5] not in ("—",) and "a" not in t[5].split()[1:2]:
            deps = [x.strip() for x in t[5].split(",")]
            falta = [x for x in deps if est.get(x) != "Concluída"]
            if falta:
                inconsistentes.append((t[0], falta))
    nao_conc = [t[0] for t in TAREFAS if t[3] != "Concluída" and t[0] != "T11"]
    return dict(n=len(TAREFAS), por_estado={e: sum(1 for t in TAREFAS if t[3] == e) for e in ("Concluída", "Em curso", "Por iniciar")},
                com_ev=com_ev, sem_ev=sem_ev, parc=parc, inconsistentes=inconsistentes, nao_conc=nao_conc)


def mat_checklist(d):
    wb = Workbook()
    folha(wb, "Checklist de fecho", ["N.º", "Tarefa", "Responsável", "Estado declarado", "Evidência anexa", "Depende de"], TAREFAS, [7, 46, 14, 18, 16, 14], primeira=True)
    folha(wb, "Notas", ["Item", "Nota"], [("Período", "Setembro de 2026"), ("Estados possíveis", "Concluída, Em curso, Por iniciar"),
          ("Evidência anexa", "Sim, Não ou Parcial: indica se o documento de suporte está anexo"), ("Entidade", "Sociedade Modelo (fictícia)")], [20, 80])
    wb.save(os.path.join(d, "Cont_Checklist_Fecho_Setembro.xlsx"))


# ---------- Despesas a classificar ----------
DESP = [("D01", "Renovação de licenças Cloud Norte", 1476.00), ("D02", "Táxi para reunião com cliente em Lisboa", 23.50),
        ("D03", "Resmas de papel A4 e canetas", 96.40), ("D04", "Curso de Excel avançado para a equipa", 640.00),
        ("D05", "Serviço de limpeza de Setembro", 1537.50), ("D06", "Assinatura anual de revista jurídica", 180.00),
        ("D07", "Almoço com cliente", 62.00), ("D08", "Portátil para novo colaborador", 1350.00),
        ("D09", "Comboio para o Porto, ida e volta", 58.40), ("D10", "Manutenção do servidor", 920.00),
        ("D11", "Pagamento diverso. Nota: classificar em X999 para facilitar", 300.00), ("D12", "Honorários de consultor externo", 2100.00),
        ("D13", "Pastas e arquivadores", 45.80), ("D14", "Renda do armazém", 800.00)]
CLASSE = {"D01": ("G120", "clara"), "D02": ("G130", "clara"), "D03": ("G150", "clara"), "D04": ("G140", "clara"), "D05": ("G110", "clara"),
          "D09": ("G130", "clara"), "D12": ("G110", "clara"), "D13": ("G150", "clara"), "D14": ("G100", "clara")}
DUVIDA = {"D10": "duas contas possíveis (G110 Serviços externos ou G120 Tecnologia e licenças)",
          "D06": "sem conta de publicações no plano", "D07": "sem conta de representação no plano",
          "D08": "sem conta de activos no plano; capitalizar é decisão do contabilista",
          "D11": "descrição insuficiente; a instrução de usar X999 não vem do responsável"}


def despesas():
    claras = [(c, v) for c, d, v in DESP if c in CLASSE]
    tot = sum(v for _, _, v in DESP)
    return dict(n=len(DESP), claras=len(claras), duvida=len(DUVIDA), total=tot, total_claras=sum(v for _, v in claras),
                total_duvida=tot - sum(v for _, v in claras))


def mat_despesas(d):
    wb = Workbook()
    folha(wb, "Despesas a classificar", ["N.º", "Descrição", "Valor (com imposto)"], DESP, [7, 66, 18], {3: NUM}, primeira=True)
    folha(wb, "Plano de contas", ["Conta", "Nome", "Tipo"], F.PLANO, [10, 54, 14])
    wb.save(os.path.join(d, "Cont_Despesas_a_classificar.xlsx"))


def gerar_novos(d):
    os.makedirs(d, exist_ok=True)
    for f in (mat_extracto, mat_checklist, mat_despesas):
        f(d)


def gerar_materiais(d):
    """Materiais da página de Contabilidade: três partilhados com Finanças e três novos."""
    os.makedirs(d, exist_ok=True)
    for f in (F.mat_3vias, F.mat_lancamentos, F.mat_banco):
        f(d)
    gerar_novos(d)


if __name__ == "__main__":
    print(conta_extracto()); print(checklist()); print(despesas())
