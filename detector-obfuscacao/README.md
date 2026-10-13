# Detector de Obfuscação

Ferramenta de triagem de textos jurídicos com painel. Assinala linguagem que reduz a clareza sobre o que está demonstrado e argumentos mais fracos do que parecem. É triagem de fragilidades, não prova e não conclui sobre intenção.

Sem dependências. Requer Node 18 ou superior (ou Docker). Para a análise por IA chama a API do Claude com uma chave da firma.

## Como funciona

- O browser mostra o painel e faz a anonimização e a análise de densidade (sem IA) localmente.
- Para a análise por IA, envia ao servidor só o modo de leitura, os parágrafos e os documentos de apoio.
- O **servidor** constrói o prompt (`lib/prompt.js`), chama a API em streaming, valida e devolve o JSON ao painel. O browser não pode enviar instruções arbitrárias à API.
- A chave da API só existe no servidor. O texto não é guardado; só se registam metadados.

## Configuração

Tudo por variáveis de ambiente. Ver `.env.example`, que também serve de lista das decisões a tomar pela firma (chave, acesso, limites, alojamento). Há uma ficha para as decisões em `Detector_Ficha_de_Decisoes_para_a_Firma.docx`.

| Grupo | Variáveis |
|---|---|
| Chave e modelos | `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `DETECTOR_MODEL`, `DETECTOR_MODEL_DEEP`, `DEEP_ENABLED` |
| Acesso | `AUTH_MODE` (`none`, `code`, `proxy`), `ACCESS_CODES`, `TRAINER_CODES`, `PROXY_USER_HEADER`, `ALLOWED_EMAIL_DOMAINS`, `TRAINER_USERS` |
| Limites | `MAX_INPUT_BYTES`, `MIN_CHARS`, `MAX_OUTPUT_TOKENS`, `PER_USER_DAILY`, `GLOBAL_DAILY`, `GLOBAL_DAILY_TOKENS`, `MAX_CONCURRENT`, `REQUEST_TIMEOUT_MS` |
| Aviso e registos | `PRIVACY_NOTICE`, `LOG_USERS` |

### Modos de acesso

- `none`: sem controlo. Só para desenvolvimento e demonstração.
- `code`: o participante introduz um código (cabeçalho `x-access-code`). A quota é por código; dê um a cada pessoa para ter quotas individuais.
- `proxy`: o servidor está atrás do SSO da firma, que envia o e-mail num cabeçalho (`PROXY_USER_HEADER`). **Só usar quando a aplicação não for acessível sem passar pelo proxy.** Caso contrário, o cabeçalho pode ser forjado.
- OIDC directo na aplicação não está incluído. Pode fazer-se no proxy da firma.

### Limites

Os contadores (por pessoa, globais, tokens, simultâneos) estão em memória: servem a um servidor único e reiniciam com ele. Em ambientes sem estado (Vercel) são apenas indicativos. **O limite de gasto definido na consola da Anthropic é o limite de referência.**

## Alojamento

**Servidor da firma**

```
cp .env.example .env   # preencher
npm start              # http://localhost:3000
```

ou com Docker:

```
docker build -t detector .
docker run --env-file .env -p 3000:3000 detector
```

Colocar atrás de HTTPS (proxy inverso da firma).

**Vercel**

Importar o repositório e definir as variáveis no projecto. `vercel.json` já define o reencaminhamento de `/api/*` e `maxDuration` de 300 segundos para a função (confirmar que o plano o permite; uma análise profunda pode demorar mais de um minuto). Não renomear `lib/standalone.js` para `server.js` na raiz: o Vercel detectaria esse ficheiro como ponto de entrada.

## Testes

```
npm test                # servidor, com uma API simulada (50 verificações)
python3 test/ui.py      # browser (requer Playwright e Chromium)
```

`test/fixtures/artefacto-original.html` é o artefacto original, usado para verificar que o prompt do servidor é idêntico ao que o artefacto enviava.

Ainda não foi testado com uma chave real. O primeiro passo da instalação é uma análise do exemplo «Horizonte» com a chave da firma.

## Limitações conhecidas

- A leitura de `.docx` e `.pdf` usa duas bibliotecas carregadas de `cdn.jsdelivr.net`. Se a rede da firma as bloquear, alojá-las no servidor e ajustar a política de segurança de conteúdos (CSP) em `lib/standalone.js` e `vercel.json`. Colar o texto funciona sempre.
- Os tipos de letra vêm do Google Fonts. Sem acesso, o painel usa tipos de letra do sistema.
- Amazon Bedrock e Google Vertex precisam de um adaptador (formato de pedido e autenticação diferentes). Não incluído.
