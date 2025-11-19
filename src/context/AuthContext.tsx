import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User, 
  onAuthStateChanged, 
  signInAnonymously as firebaseSignInAnonymously, 
  signInWithPopup as firebaseSignInWithPopup, 
  signOut as firebaseSignOut, 
  linkWithPopup as firebaseLinkWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebaseConfig';
import { Box, CircularProgress } from '@mui/material';

// O que o contexto vai entregar (dados e funções de login/logout)
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  linkGoogleAccount: () => Promise<void>;
  logout: () => Promise<void>;
}

// Cria o contexto. Começa como 'undefined' para forçar o uso dentro do Provider.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente que "empacota" o app e entrega os dados de autenticação.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fica escutando as mudanças no estado de autenticação do Firebase.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Acabou o carregamento inicial.
    });

    // Para de escutar quando o componente sumir.
    return () => unsubscribe();
  }, []);

  // --- Funções de Login/Logout ---

  /**
   * Entra com Google (popup).
   */
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await firebaseSignInWithPopup(auth, googleProvider);
      // O useEffect já cuida de atualizar o 'user'
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setLoading(false); 
    }
  };

  /**
   * Entra como usuário anônimo.
   */
  const signInAnonymously = async () => {
    setLoading(true);
    try {
      await firebaseSignInAnonymously(auth);
      // O useEffect já cuida de atualizar o 'user'
    } catch (error) {
      console.error("Erro no login anônimo:", error);
      setLoading(false);
    }
  };

  /**
   * Liga a conta Google ao usuário anônimo atual.
   */
  const linkGoogleAccount = async () => {
    if (!auth.currentUser) return; // Se não tem usuário, para.

    try {
      await firebaseLinkWithPopup(auth.currentUser, googleProvider);
      alert("Conta Google vinculada com sucesso!");
    } catch (error) {
      console.error("Erro ao vincular conta:", error);
      alert("Erro ao vincular conta. É possível que esta conta Google já esteja em uso por outro usuário.");
    }
  };

  /**
   * Sai da conta.
   */
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // O useEffect já define o 'user' como null
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // ------------------------------------

  // Mostra um spinner enquanto o estado do Firebase não é verificado.
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Entrega o contexto para os componentes filhos.
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signInWithGoogle, 
        signInAnonymously, 
        linkGoogleAccount, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook que facilita usar o contexto em qualquer lugar.
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};