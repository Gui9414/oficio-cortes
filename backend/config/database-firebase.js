import { db } from './firebase.js';

export const connectDB = async () => {
  try {
    // Testar conexão com Firestore
    await db.collection('_healthcheck').doc('test').set({
      timestamp: new Date(),
      status: 'connected'
    });
    
    await db.collection('_healthcheck').doc('test').delete();
    
    console.log('✅ Conectado ao Firebase Firestore');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao Firebase:', error.message);
    console.log('📋 Verifique as credenciais em firebase-admin-key.json');
    process.exit(1);
  }
};
