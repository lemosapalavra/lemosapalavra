# Redesign visual do Lemos a Palavra

Evolução visual e de navegação do site atual. Nada de reconstrução: login, banco, vídeos, atividades, álbum, orações, histórias e área administrativa continuam exatamente como estão.

## O que muda

### 1. Nova página inicial
Uma Home nova, moderna e arejada, na ordem:
1. Cabeçalho
2. Banner principal (hero) com ilustração do Jesus com as crianças, "Bem-vindo ao Lemos a Palavra!", subtítulo "Conheça Jesus, aprenda a Palavra e divirta-se!" e botão "COMEÇAR AGORA" levando para Assista
3. "O que você quer fazer?" — seis cartões grandes: Assistir, Histórias Bíblicas, Atividades, Oração, Devocionais, Álbum
4. Destaques — um conteúdo principal grande + cartões menores, usando os vídeos e capas reais já cadastrados
5. Atalhos "Vamos brincar?", "Vamos orar?" e "Para a família"
6. "Continue de onde parou" — aparece só quando existe progresso real do usuário; sem isso, fica oculta
7. Pesquisa de conteúdo
8. Nossa missão + rodapé

A Home atual (menu em órbita) fica preservada no código; a nova vira a versão padrão, e o seletor de versão que já existe nas configurações continua funcionando, agora com a opção "Nova Home".

### 2. Cabeçalho e navegação
- Desktop: logo à esquerda, menu INÍCIO · ASSISTA · ATIVIDADES · ORAÇÃO · DEVOCIONAIS · ÁLBUM · FAMÍLIA, ícone de pesquisa e área do usuário à direita.
- Celular: logo equilibrada, botão de menu, pesquisa acessível.
- Barra fixa inferior no celular: Início · Assistir · Atividades · Oração · Menu.
- Tudo que é administrativo continua invisível para visitantes.

### 3. Pesquisa
Nova página/painel de busca que procura nos conteúdos reais do site (vídeos, histórias, atividades, devocionais, orações, figurinhas) e mostra resultados agrupados por tipo, com link direto.

### 4. Área "Para a família"
Nova página com conteúdos para pais, mães, avós e responsáveis: momentos em família, oração em família, leitura bíblica e dicas. Entra no menu e no rodapé.

### 5. Identidade visual unificada
Mesma linguagem (cantos arredondados, sombras suaves, cartões, cores quentes atuais + azul escuro no rodapé) aplicada em Assista, Atividades, Oração, Devocionais/Histórias, Álbum e Família — sem mexer nas mecânicas dessas páginas:
- Álbum: cabeçalho de coleção com volume, progresso e contagem de figurinhas.
- Atividades: apresentação em cartões de descoberta.
- Oração: orações agrupadas por situação (bom dia, antes de dormir, agradecimento, família, escola, pedido especial).
- Devocionais: cartão de mensagem do dia com versículo e compartilhar.

### 6. Rodapé
Rodapé azul escuro com logo, "Deus Fonte de Amor", links das seções, a frase do projeto e o ícone de compartilhar. Só links e redes que já existem de verdade.

### 7. LIA
A LIA continua como guia, com falas curtas em pontos estratégicos da nova Home, sem exagero.

### 8. Detalhes finais
- Animações suaves e leves, respeitando quem prefere menos movimento.
- Imagens com carregamento sob demanda; nenhum vídeo pesado carregado na Home.
- Contraste, textos legíveis, botões grandes, navegação por teclado, textos alternativos nas imagens.
- Título, descrição e prévia de compartilhamento revisados.

## Nota técnica
Novos componentes: `SiteHeader`, `MobileTabBar`, `SiteFooter`, `HeroBanner`, `QuickActions`, `HighlightsSection`, `ContinueWatching`, `SearchPanel`, além de `src/pages/Familia.tsx` e `src/lib/searchIndex.ts`. A Home nova entra como `IndexV3` seguindo o mecanismo de versão já existente em `siteVersion.ts`. Rotas, `supabase`, hooks de moedas, mural, `useIsAdmin` e `AdminOnly` permanecem intocados.

## Verificação
Typecheck, testes existentes e conferência com navegador em celular, tablet e desktop: menu, botões, links, imagens, pesquisa, login e áreas administrativas.
