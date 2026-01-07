import { db, auth } from './config/firebase.js';

const seedFirebase = async () => {
  try {
    console.log('🔥 Iniciando seed do Firebase...\n');

    // Criar usuário admin
    console.log('👤 Criando usuário admin...');
    const adminAuth = await auth.createUser({
      email: 'admin@oficiocortes.com',
      password: 'admin123',
      displayName: 'Guilherme Gonçalves Vieira'
    });

    await db.collection('usuarios').doc(adminAuth.uid).set({
      nome: 'Guilherme Gonçalves Vieira',
      email: 'admin@oficiocortes.com',
      telefone: '(11) 99999-9999',
      role: 'admin',
      criadoEm: new Date()
    });
    console.log('✅ Admin criado:', adminAuth.email);

    // Criar clientes de teste
    console.log('\n👥 Criando usuários de teste...');
    const clientes = [
      { nome: 'Carlos Silva', email: 'carlos@email.com', telefone: '(11) 98888-8888' },
      { nome: 'João Santos', email: 'joao@email.com', telefone: '(11) 97777-7777' },
      { nome: 'Pedro Oliveira', email: 'pedro@email.com', telefone: '(11) 96666-6666' }
    ];

    for (const cliente of clientes) {
      const userAuth = await auth.createUser({
        email: cliente.email,
        password: '123456',
        displayName: cliente.nome
      });

      await db.collection('usuarios').doc(userAuth.uid).set({
        ...cliente,
        role: 'cliente',
        criadoEm: new Date()
      });
    }
    console.log(`✅ ${clientes.length} clientes criados`);

    // Criar barbeiro
    console.log('\n💈 Criando barbeiro...');
    await db.collection('barbeiros').add({
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
      ativo: true,
      criadoEm: new Date()
    });
    console.log('✅ Barbeiro criado: Guilherme Gonçalves Vieira');

    // Criar produtos
    console.log('\n🛍️ Criando produtos...');
    const produtos = [
      {
        nome: 'Pomada Modeladora Premium',
        descricao: 'Pomada de alta fixação com brilho natural.',
        preco: 45.00,
        categoria: 'pomada',
        estoque: 25,
        imagem: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80',
        ativo: true,
        destaque: true
      },
      {
        nome: 'Óleo para Barba',
        descricao: 'Óleo nutritivo que hidrata e amacia a barba.',
        preco: 38.00,
        categoria: 'creme',
        estoque: 30,
        imagem: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80',
        ativo: true,
        destaque: true
      },
      {
        nome: 'Minoxidil 5% - Crescimento de Barba',
        descricao: 'Solução de minoxidil para estimular o crescimento.',
        preco: 85.00,
        categoria: 'minoxidil',
        estoque: 15,
        imagem: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80',
        ativo: true,
        destaque: true
      },
      {
        nome: 'Cera Modeladora Forte',
        descricao: 'Cera profissional de fixação extra forte.',
        preco: 42.00,
        categoria: 'pomada',
        estoque: 20,
        imagem: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&q=80',
        ativo: true
      },
      {
        nome: 'Balm para Barba',
        descricao: 'Bálsamo hidratante que condiciona e modela a barba.',
        preco: 40.00,
        categoria: 'creme',
        estoque: 22,
        imagem: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=500&q=80',
        ativo: true
      },
      {
        nome: 'Kit Navalha Premium',
        descricao: 'Kit completo com navalha profissional.',
        preco: 120.00,
        categoria: 'acessorio',
        estoque: 10,
        imagem: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80',
        ativo: true,
        destaque: true
      },
      {
        nome: 'Shampoo para Barba',
        descricao: 'Shampoo específico para limpar e hidratar.',
        preco: 35.00,
        categoria: 'creme',
        estoque: 28,
        imagem: 'https://images.unsplash.com/photo-1605155242932-8c5fb4423c83?w=500&q=80',
        ativo: true
      },
      {
        nome: 'Pente de Madeira Premium',
        descricao: 'Pente artesanal de madeira nobre.',
        preco: 28.00,
        categoria: 'acessorio',
        estoque: 35,
        imagem: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&q=80',
        ativo: true
      }
    ];

    const batch = db.batch();
    produtos.forEach(produto => {
      const docRef = db.collection('produtos').doc();
      batch.set(docRef, { ...produto, criadoEm: new Date() });
    });
    await batch.commit();
    console.log(`✅ ${produtos.length} produtos criados`);

    console.log('\n✅ ========================================');
    console.log('✅ SEED DO FIREBASE COMPLETO!');
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

seedFirebase();
