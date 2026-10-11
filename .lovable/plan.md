# Corrigir autenticação insegura por celular

## Objetivo
Bloquear imediatamente a tomada de contas pelo fluxo antigo, sem excluir ou modificar usuários, perfis, avatares ou progresso. Preparar `/login-sms` para código SMS, mantendo o envio desligado até o provedor estar configurado.

## Alterações
1. **Desativar a função insegura no servidor**
   - Substituir `phone-auth` por uma resposta fixa de indisponibilidade, sem procurar usuários, criar contas, confirmar números ou redefinir senhas.
   - Remover dessa função o uso administrativo capaz de criar usuários ou trocar senhas.
   - Manter a função publicada apenas como bloqueio seguro para clientes antigos; nenhuma conta ou dado será removido.

2. **Remover o acesso antigo no aplicativo**
   - Retirar de `/login` as chamadas à função `phone-auth`, a senha previsível derivada do telefone e a entrada automática apenas por nome e número.
   - Manter o acesso seguro já existente pelo Google.
   - Direcionar quem prefere celular para a nova página `/login-sms`.

3. **Preparar `/login-sms` sem enviar códigos**
   - Criar a página pública com campo de celular, explicação do código SMS e estado claro de “aguardando configuração”.
   - Não chamar envio ou validação de OTP enquanto o provedor não estiver concluído.
   - Deixar a estrutura pronta para, numa etapa futura, enviar OTP, validar o código e só então criar ou acessar a conta.

4. **Proteções e validação**
   - Adicionar testes que comprovem que o fluxo antigo está bloqueado e que o envio de SMS permanece desativado.
   - Verificar `/login`, `/login-sms` e a resposta pública de `phone-auth`.
   - Executar os testes e a checagem do aplicativo.

## Arquivos previstos
- `supabase/functions/phone-auth/index.ts` — transformar em bloqueio seguro no servidor.
- `src/pages/Login.tsx` — remover autenticação previsível por celular e manter entrada segura.
- `src/pages/LoginSms.tsx` — nova página de OTP preparada, sem envio ativo.
- `src/App.tsx` — registrar `/login-sms` como página pública e seus dados de título/descrição.
- `src/components/MascoteLia.tsx` — corrigir a orientação de login para não prometer entrada insegura.
- `src/lib/smsAuth.ts` — centralizar o estado desativado e a validação segura do fluxo futuro.
- `src/test/phoneAuthSecurity.test.ts` — testes de bloqueio e OTP desativado.
- `src/test/register.test.ts` — remover testes que validavam a senha previsível antiga.
- `roadmap.md` e `AGENTS.md` — registrar conclusão e a regra permanente de segurança.

## Preservação de dados
Nenhuma tabela, conta, perfil, avatar, mural, moedas ou progresso será apagado ou alterado. Usuários antigos por celular ficarão temporariamente sem esse método de entrada até o SMS seguro ser configurado; isso evita acesso indevido durante a transição.
