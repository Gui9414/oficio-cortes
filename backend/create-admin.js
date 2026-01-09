import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Inicializar Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync('./firebase-admin-key.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function criarAdmin() {
  try {
    // Criar usuário no Authentication
    const userRecord = await auth.createUser({
      email: 'gui5herme84@gmail.com',
      password: 'Oficio@Cortes#9X7!R',
      emailVerified: true,
      displayName: 'Guilherme Admin'
    });

    console.log('✅ Usuário criado com sucesso no Authentication!');
    console.log('UID:', userRecord.uid);

    // Criar documento no Firestore
    await db.collection('usuarios').doc(userRecord.uid).set({
      nome: 'Guilherme',
      email: 'gui5herme84@gmail.com',
      role: 'admin',
      tipo: 'barbeiro',
      criadoEm: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Documento criado no Firestore!');
    console.log('\n🎉 Admin criado com sucesso!');
    console.log('📧 Email: gui5herme84@gmail.com');
    console.log('🔑 Senha: Oficio@Cortes#9X7!R');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️  Usuário já existe! Atualizando...');
      
      // Buscar usuário existente
      const user = await auth.getUserByEmail('gui5herme84@gmail.com');
      
      // Atualizar senha
      await auth.updateUser(user.uid, {
        password: 'Oficio@Cortes#9X7!R'
      });
      
      // Atualizar Firestore
      await db.collection('usuarios').doc(user.uid).set({
        nome: 'Guilherme',
        email: 'gui5herme84@gmail.com',
        role: 'admin',
        tipo: 'barbeiro',
        atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      console.log('✅ Senha atualizada com sucesso!');
      console.log('📧 Email: gui5herme84@gmail.com');
      console.log('🔑 Senha: Oficio@Cortes#9X7!R');
    } else {
      console.error('❌ Erro:', error.message);
    }
    process.exit(1);
  }
}

criarAdmin();
