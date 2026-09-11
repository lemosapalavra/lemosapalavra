# Concluir histórias, álbum, datas e novas atividades

## Objetivo
Finalizar os ajustes pendentes sem reconstruir as páginas nem alterar os sistemas existentes.

## Implementação
1. **Histórias para ler e pintar**
   - Recortar novamente as 52 ilustrações a partir do PDF original, mostrando apenas o desenho completo de cada história, sem trechos da página vizinha.
   - Manter intactos os textos, a seleção de duas histórias por dia e o salvamento automático da pintura.
   - Ajustar a área de pintura ao tamanho real de cada imagem para manter desenho e traços alinhados em celular, tablet e desktop.

2. **Capa do Álbum Volume II**
   - Reorganizar as capas dos dois volumes em blocos independentes, com rótulos e mensagens fora das imagens.
   - Destacar claramente que o Volume II só será habilitado após a conclusão do Volume I.
   - Manter o Volume II em escala de cinza enquanto bloqueado e preservar o Álbum sem rodapé global.

3. **Datas do aviãozinho, trenzinho e kartzinho**
   - Trocar o agendamento atual por data inicial e final contendo somente dia e mês, recorrente todos os anos.
   - Atualizar as regras de exibição para intervalos comuns e intervalos que atravessam o fim do ano.
   - Manter os controles de ativar/desativar, textos e vídeos atuais.

4. **Atividade Labirinto**
   - Usar os labirintos do PDF enviado, alternando um desafio por dia.
   - Criar interação simples por toque/clique para percorrer o caminho, com reinício e conclusão.
   - Usar uma das páginas do material como ícone coerente com as demais atividades.

5. **Atividade Quebra-Cabeça**
   - Substituir o catálogo atual pelas figuras do PDF enviado e seguir o gabarito como referência.
   - Manter a montagem digital por troca de peças, níveis de dificuldade, referência visual e rotação diária.

6. **Atividade Frutos do Espírito**
   - Usar a página 1 como ícone e as demais páginas como conteúdo alternado dia a dia.
   - Disponibilizar paleta, pincel, borracha, reinício e salvamento automático da pintura para continuar depois.
   - Integrar as três atividades à rotação diária sem esconder o Construtor de Palavras.

## Detalhes técnicos
- Preparar imagens leves a partir dos PDFs mais recentes enviados, registrando-as no fluxo de arquivos do projeto.
- Reaproveitar os componentes e padrões de recompensa, navegação e pintura já existentes.
- Evitar mudanças no login, vídeos, administração, navegação global ou identidade visual.

## Verificação
- Validar tipos e testes existentes.
- Conferir Histórias, Álbum, Configurações e Atividades em celular e desktop.
- Testar persistência da pintura, rotação diária, quebra-cabeça, labirinto e intervalos anuais de dia/mês.
