## 1. Caça-Palavras em Atividades
- Subir 4 imagens anexas via `lovable-assets`:
  - `Icone Caça Palavras.png` → ícone da atividade
  - `Icone ligue as cores.png` → substitui ícone atual de "Ligue as cores"
  - `Caça Palavras-1/2/3.jpg` → conteúdo da atividade
- Em `src/pages/Atividades.tsx`:
  - Adicionar nova atividade "Caça-Palavras" ao menu orbital com o novo ícone
  - Trocar ícone de "Ligue as cores" pelo novo
- Criar componente `WordSearchActivity` que mostra as 3 imagens (rotação diária), com seleção de células arrastando para "circular" palavras, validação automática, e recompensa em moedinhas ao completar cada uma.

## 2. Cabeçalhos full-width
- Em `src/components/PageHeader.tsx`: remover qualquer `max-w-*` / paddings laterais que limitam a largura. Header passa a ocupar 100% da viewport (igual ao da página "Atividades Educacionais").
- Verificar páginas que envolvem o header em containers (`Album`, `LemosPlay`, `Atividades`, `Biblia`, `Devocionais`, etc.) e mover o `PageHeader` para fora do container central quando necessário.

## 3. Login / Cadastro redesenhados
- Reescrever `src/pages/Login.tsx` no estilo da imagem anexa:
  - Card claro centralizado (bg creme), borda fina arredondada
  - Título "Login" / "Criar conta"
  - Campos E-mail e Senha (com olho para mostrar/ocultar)
  - Checkbox "Manter-me logado" + link "Esqueci minha senha"
  - Botões "ENTRAR" (preto sólido) e "CRIAR UMA CONTA" (outline)
  - Divisor "Ou entre/cadastre-se com a sua conta do:" + botão Google
- Manter o cadastro completo (nome, data, papel, avatar) num segundo passo após "CRIAR UMA CONTA".
- **Atalho de admin**: adicionar pequeno botão "⚙ Admin" no rodapé do card que leva para `/config` (após validar credencial admin local).
- **Atalhos para páginas configuráveis**: na página `/config` (já existente), adicionar uma seção "Atalhos" com links rápidos para configurar cada página principal (Atividades, Álbum, LemosPlay, Bíblia, Devocionais, Pedidos de Oração).

## 4 + 5. Álbum: 104 figurinhas (13 × 8) refeitas
Estado atual: `src/data/stickers.ts` tem 12 categorias × 8 = 96. Falta 1 categoria para chegar a 13 × 8 = 104.

- Adicionar 13ª categoria: **"Profetas e Sábios"** (8 figurinhas).
- Renumerar todas (1–104) globalmente.
- Cada figurinha:
  - Estilo 3D Pixar/cartoon, infantil e religioso
  - Imagem ocupa 100% do recipiente (object-cover sem distorção, pois geramos no aspect ratio do card)
  - Moldura temática por categoria (cor + ornamento) — ex.: Criação=céu/nuvens, Heróis=dourado, Milagres=ciano brilhante, Parábolas=rosa pergaminho, Animais=verde folha, Momentos=âmbar estrelado, Louvores=roxo musical, Versículos=violeta pergaminho, Antigo Test.=marrom pedra, Novo Test.=azul vitral, Missões=teal mapa, Ultra Raras=fúchsia coroa, Profetas=cinza-ouro
  - Sobreposição no card mostrando: **nº** (canto superior), **título** (rodapé), **selo de raridade** (NORMAL / RARA / ESPECIAL)
- **Geração de imagens (custo)**: 104 imagens via `imagegen--generate_image` (tier `fast`) é caro e lento. Proponho:
  - **Opção A**: gerar **13 ilustrações de moldura/template** (uma por categoria) e renderizar a arte de cada figurinha por cima usando os emojis/títulos existentes em estilo cartoon CSS (rápido e barato).
  - **Opção B**: gerar as 104 figurinhas individualmente (mais bonito, porém demorado e mais caro — ~5–10 min de geração).
- Em `src/pages/Album.tsx`: reescrever o card para o novo layout (moldura + número + título + selo) e usar `object-cover` já que as imagens serão geradas no formato certo.

## Confirmação necessária
Antes de começar o item 5, preciso confirmar:
- **(a)** Vai a Opção A (moldura por categoria + arte estilizada por figurinha, rápido) ou Opção B (104 imagens individuais geradas, mais caro/demorado)?
- **(b)** Confirma a 13ª categoria como "Profetas e Sábios", ou prefere outro tema?

Os itens 1, 2 e 3 começo imediatamente após sua aprovação do plano; o item 4/5 aguarda as respostas (a) e (b).
