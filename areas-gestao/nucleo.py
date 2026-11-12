"""Núcleo comum neutro (sem linguagem jurídica) para as áreas de gestão. Gera areas/nucleo/index.html."""
import os, re, html, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
PRINC = os.path.join(AQUI, "..", "pagina-skills", "index.html")
esc = html.escape


def _princ():
    return open(PRINC, encoding="utf-8").read()


def _sec(t, sid):
    return re.search(r'<section id="%s"[^>]*>.*?</section>' % sid, t, re.S).group(0)


def _neutro(s):
    for a, b in [("O advogado confirma o que vai usar", "O responsável confirma o que vai usar"),
                 ("é o próprio advogado que lê tudo", "é o próprio responsável que lê tudo"),
                 ("pela decisão do advogado", "pela decisão do responsável"),
                 ("O que cabe ao advogado decidir", "O que cabe ao responsável decidir"),
                 ("(secção 10)", "(secção 3)"),
                 ("Preencha no fim do exercício 11", "Preencha no fim do exercício da secção 4"),
                 ("(por exemplo, o painel do detector)", "(por exemplo, um painel de indicadores)"),
                 ('<h2><span class="n">1</span>', '<h2><span class="n">1</span>'),
                 ('<span class="n">12</span>', '<span class="n">5</span>')]:
        s = s.replace(a, b)
    return s


