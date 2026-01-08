import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const authService = {
  // Fazer login com Firebase Auth
  async login(email, senha) {
    try {
      if (!auth) {
        throw new Error('Firebase não inicializado');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      // Buscar dados do usuário no Firestore
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      const userData = userDoc.data();
      
      return {
        user: {
          id: user.uid,
          email: user.email,
          nome: userData?.nome || 'Usuário',
          telefone: userData?.telefone || '',
          tipo: userData?.role || 'cliente',
          ...userData
        },
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Email ou senha incorretos');
      }
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Muitas tentativas. Tente novamente mais tarde.');
      }
      throw new Error(error.message || 'Erro ao fazer login');
    }
  },

  // Registrar novo usuário com Firebase Auth
  async register(nome, email, senha, telefone = '') {
    try {
      if (!auth || !db) {
        throw new Error('Firebase não inicializado');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      // Criar documento do usuário no Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        nome,
        email,
        telefone,
        role: 'cliente',
        criadoEm: new Date()
      });
      
      return {
        user: {
          id: user.uid,
          email: user.email,
          nome,
          telefone,
          tipo: 'cliente'
        },
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Erro no registro:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este email já está cadastrado');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('A senha deve ter no mínimo 6 caracteres');
      }
      throw new Error(error.message || 'Erro ao criar conta');
    }
  },

  // Buscar perfil do usuário logado
  async getProfile() {
    try {
      if (!auth || !db) {
        throw new Error('Firebase não inicializado');
      }
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      const userData = userDoc.data();
      
      return {
        id: user.uid,
        email: user.email,
        ...userData
      };
    } catch (error) {
      throw new Error(error.message || 'Erro ao buscar perfil');
    }
  },

  // Atualizar perfil
  async updateProfile(dados) {
    try {
      if (!auth || !db) {
        throw new Error('Firebase não inicializado');
      }
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      await setDoc(doc(db, 'usuarios', user.uid), dados, { merge: true });
      return await this.getProfile();
    } catch (error) {
      throw new Error(error.message || 'Erro ao atualizar perfil');
    }
  },

  // Fazer logout
  async logout() {
    try {
      if (auth) {
        await signOut(auth);
      }
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },
  
  // Observar mudanças no estado de autenticação
  onAuthStateChange(callback) {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
  }
};
