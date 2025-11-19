import React, { createContext, useState, useEffect } from 'react';
import { type DisciplinaUsuario } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import * as firestoreService from '../services/firestoreService'

// Define a estrutura do contexto das disciplinas
type DisciplinaContextType = {
  disciplinas: DisciplinaUsuario[];
  loading: boolean;
  addDisciplina: (data: firestoreService.DisciplinaUsuarioData) => Promise<void>;
  updateDisciplina: (docId: string, data: Partial<firestoreService.DisciplinaUsuarioData>) => Promise<void>;
  deleteDisciplina: (docId: string) => Promise<void>;
};

export const DisciplinasContext = createContext<DisciplinaContextType | undefined>(undefined);

export const DisciplinasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [disciplinas, setDisciplinas] = useState<DisciplinaUsuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      // Configura o monitoramento em tempo real das disciplinas do usuário
      const unsubscribe = firestoreService.getDisciplinasListener(user.uid, (data) => {
        setDisciplinas(data);
        setLoading(false);
      });

      // Para de ouvir as mudanças ao sair
      return () => unsubscribe();
    } else {
      // Sem usuário, limpa os dados
      setDisciplinas([]);
      setLoading(false);
    }
  }, [user]);

  const addDisciplina = async (data: firestoreService.DisciplinaUsuarioData) => {
    if (!user) throw new Error("Usuário não autenticado");
    await firestoreService.addDisciplina(user.uid, data);
  };

  const updateDisciplina = async (docId: string, data: Partial<firestoreService.DisciplinaUsuarioData>) => {
    if (!user) throw new Error("Usuário não autenticado");
    await firestoreService.updateDisciplina(user.uid, docId, data);
  };

  const deleteDisciplina = async (docId: string) => {
    if (!user) throw new Error("Usuário não autenticado");
    await firestoreService.deleteDisciplina(user.uid, docId);
  };

  return (
    <DisciplinasContext.Provider 
      value={{ disciplinas, loading, addDisciplina, updateDisciplina, deleteDisciplina }}
    >
      {children}
    </DisciplinasContext.Provider>
  );
};