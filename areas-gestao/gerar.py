import os, re, shutil, html, sys
sys.path.insert(0, os.path.dirname(__file__))
import areas as A
import areas_ct as C
import nucleo as NU
import areas_mt as MT
import mce_dados as MD
import ti_dados as TD2
import financas_dados as F
import rh_dados as H

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(AQUI, "..", "pagina-skills", "areas")
PRINC = os.path.join(AQUI, "..", "pagina-skills", "index.html")
VERSAO = "12-11-2026"
esc = html.escape

def css():
    t = open(PRINC, encoding="utf-8").read()
    return t[t.index("<style>") + 7:t.index("</style>")]

def js():
    t = open(PRINC, encoding="utf-8").read()
    i = t.index("<script>") + 8
    f = t.index("document.querySelectorAll('.prompt button:not(#btn-criar-colar)')")
    # reaproveita só: abrir por hash, botões de copiar, semskill e skillwrap
    seg = t[i:t.index("(function(){\n  var b=document.getElementById('btn-criar-colar')")]
    seg2 = t[t.index("document.querySelectorAll('.skillwrap button')"):t.index("(function(){\n  var KEY=")]
    return seg + seg2

def _dir_skill(area_dir, nome):
    p = os.path.join(AQUI, area_dir, "skills", nome)
    return p if os.path.isdir(p) else os.path.join(AQUI, "financas", "skills", nome)

def md_skill(area_dir, nome):
    return open(os.path.join(_dir_skill(area_dir, nome), "SKILL.md"), encoding="utf-8").read()

def lista(itens):
    return "<ul>\n" + "\n".join(f"  <li>{esc(i)}</li>" for i in itens) + "\n </ul>"

def prompt(txt, pid=None):
    a = f' id="{pid}"' if pid else ""
    return f'<div class="prompt"{a}>{esc(txt)}<button type="button">Copiar</button></div>'

def exercicio(a, e, idx, sk_id):
    sec = f"ex-{e['name']}"
    pid = f"p-{e['name']}"
    return f'''<section id="{sec}">
 <h2><span class="n">{e['n']}</span>Exercício · {esc(e['titulo'])}</h2>
 <div class="meta">
  <div class="box"><b>Skill</b>{esc(e['name'])}</div>
  <div class="box"><b>Material</b>{esc(e['material'])}</div>
  <div class="box"><b>Degrau</b>{esc(e['degrau'])}</div>
 </div>
 <p><span class="tag t2">{esc(e['tag'])}</span></p>
 <p><b>Objectivo.</b> {esc(e['objectivo'])}</p>
 {prompt(e['pedido'], pid)}
 <p class="semskill">A skill não está na sua conta? O texto está mais acima, na secção S: <a href="#{sk_id}">abrir o item {e['n']}</a>. Ou use o botão: copia as instruções da skill e o pedido acima; cole numa conversa nova e <b>anexe os ficheiros</b> deste exercício.<br><button type="button" class="semskill-btn" data-skill="{e['name']}" data-prompt="{pid}">Copiar instruções e pedido</button></p>
 <h3>Resultado esperado</h3>
 {lista(e['esperado'])}
 <h3>Discussão</h3>
 {lista(e['discussao'])}
</section>'''

def skillblock(a, nome, rotulo, sk_id, ex_anchor, ex_txt):
    txt = md_skill(a['pasta_skills'], nome)
    return f'''<details class="skillblock" id="{sk_id}"><summary>{esc(rotulo)} <code>{nome}</code></summary>
  <p class="sk-meta">Para {ex_txt}. Ficheiro: <a href="skills/{nome}/SKILL.md" download>SKILL.md</a>.</p>
  <div class="skillwrap"><pre class="skilltext">{esc(txt)}</pre><button type="button">Copiar</button></div>
 </details>'''

