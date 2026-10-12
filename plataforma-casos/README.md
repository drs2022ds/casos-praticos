# Plataforma de casos práticos (Abreu Advogados · Dia 3)

Fluxo do aluno: lê o dossier, escreve uma nota (mínimo 300 caracteres, validado no servidor) e só então o servidor devolve
a análise do Claude, a nota modelo e a comparação com a sala. A análise não está no HTML nem na API pública.

Casos: `atlas` (nota à cliente) e `horizonte` (nota ao conselho). Para adicionar outro: criar `data/cases/<id>.js` e registá-lo em `lib/cases.js`.

## Páginas
- `/` lista de casos · `/caso?c=atlas` fluxo do aluno · `/formador` painel do formador (chave `TRAINER_KEY`)
- Formador: abrir/fechar a comparação aos alunos, esconder nomes dos grupos, apagar notas, exportar CSV.

## Correr localmente
    npm install
    npm test            # API
    npm run dev         # http://localhost:3000 (chave por defeito: "formador"; base de dados em .data/)

## Publicar (Vercel + Postgres)
1. Colocar o código num repositório GitHub e importá-lo na Vercel (sem framework, sem build).
2. Em Storage, criar uma base Postgres (Neon pelo Marketplace) e ligá-la ao projeto: define `DATABASE_URL`.
3. Em Settings, Environment Variables: criar `TRAINER_KEY` com uma chave só sua. Não use a chave por defeito.
4. Fazer deploy. As tabelas criam-se no primeiro pedido. Testar `/api/saude`.

## Antes da sessão
Abra `/formador`, escolha o caso e use "Apagar todas as notas" para limpar ensaios.
