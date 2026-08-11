import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/firebase';
import { Service, ServiceEquipment } from '../../../shared/types';

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    if (!db) return [];
    const q = query(collection(db, 'services'), orderBy('department'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  },

  getById: async (id: string): Promise<Service> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = doc(db, 'services', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) throw new Error('Service not found');
    return { id: snapshot.id, ...snapshot.data() } as Service;
  },

  getByDepartment: async (deptId: string): Promise<Service[]> => {
    if (!db) return [];
    const q = query(
      collection(db, 'services'),
      where('deptId', '==', deptId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  },

  add: async (data: Omit<Service, 'id'>): Promise<string> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = await addDoc(collection(db, 'services'), data);
    return docRef.id;
  },

  update: async (id: string, data: Partial<Service>): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = doc(db, 'services', id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = doc(db, 'services', id);
    await deleteDoc(docRef);
  },
  
  addEquipment: async (serviceId: string, equipment: Omit<ServiceEquipment, 'id'>): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const serviceRef = doc(db, 'services', serviceId);
    const serviceSnap = await getDoc(serviceRef);
    if (!serviceSnap.exists()) throw new Error('Service not found');
    
    const serviceData = serviceSnap.data() as Service;
    const newEquipment = {
      ...equipment,
      id: `eq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    const updatedEquipments = [...(serviceData.equipments || []), newEquipment];
    
    await updateDoc(serviceRef, { equipments: updatedEquipments });
  },

  deleteEquipment: async (serviceId: string, equipmentId: string): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const serviceRef = doc(db, 'services', serviceId);
    const serviceSnap = await getDoc(serviceRef);
    if (!serviceSnap.exists()) throw new Error('Service not found');
    
    const serviceData = serviceSnap.data() as Service;
    const updatedEquipments = serviceData.equipments.filter(eq => eq.id !== equipmentId);
    
    await updateDoc(serviceRef, { equipments: updatedEquipments });
  },

  updateEquipment: async (serviceId: string, equipment: ServiceEquipment): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const serviceRef = doc(db, 'services', serviceId);
    const serviceSnap = await getDoc(serviceRef);
    if (!serviceSnap.exists()) throw new Error('Service not found');

    const serviceData = serviceSnap.data() as Service;
    const equipmentIndex = serviceData.equipments.findIndex(eq => eq.id === equipment.id);

    if (equipmentIndex === -1) throw new Error('Equipment not found in service');

    const updatedEquipments = [...serviceData.equipments];
    updatedEquipments[equipmentIndex] = equipment;

    await updateDoc(serviceRef, { equipments: updatedEquipments });
  }
};
