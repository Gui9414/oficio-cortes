# 🎨 OFÍCIO CORTES - SETUP COMPLETO

Site profissional e escalável para a barbearia Ofício Cortes.

## 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **MongoDB** (versão 6 ou superior) - [Download](https://www.mongodb.com/try/download/community)
  - Alternativa: MongoDB Atlas (gratuito na nuvem)
- **Git** - [Download](https://git-scm.com/)

## 🚀 INSTALAÇÃO E CONFIGURAÇÃO

### 1. Clone ou acesse o projeto

```bash
cd c:\Users\Guilherme\oficio-cortes
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o MongoDB

#### Opção A: MongoDB Local

1. Instale e inicie o MongoDB
2. O banco será criado automaticamente em `mongodb://localhost:27017/oficio-cortes`

#### Opção B: MongoDB Atlas (Recomendado)

1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Obtenha sua connection string
4. Use no arquivo `.env` (próximo passo)

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (copie de `.env.example`):

```bash
# Backend Configuration
PORT=5000
NODE_ENV=development

# Database - Escolha uma opção:
# Opção 1 - Local:
MONGODB_URI=mongodb://localhost:27017/oficio-cortes

# Opção 2 - MongoDB Atlas (substitua <user>, <password> e <cluster>):
# MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/oficio-cortes?retryWrites=true&w=majority

# JWT Secret (gere uma string aleatória segura)
JWT_SECRET=sua_chave_super_secreta_aqui_12345

# WhatsApp API (para integração futura)
WHATSAPP_API_KEY=
WHATSAPP_PHONE_NUMBER=

# Google Maps API (opcional, para o mapa)
GOOGLE_MAPS_API_KEY=

# Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 5. Crie o primeiro usuário barbeiro (Admin)

Após iniciar o servidor pela primeira vez, você pode criar o usuário barbeiro diretamente no MongoDB ou via API:

**Via MongoDB Compass ou Shell:**

```javascript
// Conecte ao banco oficio-cortes

// 1. Criar o usuário
db.usuarios.insertOne({
  nome: "Guilherme Gonçalves Vieira",
  telefone: "11999999999", // 11 dígitos
  senha: "$2a$10$...", // Use bcrypt para gerar o hash da senha
  tipo: "barbeiro",
  ativo: true,
  criadoEm: new Date()
})

// 2. Pegar o _id do usuário criado e criar o perfil de barbeiro
db.barbeiros.insertOne({
  usuario: ObjectId("..."), // ID do usuário acima
  bio: "Barbeiro profissional com mais de 5 anos de experiência.",
  foto: null,
  ativo: true,
  horarioFuncionamento: {
    segunda: { inicio: "09:00", fim: "20:00", ativo: true },
    terca: { inicio: "09:00", fim: "20:00", ativo: true },
    quarta: { inicio: "09:00", fim: "20:00", ativo: true },
    quinta: { inicio: "09:00", fim: "20:00", ativo: true },
    sexta: { inicio: "09:00", fim: "20:00", ativo: true },
    sabado: { inicio: "09:00", fim: "18:00", ativo: true },
    domingo: { inicio: "", fim: "", ativo: false }
  }
})
```

1. Cadastre-se normalmente no site
2. No MongoDB, edite o usuário e mude `tipo: "cliente"` para `tipo: "barbeiro"`
3. Crie o documento correspondente na collection `barbeiros`

## 🏃 EXECUTAR O PROJETO

### Desenvolvimento (Frontend + Backend)

**Terminal 1 - Backend:**

```bash
npm run server:dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

Acesse:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:5000/api>

### Produção

1. Build do frontend:

```bash
npm run build
```

1. Servir arquivos estáticos pelo backend ou usar um servidor web (Nginx, Apache)

1. Iniciar servidor:

```bash
npm run server
```

## 🗂️ ESTRUTURA DO PROJETO

```text
oficio-cortes/
├── backend/                # Backend Node.js + Express
│   ├── config/            # Configurações (DB, JWT)
│   ├── models/            # Modelos MongoDB (Mongoose)
│   ├── routes/            # Rotas da API
│   ├── middleware/        # Middlewares (auth, upload)
│   ├── services/          # Serviços (notificações)
│   └── server.js          # Servidor principal
├── src/                   # Frontend React
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   ├── contexts/          # Context API (Auth, App)
│   ├── services/          # Serviços do frontend
│   ├── styles/            # Estilos globais
│   └── main.jsx           # Entry point
├── uploads/               # Arquivos enviados
├── public/                # Arquivos públicos estáticos
└── package.json           # Dependências
```

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### Cliente

- ✅ Cadastro e login simples (nome + telefone)
- ✅ Sistema de agendamento completo (barbeiro, serviço, data, hora)
- ✅ Visualização de agendamentos
- ✅ Cancelamento de agendamentos
- ✅ Loja de produtos
- ✅ Mapa de localização

### Barbeiro (Admin)

- ✅ Painel administrativo com métricas
- ✅ Receita do dia/semana/mês
- ✅ Lista de agendamentos
- ✅ Gerenciamento de status dos agendamentos
- ✅ Horários configuráveis
- ✅ Upload de foto
- ✅ Edição de bio

### Sistema

- ✅ Autenticação JWT
- ✅ Notificações automáticas (estrutura preparada para WhatsApp)
- ✅ Sistema de horários disponíveis
- ✅ Validações completas
- ✅ Design responsivo
- ✅ Paleta de cores profissional (preto, branco, cinza, silver)

## 🔐 USUÁRIOS DE TESTE

Após criar o usuário barbeiro conforme instruções acima:

**Admin/Barbeiro:**

- Telefone: 11999999999
- Senha: (a que você definir)

**Cliente:**

- Cadastre-se normalmente pelo site

## 🔮 PRÓXIMOS PASSOS

### Integração WhatsApp Business API

1. Crie uma conta no [WhatsApp Business API](https://business.whatsapp.com/)

2. Obtenha suas credenciais (API Key)

3. Configure no `.env`:

```env
WHATSAPP_API_KEY=sua_api_key
WHATSAPP_PHONE_NUMBER=5511999999999
```

1. Atualize o código em `backend/services/notificationService.js`:

```javascript
import axios from 'axios';

const enviarWhatsApp = async (telefone, mensagem) => {
  await axios.post(process.env.WHATSAPP_API_URL, {
    phone: telefone,
    message: mensagem,
    api_key: process.env.WHATSAPP_API_KEY
  });
};
```

### Adicionar Múltiplos Barbeiros

1. Cadastre novos usuários com `tipo: "barbeiro"`
2. Crie documentos na collection `barbeiros`
3. A interface já está preparada para listar múltiplos barbeiros

### Sistema de Pagamento Online

Integrar com:

- Mercado Pago
- Stripe
- PagSeguro

### App Mobile

Converter para React Native ou criar PWA

## 📱 CONTATOS E INFORMAÇÕES

Atualize as informações de contato em:

- `src/components/Footer.jsx`
- `src/pages/Localizacao.jsx`
- `backend/services/notificationService.js`

## 🐛 TROUBLESHOOTING

### Erro de conexão com MongoDB

- Verifique se o MongoDB está rodando
- Confira a connection string no `.env`
- Para MongoDB Atlas, verifique se seu IP está na whitelist

### Erro de autenticação

- Certifique-se de ter configurado o `JWT_SECRET` no `.env`
- Limpe o localStorage do navegador

### Erro de upload de imagens

- Verifique se a pasta `uploads` existe
- Confira as permissões da pasta

### Porta já em uso

- Mude a porta no `.env` ou finalize o processo que está usando

## 📄 LICENÇA

© 2026 Ofício Cortes - Todos os direitos reservados

---

Desenvolvido com ❤️ para a Ofício Cortes - Barbearia Premium

Para suporte: <contato@oficiocortes.com>
