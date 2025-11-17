// Em src/context/AuthContext.tsx
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

// 1. Define o tipo do que o contexto irá fornecer
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  linkGoogleAccount: () => Promise<void>;
  logout: () => Promise<void>;
}

// 2. Cria o contexto, inicializando como 'undefined'
// Isso nos ajuda a garantir que ele só será usado dentro de um Provider
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Cria o componente Provedor
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Agora, o useEffect apenas "ouve" o estado de autenticação.
    // Ele não força mais um login anônimo ao carregar.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Marca como carregado assim que temos uma resposta (usuário ou null)
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribe();
  }, []);

  // --- Funções de Autenticação ---

  /**
   * Inicia o fluxo de login com o popup do Google.
   */
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await firebaseSignInWithPopup(auth, googleProvider);
      // O onAuthStateChanged vai lidar com a atualização do estado 'user'
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setLoading(false); // Para o loading se houver erro
    }
  };

  /**
   * Inicia o fluxo de login anônimo.
   */
  const signInAnonymously = async () => {
    setLoading(true);
    try {
      await firebaseSignInAnonymously(auth);
      // O onAuthStateChanged vai lidar com a atualização do estado 'user'
    } catch (error) {
      console.error("Erro no login anônimo:", error);
      setLoading(false);
    }
  };

  /**
   * Vincula a conta Google ao usuário anônimo atual.
   * Isso "converte" a conta anônima em uma conta Google permanente.
   */
  const linkGoogleAccount = async () => {
    if (!auth.currentUser) {
      console.error("Nenhum usuário logado para vincular.");
      return;
    }

    try {
      // Esta função do Firebase cuida de vincular o provedor
      await firebaseLinkWithPopup(auth.currentUser, googleProvider);
      alert("Conta Google vinculada com sucesso!");
      // O onAuthStateChanged vai atualizar o 'user' (agora não mais anônimo)
    } catch (error) {
      console.error("Erro ao vincular conta:", error);
      alert("Erro ao vincular conta. É possível que esta conta Google já esteja em uso por outro usuário.");
    }
  };

  /**
   * Desloga o usuário atual (seja Google ou anônimo).
   */
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // O onAuthStateChanged vai definir o 'user' como null
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // ------------------------------------

  // Exibe um spinner global enquanto o Firebase verifica o estado de auth
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Quando não estiver carregando, fornece o usuário e as funções para os componentes filhos
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

// Helper hook to consume the AuthContext safely
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};