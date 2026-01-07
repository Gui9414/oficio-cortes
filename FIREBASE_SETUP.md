# 🔥 CONFIGURAÇÃO DO FIREBASE - PASSO A PASSO

## 🚀 CONFIGURAÇÃO RÁPIDA (5 minutos)

### 1️⃣ Criar Projeto no Firebase

1. Acesse: <https://console.firebase.google.com/>
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Nome do projeto: **oficio-cortes**
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

---

### 2️⃣ Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Modo: **"Iniciar no modo de produção"** (vamos configurar as regras depois)
4. Local: **southamerica-east1 (São Paulo)** ou mais próximo
5. Clique em **"Ativar"**

---

### 3️⃣ Configurar Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Vamos começar"**
3. Na aba **"Sign-in method"**, ative:
   - ✅ **Email/Password** (clique e ative)

---

### 4️⃣ Obter Credenciais do Frontend

1. No menu lateral, clique no **ícone de engrenagem ⚙️** → **"Configurações do projeto"**
2. Em **"Seus aplicativos"**, clique no ícone **</> (Web)**
3. Nome do app: **oficio-cortes-web**
4. **NÃO** marque "Firebase Hosting"
5. Clique em **"Registrar app"**
6. Copie o objeto `firebaseConfig` que aparece

**Exemplo:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "oficio-cortes.firebaseapp.com",
  projectId: "oficio-cortes",
  storageBucket: "oficio-cortes.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

1. Cole essas informações no arquivo **`.env`**:

```env
# Firebase Frontend Config
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=oficio-cortes.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=oficio-cortes
VITE_FIREBASE_STORAGE_BUCKET=oficio-cortes.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxx
```

---

### 5️⃣ Obter Credenciais do Backend (Admin SDK)

1. Ainda em **"Configurações do projeto"**
2. Clique na aba **"Contas de serviço"**
3. Clique em **"Gerar nova chave privada"**
4. Clique em **"Gerar chave"** (um arquivo JSON será baixado)
5. Renomeie o arquivo para: **`firebase-admin-key.json`**
6. Mova o arquivo para a pasta raiz do projeto: `c:\Users\Guilherme\oficio-cortes\`

⚠️ **IMPORTANTE**: Adicione ao `.gitignore`:
```
firebase-admin-key.json
```

---

### 6️⃣ Configurar Regras de Segurança do Firestore

1. Volte para **"Firestore Database"**
2. Clique na aba **"Regras"**
3. Cole estas regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função auxiliar para verificar autenticação
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Função para verificar se é admin
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Usuários
    match /usuarios/{userId} {
      allow read: if isAuthenticated();
      allow create: if true; // Permitir cadastro
      allow update, delete: if isAuthenticated() && 
                               (request.auth.uid == userId || isAdmin());
    }
    
    // Barbeiros
    match /barbeiros/{barbeiroId} {
      allow read: if true; // Público
      allow write: if isAdmin();
    }
    
    // Produtos
    match /produtos/{produtoId} {
      allow read: if true; // Público
      allow write: if isAdmin();
    }
    
    // Agendamentos
    match /agendamentos/{agendamentoId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
                               (resource.data.usuarioId == request.auth.uid || isAdmin());
    }
  }
}
```

1. Clique em **"Publicar"**

---

### 7️⃣ Popular Banco de Dados

Execute o script de seed:

```bash
npm run seed:firebase
```

---

### 8️⃣ Iniciar o Projeto

```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run dev
```

---

## 🌐 Acessar o Sistema

- Frontend: <http://localhost:5173>
- Login: <admin@oficiocortes.com> / admin123

---

## ✅ RESUMO DO QUE VOCÊ PRECISA

1. ✅ Criar projeto no Firebase Console
2. ✅ Ativar Firestore Database
3. ✅ Ativar Authentication (Email/Password)
4. ✅ Copiar credenciais Web para `.env`
5. ✅ Baixar arquivo JSON do Admin SDK
6. ✅ Configurar regras de segurança
7. ✅ Executar seed
8. ✅ Iniciar projeto

---

## 🎯 VANTAGENS DO FIREBASE

- ✅ **Gratuito** (até 50k leituras/dia)
- ✅ **Sem instalação** local
- ✅ **Rápido** e confiável
- ✅ **Escalável** automaticamente
- ✅ **Backup** automático
- ✅ **Console visual** para gerenciar dados
- ✅ **Authentication** integrado

---

## 📞 PRECISA DE AJUDA?

Se tiver problemas, verifique:

1. Arquivo `firebase-admin-key.json` está na raiz
2. Variáveis no `.env` estão corretas
3. Authentication (Email/Password) está ativado
4. Firestore Database está criado

---

**🔥 Firebase configurado = Site funcionando em minutos!**
