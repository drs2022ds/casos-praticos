import os, subprocess, time, sys, json
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def run(env, port):
    e = dict(os.environ, PORT=str(port), **env)
    return subprocess.Popen(["node", "lib/standalone.js"], cwd=ROOT, env=e, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
mock = subprocess.Popen(["node", "test/mock-api.js"], cwd=ROOT, env=dict(os.environ, MOCK_PORT="4010"), stdout=subprocess.DEVNULL)
time.sleep(1)
base_env = {"ANTHROPIC_API_KEY": "k", "ANTHROPIC_BASE_URL": "http://localhost:4010"}
procs = [mock]
fails = []
def check(cond, msg):
    print(("  ok  " if cond else "  FALHA  ") + msg)
    if not cond: fails.append(msg)

def errs_filter(errs):
    return [e for e in errs if "fonts.g" not in e and "ERR_" not in e and "Failed to load resource" not in e]

try:
    p1 = run(dict(base_env, AUTH_MODE="code", ACCESS_CODES="abc", TRAINER_CODES="mestre"), 3101); procs.append(p1)
    p2 = run(dict(base_env, AUTH_MODE="none"), 3102); procs.append(p2)
    p3 = run({"AUTH_MODE": "none"}, 3103); procs.append(p3)
    time.sleep(1.5)
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        # A: código de acesso
        print("A. Acesso por código")
        ctx = br.new_context(viewport={"width": 1280, "height": 900}, accept_downloads=True); pg = ctx.new_page()
        console = []; pg.on("console", lambda m: console.append(m.text) if m.type == "error" else None); pg.on("pageerror", lambda e: console.append(str(e)))
        pg.goto("http://localhost:3101/"); pg.wait_for_selector("#gate:not([hidden])", timeout=8000)
        check(pg.locator("#inView").is_hidden(), "sem código a vista de entrada está escondida")
        pg.fill("#gateCode", "errado"); pg.click("#gateGo"); pg.wait_for_selector("#gateErr:not([hidden])")
        check("inválido" in pg.inner_text("#gateErr"), "código errado mostra erro")
        pg.fill("#gateCode", "abc"); pg.click("#gateGo"); pg.wait_for_selector("#inView:not([hidden])", timeout=5000)
        check(pg.locator("#gate").is_hidden(), "código certo abre a ferramenta")
        check("servidor da firma" in pg.inner_text("#priv"), "aviso de privacidade vem do servidor")
        pg.click("#ex1"); pg.wait_for_timeout(300)
        check(len(pg.input_value("#txt")) > 3000, "exemplo Horizonte carregado")
        check(pg.locator("#go").is_enabled(), "botão Analisar activo")
        pg.click("#go"); pg.wait_for_selector("#resView .tile", timeout=15000)
        txt = pg.inner_text("#resView")
        check("Motivo 1" in txt or pg.locator(".m").count() >= 4, "resultados renderizados (%d marcas no texto)" % pg.locator(".m").count())
        check(pg.locator(".m.s-alta").count() >= 3, "marcas de gravidade alta no texto anotado")
        pg.click("button.tab:has-text('Achados')") if pg.locator("button.tab:has-text('Achados')").count() else None
        check(pg.locator("table tr").count() >= 6, "tabela de achados com %d linhas" % pg.locator("table tr").count())
        check(pg.locator("text=Cobertura do gabarito").count() == 0, "participante NÃO vê o gabarito")
        with pg.expect_download(timeout=5000) as d:
            pg.click("button:has-text('Exportar relatório')")
        check(d.value.suggested_filename == "triagem-obfuscacao.md", "exportar relatório descarrega .md")
        check(not errs_filter(console), "sem erros de consola: %s" % errs_filter(console))
        ctx.close()
        # A2: formador
        ctx = br.new_context(viewport={"width": 1280, "height": 900}); pg = ctx.new_page()
        pg.goto("http://localhost:3101/"); pg.wait_for_selector("#gate:not([hidden])")
        pg.fill("#gateCode", "mestre"); pg.click("#gateGo"); pg.wait_for_selector("#inView:not([hidden])")
        pg.click("#ex1"); pg.click("#go"); pg.wait_for_selector("#resView .tile", timeout=15000)
        check(pg.locator("text=Cobertura do gabarito").count() == 1, "formador vê o gabarito do Horizonte")
        ctx.close()
        # B: sem controlo, telemóvel
        print("B. Sem controlo de acesso, telemóvel")
        ctx = br.new_context(viewport={"width": 390, "height": 800}); pg = ctx.new_page()
        pg.goto("http://localhost:3102/"); pg.wait_for_selector("#inView:not([hidden])")
        check(pg.locator("#gate").is_hidden(), "sem gate")
        pg.click("#ex2"); pg.click("#go"); pg.wait_for_selector("#resView .tile", timeout=15000)
        w = pg.evaluate("document.documentElement.scrollWidth"); check(w <= 392, "sem scroll horizontal a 390px (largura %d)" % w)
        pg.click("#stop") if pg.locator("#prog").is_visible() else None
        ctx.close()
        # B2: cancelar
        ctx = br.new_context(viewport={"width": 1280, "height": 900}); pg = ctx.new_page()
        pg.goto("http://localhost:3102/"); pg.wait_for_selector("#inView:not([hidden])"); pg.click("#ex1"); pg.click("#go")
        pg.wait_for_selector("#prog:not([hidden])"); pg.click("#stop"); pg.wait_for_selector("#err:not([hidden])", timeout=5000)
        check("interrompida" in pg.inner_text("#err"), "botão Parar interrompe a análise")
        pg.click("#goLocal"); pg.wait_for_selector("#resView:not([hidden]) .par", timeout=5000); check(pg.locator("#resView .par").count() > 5, "densidade sem IA continua a funcionar (%d blocos)" % pg.locator("#resView .par").count())
        ctx.close()
        # C: sem chave
        print("C. Servidor sem chave da API")
        ctx = br.new_context(); pg = ctx.new_page(); pg.goto("http://localhost:3103/"); pg.wait_for_selector("#nosample:not([hidden])", timeout=8000)
        check("chave" in pg.inner_text("#nosample"), "aviso de chave em falta"); check(pg.locator("#go").is_disabled(), "Analisar desactivado")
        pg.click("#ex1"); pg.wait_for_timeout(200); check(pg.locator("#goLocal").is_enabled(), "densidade sem IA disponível")
        ctx.close(); br.close()
finally:
    for p in procs: p.terminate()
print("\n" + ("TUDO OK" if not fails else "FALHAS: %s" % fails)); sys.exit(1 if fails else 0)
