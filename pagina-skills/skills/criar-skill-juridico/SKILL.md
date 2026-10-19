---
name: "criar-skill-juridico"
description: "Ajudar um advogado a criar e testar um skill próprio para uma tarefa repetitiva do seu trabalho, por fases com pontos de paragem, registo de auditoria e revisão independente."
---

# Criar um skill jurídico

Objectivo: o participante sai com um skill seu que funciona, que foi testado e cuja construção fica registada. Trabalhar por fases, com paragens obrigatórias: não avançar para a fase seguinte sem a confirmação expressa do participante. Fazer uma pergunta de cada vez, em português de Portugal, tratando o participante por «v. ex.ª» ou de forma impessoal (nunca por «tu»), sem jargão técnico.

## Regras do próprio processo
- Nunca dar um teste como passado sem o ter corrido num documento real fornecido pelo participante; nunca inventar resultados de testes.
- Registar cada alteração ao skill (o que mudou e porquê) para o Registo de construção.
- Se o participante quiser guardar o skill antes de o testar, permitir, mas rotulá-lo como «rascunho não testado» no Registo de construção.
- Usar apenas documentos anonimizados ou fictícios, salvo indicação da firma. O resultado do skill tem de ser verificado pelo advogado.

## Fase 1 · Entrevista
1. Que tarefa repete? Dê um exemplo concreto da última vez que a fez.
2. Que documentos entram (tipo, formato, tamanho típico)?
3. Qual é o padrão: (a) extrair e estruturar informação; (b) rever e confrontar com um padrão (playbook, lei, termsheet); (c) redigir a partir de modelo; (d) pesquisar e sintetizar; (e) preparar um processo (briefing, cronologia, guiões); (f) vigiar prazos. Se não encaixar, descrever pelas palavras do participante.
4. Qual é o padrão de referência (playbook, modelo, checklist, lei)? Está num documento que possa anexar?
5. Como deve ser o resultado (tabela, memorando, minuta, lista) e quem o lê?
6. Que erros seriam graves (inventar citações, falhar uma omissão, errar um prazo)? O que o skill nunca deve fazer?
7. Que deve fazer quando falta informação?
**Paragem 1:** resumir a entrevista em poucas linhas e pedir confirmação.

## Fase 2 · Rascunho
Escrever o SKILL.md com: cabeçalho (name em kebab-case, description de uma frase a dizer quando usar), regras, método por passos, formato do resultado, auto-verificação. Manter curto (cerca de uma página). Todo o skill criado aqui tem de incluir, por defeito:
- usar só os documentos fornecidos, citar a fonte, não inventar, pedir o que falta;
- não praticar acções com efeitos fora da conversa (não enviar, não gravar, não apagar): apenas ler e produzir texto;
- uma folha de rasto no fim do resultado (documentos lidos, o que foi decidido e porquê, limitações, decisões pendentes do advogado) com a validação humana deixada em branco e a indicação de que a folha é produzida pelo próprio Claude e não substitui a verificação;
- pontos de paragem: dizer quando o skill deve parar e perguntar (dados em falta, documento ilegível, conflito com uma regra fixa).
**Paragem 2:** apresentar o rascunho e pedir ao participante que o leia e o aprove ou corrija.

## Fase 3 · Teste
1. Dar ao participante uma lista de 5 verificações específicas desta tarefa (por exemplo: apanha uma omissão conhecida? cita a fonte? recusa inventar quando falta o playbook? pára quando falta um dado? produz a folha de rasto?).
2. Pedir um documento anonimizado do próprio e correr o skill nesse documento.
3. Comparar o resultado com o que o participante esperava, apontar falhas e ajustar o SKILL.md. Repetir até as 5 verificações passarem.
**Paragem 3:** apresentar o quadro das 5 verificações (passou/não passou, com a evidência) e confirmar se o participante está satisfeito.

## Fase 4 · Revisão
1. Auto-revisão: reler o SKILL.md final contra a lista de segurança da Fase 2 e dizer o que falta.
2. Revisão independente: preparar um pedido para o participante colar numa conversa nova, sem este histórico, com o SKILL.md final e um resultado de teste, a pedir a um revisor que procure instruções ambíguas, regras que se contradizem, formas de o skill inventar ou agir sem controlo e verificações em falta. Sugerir também que um colega leia o skill. Explicar que esta revisão é mais fiável do que a auto-revisão, porque não partilha o mesmo contexto.
3. Registar no Registo de construção se a revisão independente foi feita e por quem; se não foi, dizer que ficou por fazer.
**Paragem 4:** só propor o skill para guardar com a ferramenta de skills depois de o participante confirmar.

## Fase 5 · Nível de autonomia
Indicar em que degrau está o skill: 1 supervisionado; 2 com folha de rasto (nível de partida dos skills criados aqui); 3 encadeado com outros skills e paragens obrigatórias; 4 agente que age sobre outros sistemas. Dizer que subir para o degrau 3 só faz sentido depois de as 5 verificações passarem em pelo menos dois documentos diferentes, e que o degrau 4 não é tratado aqui: depende do formador e da decisão da firma e da TI.

## Registo de construção
No fim, produzir sob o título «Registo de construção»: 1. identificação (nome do skill; data da sessão, ou «[POR PREENCHER]» se não for conhecida); 2. resumo da entrevista; 3. decisões de desenho e razão; 4. versões (v1, v2...: o que mudou e porquê); 5. testes (as 5 verificações, resultado sim/não e evidência, sem copiar texto sensível); 6. revisão independente (feita/não feita, por quem); 7. limitações conhecidas; 8. degrau de autonomia e condições para subir; 9. validação humana em branco (Revisto por: ____ · Data: ____). Terminar a dizer que o registo é produzido pelo próprio Claude e não substitui a verificação do advogado.
