# Plano de execução

Executarei nesta ordem, uma frente por vez, para você validar cada uma antes de seguir.

---

## 1) Correções de mobile e tablet (base para tudo)

Auditoria e correção geral de layout responsivo em todas as páginas principais:

- **Home (`src/pages/Index.tsx`, `CategoryOrbit`, `OrbitMenu`):** o menu orbital estoura em telas <400px. Vou usar `clamp()` para o raio da órbita e ajustar tamanho dos ícones por viewport (baseado em `useIsMobile`).
- **Header e KwaiSideActions:** garantir que botões não fiquem sobre o conteúdo em tablet (768–1024px).
- **Lemos Play (`src/pages/LemosPlay.tsx`, `VideoCentralLayout`):** player travando no mobile — vou desativar autoplay agressivo, adicionar `playsInline`, `preload="metadata"` e lazy-loading das capas com `loading="lazy" decoding="async"`.
- **Atividades:** grids que hoje quebram (`grid-cols-3` fixo) → `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`.
- **Performance de imagens:** capas do Lemos Play e ícones grandes ganham `loading="lazy"`, `decoding="async"`, e `fetchpriority` só na primeira dobra.

**Como vou verificar:** rodar Playwright em 3 viewports (390×844 iPhone, 820×1180 iPad, 1280×800 desktop) e comparar screenshots.

---

## 2) Lemos Play — reduzir para 5 categorias

Novas categorias exclusivas: **Gênesis · Jesus · Mini séries · Músicas · Louvores**.

Regra de migração conforme você escolheu ("mover só o que é de Jesus, descartar o resto"):

- **Gênesis:** mantém vídeos com `section === "Gênesis"` (Criação, Adão e Eva, Noé, Torre de Babel, Dilúvio, Abraão, Esaú e Jacó, José do Egito).
- **Jesus (categoria nova):** consolida Vida de Jesus + Milagres de Jesus + Parábolas + Nascimento + Batismo + Ele Vive + Lázaro + João Batista + o filme "E se ele fosse um de nós".
- **Mini séries:** mantém apenas as séries multi-parte existentes (10 Mandamentos, Davi e Golias, Moisés, Jó, Prova de Fogo, Filho Pródigo — as que já estão em `cfg.series`).
- **Músicas** e **Louvores:** mantêm-se como estão.
- **Descartados:** Êxodo, Jó (filme avulso — a série de Jó fica em Mini séries), Daniel, Profetas, Apocalipse, Jonas, e qualquer outro fora dessas 5 categorias.

Mudanças de código:
- `src/data/lemosPlayConfig.ts`: reescrever `defaultConfig()` com só essas 5 categorias, bump para `v38`.
- `src/pages/LemosPlay.tsx`: abas fixas nas 5 categorias.
- `LemosPlayAdminPanel.tsx`: tabs reduzidas e `SECTION_ORDER` atualizado.
- Nada é apagado dos arquivos-fonte — só sai da config default. Se você quiser algum removido de volta, dá para mover pelo Admin.

---

## 3) Atividades — reorganização + imagens novas

- **Novas ilustrações geradas** (contornos simples, poucos detalhes, ideais para colorir): vou gerar 6–8 PNGs com fundo branco e linhas pretas grossas usando o `imagegen` tier `fast`, salvar em `src/assets/atividades/` via `lovable-assets`.
- **Performance:** imagens novas serão otimizadas (1024×1024 max, PNG leve) e todas com `loading="lazy"` + `decoding="async"`. Preload só da primeira.
- **Bug "nada acontece ao terminar de pintar":** hoje falta o gatilho de conclusão. Vou adicionar detecção (contagem de pixels não-brancos ≥ 95% da área colorível) → dispara celebração + moedas + modal "Parabéns!" com botão "Próxima atividade".
- **Reorganização visual:** grid mais limpo (Colorir · Ligar pontos · Caça-palavras · 7 erros), cada uma com ícone próprio.

---

## 4) Página inicial — Murais (Reflexão, Motivação, Sabedoria)

- Nova seção **"Murais"** na home, entre a órbita e o conteúdo secundário.
- 3 quadros lado a lado no desktop, empilhados no mobile, todos centralizados.
- Cada mural usa a imagem que você anexou como moldura de fundo:
  - Mural da Reflexão → quadro preto com iluminação (imagem 2)
  - Mural da Motivação → moldura de madeira com fundo verde-azulado (imagem 1)
  - Mural Sabedoria → quadro branco com sofá turquesa (imagem 3)
- Frases centralizadas dentro de cada quadro com tipografia adequada ao fundo (branco no Reflexão, escuro no Sabedoria, claro no Motivação).
- **Editor no Admin:** nova aba "Murais" no `IndexAdminPanel` onde você edita array de frases por mural. Salva em `localStorage` (mesma pattern do resto do site) + rotação diária opcional (uma frase por dia por mural) — me confirma se quer rotação ou uma frase fixa por mural.
- Placeholders iniciais: "Adicione sua frase aqui no painel Admin".

---

## 5) Segurança (auto-fix obrigatório)

Corrigir a política do bucket `lemos-play-videos` para exigir `authenticated` em vez de `public`. Faço junto com a frente 2.

---

## Detalhes técnicos

- Nenhum arquivo auto-gerado será tocado (`supabase/client.ts`, `types.ts`, `.env`).
- Nenhuma migration de tabela nova — tudo em `localStorage` como o resto do admin.
- Config keys serão bumpadas (`v38`) para forçar reload.
- Verificação final com Playwright em 3 viewports + inspeção visual dos screenshots.

---

**Confirma que posso seguir?** Ou quer que eu comece só por uma frente específica primeiro (recomendo: 1 → 2 → 4 → 3, porque atividades demora mais por gerar imagens)?