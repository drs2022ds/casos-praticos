"""Funções comuns aos módulos de cada área (formatação portuguesa e ficheiros Excel/Word)."""
import os
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill


def eur(x, casas=2):
    s = f"{abs(x):,.{casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("-" if x < 0 else "") + s


def sinal(x, casas=2):
    return ("+" if x > 0 else "") + eur(x, casas)


def pct(x, casas=1):
    return ("-" if x < 0 else ("+" if x > 0 else "")) + f"{abs(x):.{casas}f}".replace(".", ",") + " %"


def folha(wb, titulo, cabecalho, linhas, larguras=None, formato=None, primeira=False):
    ws = wb.active if primeira else wb.create_sheet()
    ws.title = titulo
    ws.append(cabecalho)
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF")
        c.fill = PatternFill("solid", fgColor="14213D")
        c.alignment = Alignment(wrap_text=True, vertical="top")
    for l in linhas:
        ws.append(list(l))
    for i, w in enumerate(larguras or [], start=1):
        ws.column_dimensions[chr(64 + i)].width = w
    if formato:
        for col, f in formato.items():
            for r in ws.iter_rows(min_row=2, min_col=col, max_col=col):
                for c in r:
                    if isinstance(c.value, (int, float)):
                        c.number_format = f
    ws.freeze_panes = "A2"
    return ws


NUM = '#,##0.00'
