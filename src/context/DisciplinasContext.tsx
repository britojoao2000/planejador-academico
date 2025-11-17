import React, { createContext, useState, useEffect } from 'react';
import { type DisciplinaUsuario } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import * as firestoreService from '../services/firestoreService'

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
      const unsubscribe = firestoreService.getDisciplinasListener(user.uid, (data) => {
        setDisciplinas(data);
        setLoading(false);
      });

      // Limpa o listener ao desmontar ou se o usuário mudar
      return () => unsubscribe();
    } else {
      // Se não há usuário (ex: logout), limpa os dados
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