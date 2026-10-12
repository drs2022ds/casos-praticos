from playwright.sync_api import sync_playwright
import sys
B="http://localhost:3111"; S="/tmp/claude-0/-home-claude/bb83810b-60c9-532a-95ed-f827a3c75681/scratchpad/"
NOTA='Marta, a nossa conclusão preliminar é que a cessação imediata e a suspensão das 18:00 não parecem cumprir o contrato: a resolução exige notificação e 10 dias úteis para sanar (cl. 11.2) e a suspensão só pode visar montantes não contestados (cl. 7.4). A LC 7996 só vence a 30 de setembro e a LC 7841 foi paga a 15. A incerteza é saber se a Linha Clara recebeu o pagamento. Diligência urgente: enviar hoje a prova.'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome' if False else None)
    pg=b.new_page(viewport={'width':1100,'height':900}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.goto(B+'/caso?c=atlas'); pg.wait_for_selector('#nota-txt')
    print('disabled antes:',pg.locator('button.primary').is_disabled(),'| fuga:', 'Análise preparada' in pg.inner_text('body'))
    pg.fill('#grupo','Grupo 7'); pg.fill('#nota-txt','curto demais')
    print('hint:',pg.inner_text('.hint'))
    pg.fill('#nota-txt',NOTA); print('hint:',pg.inner_text('.hint'),'| disabled:',pg.locator('button.primary').is_disabled())
    pg.screenshot(path=S+'s0.png')
    pg.click('button.primary'); pg.wait_for_selector('text=Análise preparada pelo Claude'); pg.screenshot(path=S+'s1.png')
    pg.click('button:has-text("A minha nota")'); pg.screenshot(path=S+'s2.png',full_page=True)
    pg.click('button:has-text("A sala")'); pg.wait_for_selector('text=O que as notas cobrem'); pg.screenshot(path=S+'s3.png',full_page=True)
    pg.reload(); pg.wait_for_selector('text=Análise preparada pelo Claude'); print('reload mantém revelação')
    # formador
    pg.goto(B+'/formador'); pg.fill('#key','formador'); pg.click('#enter'); pg.wait_for_selector('text=O que as notas cobrem'); pg.screenshot(path=S+'s4.png',full_page=True)
    # telemóvel
    m=b.new_page(viewport={'width':390,'height':800}); m.goto(B+'/caso?c=horizonte'); m.wait_for_selector('#nota-txt')
    print('overflow mobile:', m.evaluate('document.documentElement.scrollWidth>innerWidth'))
    m.screenshot(path=S+'s5.png')
    print('erros:',errs)
    b.close()
