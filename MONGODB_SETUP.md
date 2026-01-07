# 🎯 ATENÇÃO: MONGODB NECESSÁRIO

Para executar o projeto **Ofício Cortes**, você precisa ter o **MongoDB** rodando.

## ⚠️ Opções para Configurar o MongoDB:

### Opção 1: MongoDB Atlas (RECOMENDADO - Gratuito na Nuvem)

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Crie um cluster gratuito (M0)
4. Clique em "Connect"
5. Adicione seu IP atual à whitelist
6. Crie um usuário do banco de dados
7. Copie a connection string
8. Cole no arquivo `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/oficio-cortes?retryWrites=true&w=majority
```

### Opção 2: MongoDB Local (Windows)

1. Baixe o MongoDB Community Server:
   https://www.mongodb.com/try/download/community

2. Instale com as opções padrão

3. O MongoDB iniciará automaticamente como serviço do Windows

4. Use no arquivo `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/oficio-cortes
```

5. Para verificar se está rodando:
   - Abra o Gerenciador de Tarefas
   - Vá em "Serviços"
   - Procure por "MongoDB"

### Opção 3: MongoDB com Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

No arquivo `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/oficio-cortes
```

---

## ✅ Após Configurar o MongoDB:

1. Execute o seed para criar dados iniciais:
```bash
npm run seed
```

2. Inicie o servidor:
```bash
npm run server:dev
```

3. Em outro terminal, inicie o frontend:
```bash
npm run dev
```

---

## 📞 Precisa de Ajuda?

Verifique o arquivo `GUIA_DE_USO.md` para mais instruções detalhadas!
