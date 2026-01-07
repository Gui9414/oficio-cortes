# ⚠️ CONFIGURAÇÃO DO MONGODB ATLAS - PASSO A PASSO

## 📋 Você tem 2 opções:

### ✅ OPÇÃO 1: Usar MongoDB Atlas (RECOMENDADO - 5 minutos)

1. **Acesse**: https://www.mongodb.com/cloud/atlas/register
2. **Crie uma conta gratuita** (pode usar Google/GitHub)
3. **Crie um Cluster**:
   - Escolha: "M0 Free" (gratuito para sempre)
   - Provider: AWS
   - Region: Escolha a mais próxima (ex: São Paulo)
   - Cluster Name: pode deixar padrão
   - Clique em "Create"
   
4. **Configure o Acesso**:
   - Username: `oficiocortes`
   - Password: `admin123` (ou crie sua própria senha)
   - Clique em "Create User"
   
5. **Adicione seu IP**:
   - Clique em "Add My Current IP Address"
   - Ou adicione: `0.0.0.0/0` (permite de qualquer lugar)
   - Clique em "Finish and Close"
   
6. **Obtenha a Connection String**:
   - Clique em "Connect"
   - Escolha "Connect your application"
   - Copie a string (exemplo):
     ```
     mongodb+srv://oficiocortes:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   
7. **Atualize o arquivo `.env`**:
   - Substitua `<password>` pela senha que você criou
   - Adicione `/oficio-cortes` antes do `?`
   - Exemplo final:
     ```
     MONGODB_URI=mongodb+srv://oficiocortes:admin123@cluster0.xxxxx.mongodb.net/oficio-cortes?retryWrites=true&w=majority
     ```

### 🔧 OPÇÃO 2: Instalar MongoDB Local (Windows)

1. **Baixe**: https://www.mongodb.com/try/download/community
2. **Instale** com configurações padrão
3. **No arquivo `.env`**, use:
   ```
   MONGODB_URI=mongodb://localhost:27017/oficio-cortes
   ```
4. **Verifique** se o serviço está rodando:
   - Abra: Gerenciador de Tarefas → Serviços
   - Procure por "MongoDB"

---

## 🚀 APÓS CONFIGURAR O MONGODB:

Execute estes comandos na pasta do projeto:

```bash
# 1. Popule o banco de dados
npm run seed

# 2. Inicie o backend (em um terminal)
npm run server:dev

# 3. Inicie o frontend (em outro terminal)
npm run dev
```

---

## ✅ TESTE SE ESTÁ FUNCIONANDO:

Acesse: http://localhost:5173

Login de teste:
- Email: admin@oficiocortes.com
- Senha: admin123

---

## ❓ PROBLEMAS?

- Se o seed falhar: Verifique a connection string no `.env`
- Se não conectar: Verifique se seu IP está na whitelist do Atlas
- Mais ajuda: Veja GUIA_DE_USO.md

---

**💡 DICA**: MongoDB Atlas é a opção mais fácil e confiável!
