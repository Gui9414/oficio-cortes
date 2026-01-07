# Ofício Cortes - Barbearia Premium 💈✂️

Site profissional e completo para a barbearia Ofício Cortes, com sistema de agendamento online, loja de produtos e painel administrativo.

## ✨ Funcionalidades Principais

### Para Clientes

- ✅ Cadastro e login seguro com JWT
- ✅ Agendamento de serviços online (sistema multi-step)
- ✅ Escolha de barbeiro e horário disponível
- ✅ Visualização e gerenciamento de agendamentos
- ✅ Loja de produtos com filtros e busca
- ✅ Perfil editável
- ✅ Sistema de notificações

### Para Administradores

- ✅ Dashboard completo com estatísticas
- ✅ Gerenciamento total de agendamentos
- ✅ Cadastro e edição de barbeiros
- ✅ Gestão de produtos e controle de estoque
- ✅ Visualização de clientes
- ✅ Sistema de relatórios

## 🎨 Design

- **Cores**: Preto, branco, cinza escuro, cinza claro e detalhes silver
- **Tipografia**: Playfair Display (títulos) + Montserrat (texto)
- **Estilo**: Moderno, elegante, minimalista e vintage premium
- **Responsivo**: Design mobile-first totalmente responsivo

## 🚀 Tecnologias

### Frontend

- React 18 com Hooks
- Vite (build tool)
- React Router v6
- Axios (HTTP client)
- React Icons
- Date-fns
- Context API (gerenciamento de estado)

### Backend

- Node.js + Express
- MongoDB + Mongoose (ODM)
- JWT Authentication
- Bcryptjs (hash de senhas)
- Multer (upload de imagens)
- Node-cron (agendamento de tarefas)
- CORS habilitado

## 📦 Instalação Rápida

### Pré-requisitos

- Node.js 18+ instalado
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o MongoDB

**Opção A - MongoDB Atlas (Recomendado):**
Veja instruções em [MONGODB_SETUP.md](MONGODB_SETUP.md)

**Opção B - MongoDB Local:**
Certifique-se de que o MongoDB está rodando localmente

### 3. Configure as variáveis de ambiente

O arquivo `.env` já existe. Edite se necessário:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/oficio-cortes
JWT_SECRET=seu_jwt_secret_aqui
```

### 4. Popule o banco de dados

```bash
npm run seed
```

Isso criará:

- 1 admin (<admin@oficiocortes.com> / admin123)
- 3 clientes de teste
- 1 barbeiro (Guilherme)
- 8 produtos na loja

## 🏃 Executando o Projeto

### Modo Desenvolvimento

**Terminal 1 - Backend:**

**Terminal 1 - Backend:**
```bash
npm run server:dev
```
Servidor API: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Site: `http://localhost:5173`

### Modo Produção

```bash
# Build do frontend
npm run build

# Iniciar servidor
npm run server
```

## 📚 Documentação

- **[GUIA_DE_USO.md](GUIA_DE_USO.md)** - Instruções completas de uso
- **[SETUP_COMPLETO.md](SETUP_COMPLETO.md)** - Setup detalhado
- **[MONGODB_SETUP.md](MONGODB_SETUP.md)** - Configuração do MongoDB
- **[CHECKLIST.md](CHECKLIST.md)** - Roadmap e melhorias futuras

## 🔐 Credenciais de Teste

### Admin

- Email: `admin@oficiocortes.com`
- Senha: `admin123`

### Clientes

- <carlos@email.com> / senha: `123456`
- <joao@email.com> / senha: `123456`
- <pedro@email.com> / senha: `123456`

## 📁 Estrutura do Projeto

```text
oficio-cortes/
├── backend/
│   ├── config/         # Configurações (DB)
│   ├── middleware/     # Auth, Upload
│   ├── models/         # Modelos Mongoose
│   ├── routes/         # Rotas da API
│   ├── services/       # Serviços (notificações)
│   ├── seed.js         # Dados iniciais
│   └── server.js       # Servidor Express
├── src/
│   ├── components/     # Componentes React
│   ├── contexts/       # Context API
│   ├── pages/          # Páginas/Rotas
│   ├── services/       # API services
│   ├── styles/         # Estilos globais
│   ├── utils/          # Utilitários/Validações
│   ├── App.jsx         # App principal
│   └── main.jsx        # Entry point
├── uploads/            # Uploads de imagens
├── .env                # Variáveis de ambiente
├── package.json        # Dependências
└── vite.config.js      # Config Vite
```

## 🌐 Rotas da API

### Autenticação

- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário

### Agendamentos

- `GET /api/agendamentos` - Listar
- `POST /api/agendamentos` - Criar
- `PUT /api/agendamentos/:id` - Atualizar
- `DELETE /api/agendamentos/:id` - Cancelar

### Barbeiros

- `GET /api/barbeiros` - Listar
- `POST /api/barbeiros` - Criar (admin)
- `GET /api/barbeiros/:id/horarios` - Horários disponíveis

### Produtos

- `GET /api/produtos` - Listar
- `POST /api/produtos` - Criar (admin)
- `PUT /api/produtos/:id` - Atualizar (admin)

## 🚀 Deploy

### Frontend (Vercel)

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Backend (Railway/Heroku)

1. Configure o MongoDB Atlas
2. Adicione variáveis de ambiente
3. Deploy

Veja instruções detalhadas em [CHECKLIST.md](CHECKLIST.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## � Licença

Este projeto é privado e proprietário da **Ofício Cortes Barbearia**.

## 👨‍💻 Desenvolvedor

Desenvolvido para **Guilherme Gonçalves Vieira** - Ofício Cortes Barbearia

```text
oficio-cortes/
├── backend/
│   ├── config/          # Configurações (DB, JWT)
│   ├── models/          # Modelos do MongoDB
│   ├── routes/          # Rotas da API
│   ├── controllers/     # Lógica de negócio
│   ├── middleware/      # Middlewares (auth, upload)
│   ├── services/        # Serviços (notificações, WhatsApp)
│   └── server.js        # Servidor principal
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── contexts/        # Context API (Auth, App)
│   ├── services/        # Serviços do frontend
│   ├── utils/           # Funções utilitárias
│   ├── styles/          # Estilos globais
│   ├── App.jsx
│   └── main.jsx
└── public/              # Arquivos estáticos
```

## 👥 Tipos de Usuário

### Barbeiro (Admin)

- Painel administrativo com métricas
- Gerenciamento de agendamentos
- Controle de horários
- Upload de foto e bio

### Cliente

- Cadastro simples
- Agendamento de cortes
- Visualização de produtos

## 🔔 Notificações

- Confirmação de agendamento
- Lembrete 10 minutos antes
- Estrutura preparada para WhatsApp API

## 🛍️ Loja

- Vitrine de produtos
- Cards estilo Mercado Livre
- Produtos para cuidados masculinos

## 📍 Localização

- Mapa integrado (Google Maps)
- Informações da unidade
- Preparado para múltiplas unidades

## 🔐 Autenticação

- JWT tokens
- Bcrypt para senhas
- Middleware de proteção de rotas

## 🎯 Próximas Funcionalidades

- [ ] Integração com WhatsApp Business API
- [ ] Sistema de pagamento online
- [ ] Programa de fidelidade
- [ ] Múltiplos barbeiros
- [ ] Múltiplas unidades
- [ ] App mobile (React Native)

## 📝 Licença

© 2026 Ofício Cortes - Todos os direitos reservados
