import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase com fallbacks seguros
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'oficio-cortes.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'oficio-cortes',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'oficio-cortes.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
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
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export default app;
