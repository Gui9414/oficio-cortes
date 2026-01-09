import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase com fallbacks seguros
const firebaseConfig = {
  apiKey: "AIzaSyB1a4yjIafU3v0bd4Jleke_J4lmV7RP5kw",
  authDomain: "barbearia-oficio-cortes.firebaseapp.com",
  projectId: "barbearia-oficio-cortes",
  storageBucket: "barbearia-oficio-cortes.firebasestorage.app",
  messagingSenderId: "750501554474",
  appId: "1:750501554474:web:03339afdcb9a5e8e0e5653",
  measurementId: "G-LJ8C50R4V8"
};

// Validar configuração antes de inicializar
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('⚠️ Configuração Firebase incompleta. Verifique as variáveis de ambiente.');
}

// Inicializar Firebase com tratamento de erro
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase inicializado com sucesso');
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error.message);
  // Não deixar o erro quebrar a aplicação
  app = null;
}

// Inicializar Analytics apenas em produção e com window disponível
let analytics = null;
if (typeof window !== 'undefined' && import.meta.env.PROD && app) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics não disponível:', error.message);
  }
}

// Serviços com proteção contra app null
export const auth = app ? getAuth(app) : null;

// Inicializar Firestore com configurações
let db = null;
if (app) {
  try {
    db = getFirestore(app);
    
    // Garantir que o Firestore está online
    enableNetwork(db).catch((err) => {
      console.warn('Erro ao ativar rede do Firestore:', err);
    });
    
    console.log('✅ Firestore inicializado e online');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firestore:', error);
  }
}

export { db };
export const storage = app ? getStorage(app) : null;

export default app;
