# Tesouros da Palavra — implantação por etapas

## Padrões preservados
- Seis status: Bronze, Prata, Ouro, Esmeralda, Rubi, Diamante.
- Pontos de experiência **permanentes**; moedinhas **gastáveis** no Álbum.
- Conquistas cumulativas: status mais alto inclui os materiais dos anteriores.
- Materiais educativos e bíblicos apropriados para crianças, com download direto quando autorizado.
- Manter identidade visual, LIA, navegação e acessibilidade em celular.
- Os seis ícones ilustrados aprovados na conversa ainda precisam ser enviados individualmente ao repositório antes da substituição das medalhas provisórias.

## O que já está implementado
- Rota `/tesouros`, acessível pelo menu do usuário.
- Catálogo inicial em `src/data/tesourosDaPalavra.ts`.
- Migração `20261023193000_reward_experience.sql`: saldos de XP, eventos únicos, RLS e função `admin_award_experience`.
- Leitura de XP autenticado em `useRewardExperience`. Não concede pontos pelo navegador.
- Downloads desativados até existirem materiais publicados e um sistema seguro de entrega.

## Antes de ativar para o público
1. Aplicar e verificar a migração no banco Lovable Cloud/Supabase; commit no GitHub **não** aplica migração automaticamente em todos os ambientes.
2. Criar mecanismo de validação de conclusão das atividades no servidor e integração de concessão idempotente, sem aceitar pontuação arbitrária do cliente.
3. Criar painel administrativo de materiais e armazenamento privado com URLs assinadas por usuário/status. **Não colocar prêmios exclusivos em /public**: um arquivo público pode ser acessado sem passar pelo desbloqueio visual.
4. Preparar e revisar os arquivos educacionais, direitos autorais, nomes e categorias.
5. Adicionar os ícones finais aprovados, em arquivos separados, e testar em mobile.
6. Testar conta nova, contas existentes, diferentes níveis, bloqueio de download e retorno entre páginas.
