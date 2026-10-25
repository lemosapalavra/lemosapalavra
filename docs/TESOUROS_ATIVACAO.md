# Tesouros da Palavra — ativação segura

Este recurso **não está ativo em produção** apenas por ter sido enviado ao GitHub. O banco e as Edge Functions do Lovable Cloud precisam de implantação no projeto `ptwzwxymilyjscddsaym`.

## Antes de publicar

1. Fazer backup do banco e conferir que `user_points`, `point_events`, `user_achievements` não existem com estruturas conflitantes. Não alterar `profiles`, `user_roles`, `page_analytics` ou tabelas de moedinhas.
2. Aplicar, nesta ordem, as migrações `20261025000000_tesouros_points_foundation.sql`, `20261025000001_tesouros_atomic_awards.sql` e `20261025000002_tesouros_medal_unlocks.sql`.
3. Implantar `supabase/functions/award-quiz-points/index.ts` com verificação de JWT habilitada e credenciais de serviço **apenas no servidor**. Nunca colocar `SUPABASE_SERVICE_ROLE_KEY` no frontend.
4. Regenerar tipos Supabase e compilar a aplicação. Confirmar o som do clique em Aprenda; o arquivo `/audio/click.mp3` precisa existir ou ser ajustado ao arquivo real.
5. Testar com login Google: quiz completo, quiz incompleto, envio repetido, usuário diferente, sem autenticação, tentativa de mudar valores, pontuação, medalhas e moedinhas inalteradas.
6. Integrar e testar os demais jogos com verificações de conclusão no servidor, antes de anunciá-los como premiados.
7. Só então revisar e integrar PR #2 à `main`.

## Limitações atuais

- Quiz Bíblico: 50 pontos uma única vez por usuário na versão `quiz-v1`, após validação das cinco respostas no servidor. As perguntas são públicas, portanto a validação impede manipulação direta do saldo, mas não garante que o jogador não tenha consultado respostas.
- Memória, Quebra-Cabeça, Construtor de Palavras e Quem Sou Eu ainda não atribuem pontos de experiência; as moedinhas seguem a lógica antiga.
- Os níveis são Bronze (0), Prata (100), Ouro (300), Esmeralda (600), Rubi (1000), Diamante (1500).
- Não há acesso à implantação do Lovable Cloud neste conector GitHub; GitHub não executa migrações automaticamente sem pipeline configurado.
