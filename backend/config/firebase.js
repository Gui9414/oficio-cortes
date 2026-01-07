import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicializar Firebase Admin
let serviceAccount;

try {
  // Tenta carregar o arquivo de credenciais
  const keyPath = join(__dirname, '../../firebase-admin-key.json');
  serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin inicializado com sucesso');
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase Admin:', error.message);
  console.log('📋 Siga as instruções em FIREBASE_SETUP.md para configurar');
  process.exit(1);
}

// Exportar serviços
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin;