def pagina(a):
    ex = a['exercicios']; o = a['orq']; g = a['generica']
    pasta_sk = a['pasta_skills']
    nav = ['<a href="#comecar">Começar</a>', '<a href="#skills-texto">Skills</a>']
    nav += [f'<a href="#ex-{e["name"]}">{e["n"]} · {esc(e["titulo"].split(" ")[0])}…</a>' if False else f'<a href="#ex-{e["name"]}">{e["n"]} · {esc(e["tag"].split(" ·")[0])}</a>' for e in ex]
    nav += ['<a href="#orquestrador">A · Orquestrador</a>', '<a href="#generica">B · Genérica vs. adaptada</a>', '<a href="#ref">Referência</a>']
    blocos = []
    for e in ex:
        blocos.append(skillblock(a, e['name'], f"{e['n']} · {e['titulo']}", f"sk-{e['n']}", f"ex-{e['name']}", f'o exercício <a href="#ex-{e["name"]}">{e["n"]}</a>'))
    blocos.append(skillblock(a, o['name'], f"A · {o['titulo'].split(':')[0]}", "sk-A", "orquestrador", 'o exercício <a href="#orquestrador">A</a>'))
    exs = "\n\n".join(exercicio(a, e, i, f"sk-{e['n']}") for i, e in enumerate(ex))
    mats = "\n".join(f'  <li><a href="materiais/{n}" download>{esc(n)}</a>: {esc(d)}</li>' for n, d in a['materiais'])
    cuid = lista(a['cuidados'])
    t1 = prompt(o['t1'], "p-orq1"); t2 = prompt(o['t2'], "p-orq2"); t3 = prompt(o['t3'], "p-orq3")
    comp = lista(g['comparar'])
    cab = esc(a['titulo'])
    return f'''<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{cab} · Skills · Abreu Advogados</title>
<style>{css()}</style>
</head>
<body>

<header class="top">
 <div class="in">
  <div class="kicker">{esc(a['kicker'])}</div>
  <h1>Skills para {esc(a['titulo'].lower())}</h1>
  <p>{esc(a['resumo'])}</p>
 </div>
</header>

<nav class="idx" aria-label="Índice"><div class="in">
 {"".join(nav)}
</div></nav>

<main>

<section id="comecar">
 <h2><span class="n">0</span>Começar</h2>
 <div class="aviso"><b>Piloto, com dados fictícios.</b> {esc(a['cenario'])} Esta página é um ponto de partida para validar com a área: as skills e os resultados esperados devem ser revistos por quem conhece o trabalho antes de qualquer uso real.</div>
 <p>Esta página segue o mesmo método do <a href="../nucleo/index.html">núcleo comum</a>: <a href="../nucleo/index.html#escada">escada de autonomia</a>, <a href="../nucleo/index.html#rasto">folha de rasto</a>, <a href="../nucleo/index.html#criar">criar a minha skill</a> e <a href="../nucleo/index.html#ficha">ficha de autonomia</a>. Não se repetem aqui. Cada exercício tem objectivo, material, pedido, resultado esperado e discussão. <b>O formador demonstra, os formandos repetem, o grupo compara e valida.</b></p>
 <h3>Cuidados desta área</h3>
 {cuid}
 <div class="meta">
  <div class="box"><b>Marcador de lacunas</b>Quando falta um dado, as skills escrevem <code>[POR PREENCHER: descrição]</code>. Nunca devem inventar.</div>
  <div class="box"><b>Contas</b>Os resultados esperados trazem os números certos, calculados à parte. Se o resultado da skill não bater, o erro é da skill.</div>
  <div class="box"><b>Antes de começar</b>Crie as skills (secção S) ou use o botão «Copiar instruções e pedido» de cada exercício. Abra uma conversa nova por exercício e anexe os ficheiros indicados.</div>
 </div>
</section>

<section id="skills-texto">
 <h2><span class="n">S</span>Texto das skills: crie-as na sua conta</h2>
 <p>O processo é o mesmo do <a href="../nucleo/index.html#skills-como">núcleo comum</a>: descarregar o <code>SKILL.md</code>, pôr numa pasta com o nome da skill, comprimir em ZIP e carregar em <em>Personalizar (<i>Customize</i>) › Skills</em>. Versão dos textos: {VERSAO}. Se o formador corrigir um texto, volte a copiá-lo.</p>
 <h3>Os textos</h3>
 {chr(10).join(" " + b for b in blocos)}
</section>

{exs}

<section id="orquestrador">
 <h2><span class="n">A</span>Exercício · {esc(o['titulo'])}</h2>
 <div class="meta">
  <div class="box"><b>Skill</b>{esc(o['name'])}</div>
  <div class="box"><b>Material</b>{esc(o['material'])}</div>
  <div class="box"><b>Degrau</b>3 · fluxo com paragens</div>
 </div>
 <p><b>Objectivo.</b> {esc(o['objectivo'])} Contexto: <a href="../nucleo/index.html#fluxo">fluxo encadeado com paragens</a>, no núcleo comum.</p>
 <h3>Teste 1 · A tarefa completa</h3>
 {t1}
 <p class="semskill">A skill não está na sua conta? <a href="#sk-A">Abrir o texto</a>. Ou use o botão e <b>anexe os ficheiros</b>.<br><button type="button" class="semskill-btn" data-skill="{o['name']}" data-prompt="p-orq1">Copiar instruções e pedido</button></p>
 <h3>Resultado esperado</h3>
 {lista(o['t1_esperado'])}
 <h3>Teste 2 · Pedir que salte as paragens e aja</h3>
 <p>Na mesma conversa, depois da primeira paragem:</p>
 {t2}
 <h3>Resultado esperado</h3>
 {lista(o['t2_esperado'])}
 <h3>Teste 3 · A sua tarefa</h3>
 {t3}
 <h3>Resultado esperado</h3>
 {lista(o['t3_esperado'])}
</section>

<section id="generica">
 <h2><span class="n">B</span>Exercício · Skill genérica vs. adaptada</h2>
 <div class="meta">
  <div class="box"><b>Material</b>O mesmo dos exercícios anteriores</div>
  <div class="box"><b>Plugin</b><code>{esc(g['plugin'])}</code>, da Anthropic (a confirmar antes da sessão)</div>
  <div class="box"><b>Degrau</b>1 · supervisionada</div>
 </div>
 <div class="aviso"><b>Antes da sessão.</b> Este exercício só funciona se o plugin <code>{esc(g['plugin'])}</code> estiver disponível na conta dos participantes. O formador deve confirmá-lo e testar o pedido: o comportamento do plugin pode mudar.</div>
 <p><b>Objectivo.</b> Perceber o que uma skill genérica faz e o que ganha uma skill adaptada à sociedade. Faça {esc(g['tarefa'])} duas vezes, em conversas novas: uma com o plugin da Anthropic e outra com a skill desta página. Compare.</p>
 <h3>Pontos de comparação</h3>
 {comp}
 <h3>Discussão</h3>
 <ul>
  <li>O que a skill genérica deu que a adaptada não deu, e vice-versa?</li>
  <li>Que parte do plugin genérico mudaria para o tornar utilizável na sociedade?</li>
  <li>Quem deve aprovar a adaptação antes de ser usada por toda a área?</li>
 </ul>
</section>

<section id="ref">
 <h2><span class="n">R</span>Referência</h2>
 <h3>Materiais do piloto</h3>
 <ul>
{mats}
 </ul>
 <p>Os ficheiros são fictícios e foram gerados por programa a partir de dados com resultados conhecidos. As contas dos resultados esperados foram calculadas pelo mesmo programa.</p>
 <h3>Termos usados</h3>
 <div class="tw"><table>
  <tr><th>Termo</th><th>Significado</th></tr>
  <tr><td>Resultado esperado</td><td>O que se deve obter se a skill funcionar, com os números certos. Serve para o formando se conferir.</td></tr>
  <tr><td>Folha de rasto</td><td>O registo do que a skill leu, calculou e deixou em aberto, com a validação humana em branco.</td></tr>
  <tr><td>[POR PREENCHER]</td><td>Marcador de um dado em falta. Um marcador no sítio certo é um bom resultado.</td></tr>
  <tr><td>Paragem</td><td>Ponto em que o fluxo espera pela decisão do responsável.</td></tr>
 </table></div>
 <p><a href="../index.html">Voltar à lista de áreas</a> · <a href="../nucleo/index.html">Núcleo comum</a></p>
</section>

</main>

<script>
{js()}
</script>
</body>
</html>
'''

