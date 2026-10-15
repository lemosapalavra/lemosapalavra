# Auditoria de imagens — Lemos a Palavra

Verificação do repositório em 15/10/2026:

- **443 arquivos .webp** existentes.
- **144 arquivos .png** existentes.
- **23 arquivos .jpg** existentes.
- **167 arquivos PNG/JPG** no total.
- **4 PNG com cópia WebP de mesmo nome-base**, todos em `public/pacotinhos/`.
- **163 PNG/JPG sem cópia WebP de mesmo nome-base**.

## Procedimento seguro

1. Executar **Actions → Optimize images to WebP → Run workflow**, qualidade 90.
2. Baixar o artefato `converted-webp-images` ou revisar a pull request, se gerada.
3. Validar as imagens e alterar as referências do site para os novos arquivos WebP antes de remover PNG/JPG.
4. Manter arquivos PNG usados como favicon/ícones de instalação quando necessários.

**Atenção:** arquivos WebP com nomes diferentes não são contados como pares. A existência de uma versão WebP não garante que o código já a utilize. Não excluir os originais automaticamente.
