import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import Usuario from './models/Usuario.js';
import Barbeiro from './models/Barbeiro.js';
import Produto from './models/Produto.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('✅ Conectado ao MongoDB');

    // Limpar dados existentes
    console.log('🗑️ Limpando dados existentes...');
    await Usuario.deleteMany({});
    await Barbeiro.deleteMany({});
    await Produto.deleteMany({});

    // Criar usuário admin
    console.log('👤 Criando usuário admin...');
    const admin = await Usuario.create({
      nome: 'Guilherme Gonçalves Vieira',
      email: 'adm@oficiocortes.com',
      telefone: '(11) 918474607',
      senha: '5390@GuiAdm',
      role: 'admin'
    });
    console.log('✅ Admin criado:', admin.email);

    // Criar usuários de teste
    console.log('👥 Criando usuários de teste...');
    const clientes = await Usuario.create([
      {
        nome: 'Carlos Silva',
        email: 'carlos@email.com',
        telefone: '(11) 98888-8888',
        senha: '123456',
        role: 'cliente'
      },
      {
        nome: 'João Santos',
        email: 'joao@email.com',
        telefone: '(11) 97777-7777',
        senha: '123456',
        role: 'cliente'
      },
      {
        nome: 'Pedro Oliveira',
        email: 'pedro@email.com',
        telefone: '(11) 96666-6666',
        senha: '123456',
        role: 'cliente'
      }
    ]);
    console.log(`✅ ${clientes.length} clientes criados`);

    // Criar barbeiro
    console.log('💈 Criando barbeiro...');
    const barbeiro = await Barbeiro.create({
      nome: 'Guilherme Gonçalves Vieira',
      especialidade: 'Cortes Clássicos e Modernos, Barbas',
      foto: '/logo oficio.svg',
      horarioTrabalho: {
        segunda: { inicio: '09:00', fim: '19:00' },
        terca: { inicio: '09:00', fim: '19:00' },
        quarta: { inicio: '09:00', fim: '19:00' },
        quinta: { inicio: '09:00', fim: '19:00' },
        sexta: { inicio: '09:00', fim: '19:00' },
        sabado: { inicio: '09:00', fim: '17:00' }
      },
      diasDescanso: ['domingo'],
      ativo: true
    });
    console.log('✅ Barbeiro criado:', barbeiro.nome);

    // Criar produtos
    console.log('🛍️ Criando produtos...');
    const produtos = await Produto.create([
      {
        nome: 'Pomada Modeladora Premium',
        descricao: 'Pomada de alta fixação com brilho natural. Perfeita para penteados clássicos e modernos.',
        preco: 45.00,
        categoria: 'pomada',
        estoque: 25,
        imagem: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80',
        ativo: true,
        destaque: true
      },
      {
        nome: 'Óleo para Barba',
        descricao: 'Óleo nutritivo que hidrata e amacia a barba, deixando-a com aspecto saudável.',
        preco: 38.00,
        categoria: 'creme',
        estoque: 30,
        imagem: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80',
        ativo: true,
        destaque: true
      },
      {
        nome: 'Minoxidil 5% - Crescimento de Barba',
        descricao: 'Solução de minoxidil para estimular o crescimento da barba. Resultados em 3-6 meses.',
        preco: 85.00,
        categoria: 'minoxidil',
        estoque: 15,
        imagem: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80',
        ativo: true,
        destaque: true
      },
      {
        nome: 'Cera Modeladora Forte',
        descricao: 'Cera profissional de fixação extra forte para penteados duradouros.',
        preco: 42.00,
        categoria: 'pomada',
        estoque: 20,
        imagem: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&q=80',
        ativo: true
      },
      {
        nome: 'Balm para Barba',
        descricao: 'Bálsamo hidratante que condiciona e modela a barba, com fixação leve.',
        preco: 40.00,
        categoria: 'creme',
        estoque: 22,
        imagem: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=500&q=80',
        ativo: true
      },
      {
        nome: 'Kit Navalha Premium',
        descricao: 'Kit completo com navalha profissional e lâminas de aço inoxidável.',
        preco: 120.00,
        categoria: 'acessorio',
        estoque: 10,
        imagem: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80',
        ativo: true,
        destaque: true
      },
      {
        nome: 'Shampoo para Barba',
        descricao: 'Shampoo específico para limpar e hidratar a barba sem ressecar.',
        preco: 35.00,
        categoria: 'creme',
        estoque: 28,
        imagem: 'https://images.unsplash.com/photo-1605155242932-8c5fb4423c83?w=500&q=80',
        ativo: true
      },
      {
        nome: 'Pente de Madeira Premium',
        descricao: 'Pente artesanal de madeira nobre, ideal para barba e cabelo.',
        preco: 28.00,
        categoria: 'acessorio',
        estoque: 35,
        imagem: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&q=80',
        ativo: true
      }
    ]);
    console.log(`✅ ${produtos.length} produtos criados`);

    console.log('\n✅ ========================================');
    console.log('✅ SEED COMPLETO COM SUCESSO!');
    console.log('✅ ========================================\n');
    console.log('📧 Admin: admin@oficiocortes.com');
    console.log('🔑 Senha: admin123\n');
    console.log('👥 Clientes de teste (senha: 123456):');
    console.log('   - carlos@email.com');
    console.log('   - joao@email.com');
    console.log('   - pedro@email.com\n');
    console.log('💈 Barbeiro: Guilherme Gonçalves Vieira');
    console.log(`🛍️ Produtos: ${produtos.length} itens cadastrados\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar seed:', error);
    process.exit(1);
  }
};

seedDatabase();
