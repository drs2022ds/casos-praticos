# Áreas de gestão: gerador do piloto

Gera as páginas `pagina-skills/areas/` (Finanças, Contabilidade, Tesouraria e Recursos Humanos), os materiais fictícios (Excel e Word) e as skills (`SKILL.md`).
Tudo é fictício; os resultados esperados saem dos mesmos módulos de dados que geram os materiais, por isso batem certo.

```
cd areas-gestao
python3 escrever_skills.py   # escreve e valida os SKILL.md (financas/skills, rh/skills)
python3 gerar.py             # materiais, cópias das skills e páginas HTML
```

Requisitos: Python 3, `openpyxl`, `python-docx`.

- `*_dados.py`: dados e cálculos (`contabilidade_dados.py` e `tesouraria_dados.py` reutilizam `financas_dados.py`); `areas_ct.py`: exercícios de Contabilidade e Tesouraria, que partilham três skills cada com Finanças (campo `partilhadas`); `skills_*.py`: texto das skills; `areas.py`: exercícios e resultados esperados; `gerar.py`: HTML (reutiliza o CSS e o JavaScript da página principal).
- Para acrescentar uma área: dados, skills, entrada em `areas.py` e em `gerar.py`.
- Estado: piloto. O conteúdo deve ser revisto por quem conhece cada área; o plugin da Anthropic do exercício B (`finance`, `human-resources`) tem de ser confirmado antes da sessão.
