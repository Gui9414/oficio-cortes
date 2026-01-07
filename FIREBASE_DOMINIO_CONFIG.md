# 🔥 CONFIGURAÇÃO FIREBASE PARA DOMÍNIO PERSONALIZADO

## ✅ PASSOS OBRIGATÓRIOS NO CONSOLE DO FIREBASE

### 1. Autorizar Domínios no Firebase Authentication

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto: **barbearia-oficio-cortes**
3. No menu lateral, clique em **Authentication**
4. Vá na aba **Settings** (Configurações)
5. Role até **Authorized domains** (Domínios autorizados)
6. Clique em **Add domain** (Adicionar domínio)
7. Adicione os seguintes domínios:
   - ✅ `oficiocortes.com`
   - ✅ `www.oficiocortes.com`
   - ✅ `localhost` (para desenvolvimento)
   - ✅ Seu domínio Vercel (ex: `oficio-cortes.vercel.app`)

### 2. Verificar CORS no Firestore

1. No menu lateral, clique em **Firestore Database**
2. Vá em **Rules** (Regras)
3. Certifique-se que as regras permitem acesso do seu domínio

### 3. Verificar Storage CORS (se usar upload)

1. No menu lateral, clique em **Storage**
2. Vá em **Rules** (Regras)
3. Ajuste se necessário para permitir o domínio

---

## 📋 VARIÁVEIS DE AMBIENTE NO VERCEL

Certifique-se de que estas variáveis estão configuradas no Vercel:

1. Acesse: https://vercel.com/dashboard
2. Vá no seu projeto
3. Settings → Environment Variables
4. Adicione:

```
VITE_FIREBASE_API_KEY=AIzaSyB1a4yjIafU3v0bd4Jleke_J4lmV7RP5kw
VITE_FIREBASE_AUTH_DOMAIN=barbearia-oficio-cortes.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=barbearia-oficio-cortes
VITE_FIREBASE_STORAGE_BUCKET=barbearia-oficio-cortes.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=750501554474
VITE_FIREBASE_APP_ID=1:750501554474:web:03339afdcb9a5e8e0e5653
```

5. Marque para aplicar em: **Production, Preview e Development**
6. Salve as alterações
7. Faça um **Redeploy** do projeto

---

## 🚀 APÓS CONFIGURAR

1. Limpe o cache do navegador (Ctrl + Shift + Delete)
2. Acesse seu site em modo anônimo
3. Teste em: `https://oficiocortes.com`
4. Teste também em: `https://www.oficiocortes.com`

---

## ❓ SE AINDA HOUVER ERRO

Verifique o console do navegador (F12) e procure por:
- Erros de CORS
- Erros de "domain not authorized"
- Erros de variáveis undefined

Envie o erro específico para corrigir!
