# 🚀 GUIA DE USO - OFÍCIO CORTES

## 📝 ÍNDICE

1. [Primeiro Uso](#primeiro-uso)
2. [Iniciar o Projeto](#iniciar-o-projeto)
3. [Acessar o Sistema](#acessar-o-sistema)
4. [Funcionalidades](#funcionalidades)
5. [Credenciais de Teste](#credenciais-de-teste)
6. [Solução de Problemas](#solução-de-problemas)

---

## 🎬 PRIMEIRO USO

### Passo 1: Certifique-se de ter o MongoDB rodando

**Opção A - MongoDB Local:**
```bash
# Windows: Inicie o serviço do MongoDB
# O MongoDB já deve estar rodando automaticamente se instalado
```

**Opção B - MongoDB Atlas (Recomendado):**
- Copie sua connection string do MongoDB Atlas
- Cole no arquivo `.env` na variável `MONGODB_URI`

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Popular o Banco de Dados

Execute o script de seed para criar dados iniciais:

```bash
npm run seed
```

Isso criará:
- ✅ 1 usuário administrador
- ✅ 3 usuários clientes de teste
- ✅ 1 barbeiro (Guilherme)
- ✅ 8 produtos na loja

---

## 🏃 INICIAR O PROJETO

### Modo Desenvolvimento

**Terminal 1 - Backend:**
```bash
npm run server:dev
```
O servidor iniciará em: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
O site abrirá em: `http://localhost:5173`

### Modo Produção

```bash
# Build do frontend
npm run build

# Iniciar servidor
npm run server
```

---

## 🌐 ACESSAR O SISTEMA

Após iniciar o projeto, acesse: **http://localhost:5173**

### Páginas Públicas
- **Home**: `/` - Página inicial
- **Login**: `/login` - Entrar no sistema
- **Cadastro**: `/cadastro` - Criar nova conta
- **Loja**: `/loja` - Ver produtos
- **Localização**: `/localizacao` - Endereço da barbearia

### Páginas do Cliente (requer login)
- **Agendamento**: `/agendamento` - Agendar horário
- **Meus Agendamentos**: `/meus-agendamentos` - Ver agendamentos
- **Meu Perfil**: `/meu-perfil` - Editar perfil

### Página Admin (requer login como admin)
- **Dashboard Admin**: `/admin` - Gerenciar tudo

---

## ⚙️ FUNCIONALIDADES

### 👤 Para Clientes

1. **Cadastro e Login**
   - Criar conta com email e senha
   - Fazer login para acessar funcionalidades

2. **Agendamento de Serviços**
   - Escolher barbeiro
   - Selecionar serviço (corte, barba, etc.)
   - Escolher data e horário disponível
   - Confirmar agendamento

3. **Gerenciar Agendamentos**
   - Ver todos os agendamentos
   - Cancelar agendamentos (com antecedência)
   - Receber notificações

4. **Loja de Produtos**
   - Navegar pelos produtos
   - Filtrar por categoria
   - Buscar produtos
   - Entrar em contato via WhatsApp para comprar

5. **Perfil**
   - Editar informações pessoais
   - Alterar senha
   - Ver histórico

### 👨‍💼 Para Administradores

1. **Dashboard Completo**
   - Visão geral de agendamentos
   - Estatísticas de clientes
   - Relatórios de vendas

2. **Gerenciar Agendamentos**
   - Ver todos os agendamentos
   - Aprovar/rejeitar agendamentos
   - Marcar como concluído
   - Cancelar agendamentos

3. **Gerenciar Barbeiros**
   - Adicionar novos barbeiros
   - Editar informações
   - Definir horários de trabalho
   - Ativar/desativar barbeiros

4. **Gerenciar Produtos**
   - Adicionar produtos
   - Editar produtos
   - Controlar estoque
   - Definir preços e descontos

5. **Gerenciar Clientes**
   - Ver lista de clientes
   - Ver histórico de cada cliente
   - Gerenciar usuários

---

## 🔐 CREDENCIAIS DE TESTE

### Administrador
- **Email**: `admin@oficiocortes.com`
- **Senha**: `admin123`
- **Acesso**: Todas as funcionalidades + Dashboard Admin

### Clientes de Teste
1. **Carlos Silva**
   - Email: `carlos@email.com`
   - Senha: `123456`

2. **João Santos**
   - Email: `joao@email.com`
   - Senha: `123456`

3. **Pedro Oliveira**
   - Email: `pedro@email.com`
   - Senha: `123456`

---

## 🔧 SOLUÇÃO DE PROBLEMAS

### ❌ Erro: "Cannot connect to MongoDB"

**Solução:**
1. Verifique se o MongoDB está rodando
2. Confirme a connection string no arquivo `.env`
3. Para MongoDB Atlas, verifique se seu IP está na whitelist

```bash
# Verificar se o MongoDB está rodando (Windows)
# Abra o gerenciador de serviços e procure por "MongoDB"
```

### ❌ Erro: "Port 5000 already in use"

**Solução:**
1. Mude a porta no arquivo `.env`:
```
PORT=5001
```
2. Ou termine o processo que está usando a porta 5000

### ❌ Erro: "Module not found"

**Solução:**
```bash
# Reinstale as dependências
rm -rf node_modules
npm install
```

### ❌ Página em branco / Erros no console

**Solução:**
1. Limpe o cache do navegador
2. Reinicie o servidor de desenvolvimento
3. Verifique se ambos os servidores (frontend e backend) estão rodando

### ❌ Login não funciona

**Solução:**
1. Execute o seed novamente: `npm run seed`
2. Verifique se o backend está rodando
3. Confira as credenciais de teste acima

### ❌ Produtos não aparecem na loja

**Solução:**
1. Execute o seed: `npm run seed`
2. Verifique o console do backend para erros
3. Confirme que está conectado ao banco de dados

---

## 📱 TESTANDO NO CELULAR

Para testar no seu celular na mesma rede WiFi:

1. Descubra seu IP local:
```bash
# Windows
ipconfig

# Procure por "IPv4 Address" (ex: 192.168.1.10)
```

2. No arquivo `backend/server.js`, configure o CORS:
```javascript
app.use(cors({
  origin: '*' // Para desenvolvimento
}));
```

3. Acesse no celular:
```
http://SEU_IP:5173
# Exemplo: http://192.168.1.10:5173
```

---

## 🎨 PERSONALIZAÇÕES

### Alterar Cores
Edite o arquivo `src/styles/global.css`:
```css
:root {
  --cor-preto: #000000;
  --cor-silver: #C0C0C0;
  /* ... */
}
```

### Alterar Logo
Substitua os arquivos:
- `logo oficio.svg` - Logo SVG
- `logo oficio.png` - Logo PNG

### Alterar Informações
- **Nome da barbearia**: Busque por "OFÍCIO CORTES" e substitua
- **Telefone**: Busque por "99999-9999" e substitua
- **Endereço**: Edite `src/pages/Localizacao.jsx`

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verifique a seção [Solução de Problemas](#solução-de-problemas)
2. Confira se seguiu todos os passos do [SETUP_COMPLETO.md](SETUP_COMPLETO.md)
3. Verifique os logs no console do navegador (F12)
4. Verifique os logs no terminal do backend

---

## 🚀 PRÓXIMOS PASSOS

Após dominar o básico:

1. ✅ Personalize cores e logo
2. ✅ Adicione suas próprias fotos
3. ✅ Configure o WhatsApp com seu número real
4. ✅ Adicione Google Maps API para localização
5. ✅ Configure um domínio próprio
6. ✅ Faça deploy em produção (Vercel, Heroku, etc.)

---

**Desenvolvido para Ofício Cortes Barbearia** 💈✂️
