# Corrigir acesso e melhorar orientação visual

## Objetivo
Concluir os seis ajustes solicitados sem alterar a identidade atual do site.

## Implementação
1. **Login e cadastro por celular**
   - Normalizar o celular de forma idêntica no cadastro e no login.
   - Tratar contas já existentes sem repetir tentativas silenciosas de cadastro.
   - Validar a sessão antes de abrir a página inicial e exibir mensagens claras para conta existente ou dados inválidos.
   - Manter nome e celular obrigatórios no login e nome, faixa etária, celular e avatar no cadastro.

2. **Compartilhamento do projeto**
   - Inserir o botão de compartilhar ao lado da frase “Projeto cristão...” no componente informativo usado pelas páginas.

3. **Atividades mais visuais**
   - Associar cenas bíblicas às opções do Jogo da Memória.
   - Adicionar imagens relacionadas a cada tema do Caça-Palavras, seguindo o padrão visual do quebra-cabeça.

4. **Progresso do álbum**
   - Remover definitivamente o fundo de livro que recorta as figurinhas.
   - Mostrar em cada página a faixa numérica e o progresso exato da categoria, coerentes com o resumo do álbum.

5. **Devocionais e oração**
   - Usar imagens e ícones coerentes com cada tema, mantendo as ilustrações infantis já existentes.

6. **Recompensas dos vídeos**
   - Exibir abaixo de Gênesis, Jesus, Séries, Músicas e Louvores a recompensa extra de maratona solicitada: 10 moedas em Gênesis/Jesus e 5 moedas nas demais sessões.
   - Manter separada e clara a recompensa individual já concedida por vídeo.

## Verificação
- Executar os testes de cadastro existentes e adicionar cobertura para normalização do celular.
- Validar no navegador o login/cadastro, o álbum sem fundo, o compartilhamento e os textos de recompensa.
