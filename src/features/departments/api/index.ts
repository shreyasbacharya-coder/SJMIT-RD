import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/firebase';
import { Department } from '../../../shared/types';

const COLLECTION = 'departments';

export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    if (!db) return [];
    const q = query(collection(db, COLLECTION), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
  },

  getById: async (id: string): Promise<Department> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) throw new Error('Department not found');
    return { id: snapshot.id, ...snapshot.data() } as Department;
  },

  add: async (data: Omit<Department, 'id'>): Promise<string> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = await addDoc(collection(db, COLLECTION), data);
    return docRef.id;
  },

  update: async (id: string, data: Partial<Department>): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  }
};
