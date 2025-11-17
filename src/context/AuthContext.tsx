import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { Box, CircularProgress } from '@mui/material';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta fazer login anônimo imediatamente
    signInAnonymously(auth).catch((error) => {
      console.error("Erro no login anônimo:", error);
    });

    // Ouve mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpa o listener ao desmontar
    return () => unsubscribe();
  }, []);

  // Exibe um loader global enquanto autentica
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