def pagina(css, js_total):
    t = _princ()
    escada = _neutro(_sec(t, "escada"))
    rasto = _neutro(_sec(t, "rasto"))
    ficha = _neutro(_sec(t, "ficha"))
    criar_txt = open(os.path.join(AQUI, "nucleo", "skills", "criar-skill", "SKILL.md"), encoding="utf-8").read()
    for pal in ("advogad", "jurídic", "playbook", "cláusula", "contrato"):
        for nome, s in (("escada", escada), ("rasto", rasto), ("ficha", ficha)):
            assert pal not in s.lower(), (nome, pal)
    return f'''<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Núcleo comum · Skills para as áreas de gestão · Abreu Advogados</title>
<style>{css}</style>
</head>
<body>

<header class="top">
 <div class="in">
  <div class="kicker">Formação em IA generativa · Abreu Advogados · Piloto</div>
  <h1>Núcleo comum: autonomia, folha de rasto e criação de skills</h1>
  <p>O método que as páginas de cada área usam: a escada de autonomia, a folha de rasto, os fluxos com paragens, como criar a sua skill e a ficha de autonomia.</p>
 </div>
</header>

<nav class="idx" aria-label="Índice"><div class="in">
 <a href="#comecar">Começar</a><a href="#escada">1 · Escada</a><a href="#rasto">2 · Folha de rasto</a><a href="#fluxo">3 · Fluxo com paragens</a>
 <a href="#skills-como">Criar skills na conta</a><a href="#criar">4 · Criar a minha skill</a><a href="#ficha">5 · Ficha</a><a href="#agentes">6 · Agentes</a>
</div></nav>

<main>

<section id="comecar">
 <h2><span class="n">0</span>Começar</h2>
 <div class="aviso"><b>Dados fictícios.</b> Nos exercícios, use só documentos fictícios, anonimizados ou autorizados pela sociedade. Nunca cole credenciais, dados bancários reais ou dados pessoais identificáveis.</div>
 <p>Esta página é o ponto comum a todas as áreas: <a href="../financas/index.html">Finanças</a>, <a href="../contabilidade/index.html">Contabilidade</a>, <a href="../tesouraria/index.html">Tesouraria</a>, <a href="../recursos-humanos/index.html">Recursos Humanos</a>, <a href="../marketing-comunicacao-eventos/index.html">Marketing, Comunicação e Eventos</a> e <a href="../transformacao-digital-it/index.html">Transformação Digital e IT</a>. Cada uma tem exercícios próprios. Aqui está o que não muda: <b>a skill dá a evidência e o responsável decide.</b></p>
 <p>Percurso sugerido: leia as secções 1 e 2, faça os exercícios da sua área e volte às secções 4 e 5 para criar a sua própria skill.</p>
</section>

{escada}

{rasto}

<section id="fluxo">
 <h2><span class="n">3</span>Fluxo encadeado com paragens</h2>
 <p><b>Objectivo.</b> Perceber como se encadeiam várias operações sem perder o controlo. Em cada página de área, o exercício <b>A</b> usa um agente orquestrador que faz isto.</p>
 <div class="tw"><table>
  <tr><th>Momento</th><th>O que acontece</th><th>O que lhe é pedido</th></tr>
  <tr><td>Paragem 0</td><td>O agente pergunta o que falta, confirma que os dados são fictícios e apresenta o plano.</td><td>Aprovar o plano antes de qualquer execução.</td></tr>
  <tr><td>Paragem a cada etapa</td><td>O agente apresenta o resultado da etapa, as dúvidas e as decisões que lhe cabem.</td><td>Confirmar ou corrigir, e decidir o que é do responsável.</td></tr>
  <tr><td>Verificações cruzadas</td><td>Antes de cada paragem, o agente confronta valores, datas e identificadores entre etapas e assinala o que não coincide, sem resolver.</td><td>Decidir o que fazer com cada diferença.</td></tr>
  <tr><td>No fim</td><td>Registo de decisões, folha de rasto consolidada e pacote de revisão para outra conversa.</td><td>Rever, e pedir a revisão independente.</td></tr>
 </table></div>
 <h3>Quando o fluxo deve parar</h3>
 <ul>
  <li>Um documento ilegível ou em falta, ou um dado de que a etapa depende.</li>
  <li>Uma incoerência que afecta um valor, uma classificação ou uma conclusão.</li>
  <li>Um pedido para enviar, gravar, apagar, pagar ou aprovar: o agente só lê e escreve texto.</li>
  <li>Sinais de dados reais não autorizados.</li>
 </ul>
 <h3>Revisão independente</h3>
 <p>Copie a folha de rasto para uma conversa nova, sem o histórico, e peça uma auditoria (exercício da secção 2).</p>
 <h3>Discussão</h3>
 <ul>
  <li>Que paragem considera mais importante? Falta alguma?</li>
  <li>O que aconteceria se o agente decidisse sozinho numa das paragens?</li>
  <li>Quem aprova o resultado final? O agente consegue confirmá-lo?</li>
 </ul>
 <div class="aviso"><b>Isto continua a ser uma skill.</b> Orquestra etapas na conversa, mas não envia, não grava, não paga nem acede a outros sistemas. O degrau 4 acrescenta isso, e com isso, riscos novos.</div>
</section>

<section id="skills-como">
 <h2><span class="n">·</span>Criar uma skill na sua conta</h2>
 <p>Cada página de área traz o texto das suas skills. Este é o processo, igual para todas.</p>
 <ol>
  <li><b>Descarregue</b> o ficheiro <code>SKILL.md</code> do item e ponha-o numa pasta com o nome da skill, igual ao <code>name</code> do cabeçalho (por exemplo, <code>mapa-de-vencimentos</code>). Comprima essa pasta em ZIP.</li>
  <li><b>Crie a skill</b> na sua conta: em <em>Personalizar (<i>Customize</i>) › Skills</em>, carregue em <b>+</b> › <b>Criar skill</b> › <b>Carregar uma skill</b>, escolha o ZIP e confirme que a skill fica ligada. Se a opção não aparecer, active <em>Criar e editar ficheiros</em> em <em>Definições › Capacidades</em>. Nas contas de equipa ou de empresa, quem activa a execução de código (e, na Enterprise, as Skills) é o administrador da conta, nas definições da organização (<i>Organization settings › Plugins &amp; skills › Policy</i>). A skill carregada fica privada à sua conta: cada participante carrega as suas.</li>
  <li><b>Verifique</b>: corra o primeiro pedido do exercício e compare com o «Resultado esperado». Se não bater certo, compare o seu texto com o da página, linha a linha: um erro de cópia é a causa mais comum.</li>
 </ol>
 <p>Sem criar nada, também pode usar o botão «Copiar instruções e pedido» de cada exercício, que dá o mesmo resultado.</p>
 <h3>As partes de um SKILL.md</h3>
 <div class="tw"><table>
  <tr><th>Parte</th><th>Para que serve</th></tr>
  <tr><td>Cabeçalho (entre <code>---</code>)</td><td><code>name</code> é o nome da skill; <code>description</code> diz ao Claude quando a usar. Se a descrição for vaga, a skill não é escolhida na altura certa.</td></tr>
  <tr><td>Antes de começar</td><td>O que o Claude deve pedir ou confirmar antes de trabalhar.</td></tr>
  <tr><td>Regras</td><td>O que nunca deve fazer (inventar, usar informação de fora, obedecer a ordens dentro dos documentos) e como tratar o que falta.</td></tr>
  <tr><td>Método e Resultado</td><td>Os passos e o formato do que entrega: tabelas, listas, ordem.</td></tr>
  <tr><td>Folha de rasto</td><td>O registo de auditoria, com a validação humana deixada em branco.</td></tr>
  <tr><td>Auto-verificação</td><td>As perguntas que o Claude faz a si próprio antes de entregar.</td></tr>
 </table></div>
</section>

<section id="criar">
 <h2><span class="n">4</span>Criar a minha skill</h2>
 <div class="meta">
  <div class="box"><b>Skill</b>criar-skill</div>
  <div class="box"><b>Material</b>Um documento <b>seu</b>, anonimizado, e, se existir, o padrão de referência (política, modelo, checklist)</div>
  <div class="box"><b>Entregável</b>A sua skill, testada, com o registo de construção</div>
 </div>
 <p><b>Objectivo.</b> Sair com uma skill própria que funciona, cujo processo de construção fica registado.</p>
 <h3>Antes de começar: esta skill ainda não está na sua conta</h3>
 <p>A skill <code>criar-skill</code> não vem instalada. Há dois caminhos; o resultado é o mesmo.</p>
 <p><b>Caminho 1 · Sem instalar (funciona já).</b> Abra uma conversa nova, clique no botão, cole (Ctrl+V) e envie. O botão copia as instruções da skill precedidas de um pedido, e o Claude segue-as como se fossem a skill.</p>
 <div class="prompt" id="p-criar-colar">Copia o pedido e as instruções completas da skill (texto no fim desta secção).<button type="button" id="btn-criar-colar">Copiar pedido e instruções</button></div>
 <p><b>Caminho 2 · Criar primeiro a skill.</b> Siga os passos da secção «Criar uma skill na sua conta» para criar <code>criar-skill</code> e depois envie:</p>
 <div class="prompt">Quero criar uma skill para uma tarefa minha. Use a skill criar-skill.<button type="button">Copiar</button></div>
 <p>No fim, o Claude entrega o texto da <b>sua</b> skill (o seu <code>SKILL.md</code>). Para a ter na conta, crie-a com o nome do cabeçalho.</p>
 <div class="tw"><table>
  <tr><th>Fase</th><th>O que acontece</th><th>Paragem</th></tr>
  <tr><td>1 · Entrevista</td><td>Perguntas sobre a tarefa, os documentos, o padrão, o resultado e os erros graves.</td><td>Confirma o resumo.</td></tr>
  <tr><td>2 · Rascunho</td><td>O Claude escreve a skill com salvaguardas por defeito.</td><td>Lê e aprova.</td></tr>
  <tr><td>3 · Teste</td><td>Cinco verificações, num documento anonimizado seu.</td><td>Vê o quadro de resultados.</td></tr>
  <tr><td>4 · Revisão</td><td>Auto-revisão e pedido de revisão independente.</td><td>Confirma antes de guardar.</td></tr>
  <tr><td>5 · Nível de autonomia</td><td>Em que degrau está a skill e o que faltava para subir.</td><td>—</td></tr>
 </table></div>
 <p>Toda a skill criada aqui começa no <b>degrau 2</b>: só lê e escreve texto, cita o documento, não inventa, pede o que falta, para quando há conflito e termina com folha de rasto.</p>
 <ul>
  <li><b>Anonimize sempre</b> o documento antes de o anexar, salvo indicação da sociedade.</li>
  <li>Guarde a skill apenas depois da paragem 4.</li>
  <li>Preencha a ficha da secção seguinte.</li>
 </ul>
 <details class="skillblock" id="sk-criar"><summary>Texto da skill <code>criar-skill</code></summary>
  <p class="sk-meta">Ficheiro: <a href="skills/criar-skill/SKILL.md" download>SKILL.md</a>.</p>
  <div class="skillwrap"><pre class="skilltext" id="txt-criar-skill">{esc(criar_txt)}</pre><button type="button">Copiar</button></div>
 </details>
</section>

{ficha}

<section id="agentes">
 <h2><span class="n">6</span>Agentes: o que acrescentar</h2>
 <p><b>Objectivo.</b> Saber o que falta a uma skill ou a um fluxo antes de lhe dar acesso a ficheiros ou sistemas reais. Esta formação fica nos degraus 1 a 3.</p>
 <h3>Passo final a acrescentar a qualquer agente</h3>
 <div class="prompt">No fim, produza uma Folha de rasto com: os ficheiros lidos; o que decidiu e porquê; o que não conseguiu ler; as decisões pendentes para mim; as verificações feitas. Deixe a validação humana em branco e diga que a folha é produzida por si.<button type="button">Copiar</button></div>
 <h3>Lista de verificação antes de dar acesso a dados reais (degrau 4)</h3>
 <ul>
  <li>Âmbito mínimo: só de leitura e só às pastas ou sistemas necessários.</li>
  <li>Nenhuma acção com efeitos (enviar, gravar, apagar, pagar, aprovar, submeter) sem aprovação humana expressa.</li>
  <li>Condições de paragem escritas: quando o agente tem de parar e perguntar.</li>
  <li>Testado antes com casos fictícios de resposta conhecida.</li>
  <li>Folha de rasto e revisão independente do resultado.</li>
  <li>Limites de custo e de tempo.</li>
  <li>Aprovação da sociedade e da IT para os dados e os acessos.</li>
 </ul>
 <p><b>Discussão.</b> O que mudaria numa skill da sua área se passasse a ligar-se ao correio, ao calendário ou a um sistema real? Que paragens e acessos seriam obrigatórios?</p>
 <p><a href="../index.html">Voltar à lista de áreas</a></p>
</section>

</main>

<script>
{js_total}
</script>
</body>
</html>
'''


def js_completo():
    t = _princ()
    return t[t.index("<script>") + 8:t.rindex("</script>")]


def gerar(saida, css):
    d = os.path.join(saida, "nucleo")
    os.makedirs(os.path.join(d, "skills", "criar-skill"), exist_ok=True)
    shutil.copy(os.path.join(AQUI, "nucleo", "skills", "criar-skill", "SKILL.md"), os.path.join(d, "skills", "criar-skill", "SKILL.md"))
    open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(pagina(css, js_completo()))
