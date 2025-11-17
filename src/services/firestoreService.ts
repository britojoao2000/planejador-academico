import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  writeBatch,
  getDocs
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { DisciplinaUsuario } from "../types/types";

// Tipo para os dados do formulário (sem o ID, que é gerado pelo Firestore)
export type DisciplinaUsuarioData = Omit<DisciplinaUsuario, 'id'>;

// Caminho da coleção de um usuário
const getDisciplinasCollection = (userId: string) => {
  return collection(db, 'usuarios', userId, 'disciplinas');
}

// 1. Ouvir (listen) as disciplinas em tempo real (Recurso 1)
export const getDisciplinasListener = (
  userId: string, 
  callback: (disciplinas: DisciplinaUsuario[]) => void
) => {
  const q = query(getDisciplinasCollection(userId));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const disciplinas: DisciplinaUsuario[] = [];
    querySnapshot.forEach((doc) => {
      disciplinas.push({ id: doc.id, ...doc.data() } as DisciplinaUsuario);
    });
    callback(disciplinas);
  });

  return unsubscribe; // Retorna a função para "desligar" o listener
};

// 2. Adicionar uma nova disciplina
export const addDisciplina = (userId: string, data: DisciplinaUsuarioData) => {
  return addDoc(getDisciplinasCollection(userId), data);
};

// 3. Atualizar uma disciplina existente
export const updateDisciplina = (userId: string, docId: string, data: Partial<DisciplinaUsuarioData>) => {
  const docRef = doc(db, 'usuarios', userId, 'disciplinas', docId);
  return updateDoc(docRef, data);
};

// 4. Deletar uma disciplina
export const deleteDisciplina = (userId: string, docId: string) => {
  const docRef = doc(db, 'usuarios', userId, 'disciplinas', docId);
  return deleteDoc(docRef);
};

// 5. Exportar Dados (Recurso 7)
export const exportDisciplinas = async (userId: string): Promise<DisciplinaUsuarioData[]> => {
  const q = query(getDisciplinasCollection(userId));
  const querySnapshot = await getDocs(q);
  const disciplinas: DisciplinaUsuarioData[] = [];
  querySnapshot.forEach((doc) => {
    // Remove 'id' para uma exportação limpa
    const { id, ...data } = doc.data() as DisciplinaUsuario; 
    disciplinas.push(data as DisciplinaUsuarioData);
  });
  return disciplinas;
};

// 6. Importar Dados (Recurso 7)
export const importDisciplinas = async (userId: string, disciplinas: DisciplinaUsuarioData[]) => {
  const batch = writeBatch(db);
  const collectionRef = getDisciplinasCollection(userId);

  disciplinas.forEach((disciplina) => {
    const docRef = doc(collectionRef); // Cria um novo doc com ID automático
    batch.set(docRef, disciplina);
  });

  await batch.commit();
};