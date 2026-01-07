// Script para criar usuário admin no Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function criarAdmin() {
  try {
    console.log('Criando usuário admin...');
    
    // Criar admin no Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@oficiocortes.com',
      'admin123'
    );
    
    const user = userCredential.user;
    
    // Salvar dados do admin no Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      nome: 'Admin',
      email: 'admin@oficiocortes.com',
      telefone: '11918474607',
      tipo: 'admin',
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Admin criado com sucesso!');
    console.log('Email: admin@oficiocortes.com');
    console.log('Senha: admin123');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️ Admin já existe!');
    } else {
      console.error('Erro:', error.message);
    }
    process.exit(1);
  }
}

criarAdmin();