def indice():
    cards = "\n".join(f'''  <div class="box"><h3><a href="{a['pasta']}/index.html">{esc(a['titulo'])}</a></h3><p>{esc(a['resumo'])}</p></div>''' for a in AREAS)
    linhas = []
    for a in AREAS:
        nomes = [e['name'] for e in a['exercicios']] + [a['orq']['name']]
        linhas.append(f'  <tr><td><a href="{a["pasta"]}/index.html">{esc(a["titulo"])}</a></td><td>' + "<br>".join(f"<code>{n}</code>" for n in nomes) + "</td></tr>")
    tabela = "\n".join(linhas)
    return f'''<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Áreas de gestão · Skills · Abreu Advogados</title>
<style>{css()}</style>
</head>
<body>
<header class="top"><div class="in">
 <div class="kicker">Formação em IA generativa · Abreu Advogados · Piloto</div>
 <h1>Skills para as áreas de gestão</h1>
 <p>Páginas de exercícios, com dados fictícios, para as áreas de apoio. Seis áreas em piloto, a validar com cada área.</p>
</div></header>
<main>
<section id="areas">
 <h2><span class="n">·</span>Áreas</h2>
 <div class="aviso"><b>Piloto.</b> O método (escada de autonomia, folha de rasto, criação de skills e ficha) está no <a href="nucleo/index.html">núcleo comum</a> e aplica-se a todas as áreas. Estas páginas só acrescentam os exercícios de cada área.</div>
{cards}
 <p>Finanças, Contabilidade e Tesouraria partilham algumas skills e parte do material.</p>
 <h3>Que skills tenho de criar?</h3>
 <p>Só as da sua área, listadas abaixo: seis skills, uma por exercício, e o agente orquestrador. Cada página explica como criá-las (secção S) ou como usar o botão «Copiar instruções e pedido», que dispensa a criação. As skills jurídicas do <a href="../index.html">guia principal</a> destinam-se aos advogados e não são necessárias aqui. Para criar uma skill sua, use a <code>criar-skill</code> do <a href="nucleo/index.html#criar">núcleo comum</a>. O exercício B, com um plugin da Anthropic, é facultativo e depende de o formador o confirmar.</p>
 <div class="tw"><table>
  <tr><th>Área</th><th>Skills da área (por ordem dos exercícios)</th></tr>
{tabela}
 </table></div>
</section>
</main>
</body>
</html>
'''

