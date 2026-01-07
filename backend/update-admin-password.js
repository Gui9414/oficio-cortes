import { auth } from './config/firebase.js';

const updateAdminPassword = async () => {
  try {
    console.log('🔐 Atualizando senha do admin...\n');

    // Buscar usuário admin por email
    const user = await auth.getUserByEmail('admin@oficiocortes.com');
    
    // Atualizar senha
    await auth.updateUser(user.uid, {
      password: 'Oficio@Cortes#9X7!R'
    });

    console.log('✅ Senha do admin atualizada com sucesso!');
    console.log('📧 Email: admin@oficiocortes.com');
    console.log('🔑 Nova senha: Oficio@Cortes#9X7!R');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error.message);
    process.exit(1);
  }
};

updateAdminPassword();