AREAS = [A.FIN, C.CONT, C.TES, A.RH, MT.MKT, MT.TI]
MAPA = {"financas": ("financas", F.gerar_materiais), "rh": ("rh", H.gerar_materiais),
        "contabilidade": ("contabilidade", C.CONT["materiais_fn"]), "tesouraria": ("tesouraria", C.TES["materiais_fn"]),
        "marketing": ("marketing", MD.gerar_materiais), "ti": ("ti", TD2.gerar_materiais)}

if __name__ == "__main__":
    if os.path.isdir(SAIDA):
        shutil.rmtree(SAIDA)
    os.makedirs(SAIDA)
    for a in AREAS:
        pasta_sk, mat = MAPA[a['id']]
        a['pasta_skills'] = pasta_sk
        d = os.path.join(SAIDA, a['pasta'])
        os.makedirs(d)
        mat(os.path.join(d, "materiais"))
        nomes = set(os.listdir(os.path.join(AQUI, pasta_sk, "skills"))) | set(a.get("partilhadas", []))
        for nome in sorted(nomes):
            shutil.copytree(_dir_skill(pasta_sk, nome), os.path.join(d, "skills", nome))
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(pagina(a))
    NU.gerar(SAIDA, css())
    open(os.path.join(SAIDA, "index.html"), "w", encoding="utf-8").write(indice())
    print("ok")
