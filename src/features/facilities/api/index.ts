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
import { Facility, FacilityEquipment } from '../../../shared/types';

export const facilitiesApi = {
  getAll: async (): Promise<Facility[]> => {
    if (!db) return [];
    const q = query(collection(db, 'facilities'), orderBy('labName'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Facility));
  },

  getById: async (id: string): Promise<Facility> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = doc(db, 'facilities', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) throw new Error('Facility not found');
    return { id: snapshot.id, ...snapshot.data() } as Facility;
  },

  getByDepartment: async (deptId: string): Promise<Facility[]> => {
    if (!db) return [];
    const q = query(
      collection(db, 'facilities'), 
      where('deptId', '==', deptId),
      orderBy('labName')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Facility));
  },

  add: async (data: Omit<Facility, 'id'>): Promise<string> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = await addDoc(collection(db, 'facilities'), data);
    return docRef.id;
  },

  update: async (id: string, data: Partial<Facility>): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = doc(db, 'facilities', id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const docRef = doc(db, 'facilities', id);
    await deleteDoc(docRef);
  },
  
  addEquipment: async (facilityId: string, equipment: Omit<FacilityEquipment, 'id'>): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const facilityRef = doc(db, 'facilities', facilityId);
    const facilitySnap = await getDoc(facilityRef);
    if (!facilitySnap.exists()) throw new Error('Facility not found');
    
    const facilityData = facilitySnap.data() as Facility;
    const newEquipment = {
      ...equipment,
      id: `eq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    const updatedEquipments = [...(facilityData.equipments || []), newEquipment];
    
    await updateDoc(facilityRef, { equipments: updatedEquipments });
  },

  deleteEquipment: async (facilityId: string, equipmentId: string): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const facilityRef = doc(db, 'facilities', facilityId);
    const facilitySnap = await getDoc(facilityRef);
    if (!facilitySnap.exists()) throw new Error('Facility not found');
    
    const facilityData = facilitySnap.data() as Facility;
    const updatedEquipments = facilityData.equipments.filter(eq => eq.id !== equipmentId);
    
    await updateDoc(facilityRef, { equipments: updatedEquipments });
  },

  updateEquipment: async (facilityId: string, equipment: FacilityEquipment): Promise<void> => {
    if (!db) throw new Error('Firestore is not initialized.');
    const facilityRef = doc(db, 'facilities', facilityId);
    const facilitySnap = await getDoc(facilityRef);
    if (!facilitySnap.exists()) throw new Error('Facility not found');

    const facilityData = facilitySnap.data() as Facility;
    const equipmentIndex = facilityData.equipments.findIndex(eq => eq.id === equipment.id);

    if (equipmentIndex === -1) throw new Error('Equipment not found in facility');

    const updatedEquipments = [...facilityData.equipments];
    updatedEquipments[equipmentIndex] = equipment;

    await updateDoc(facilityRef, { equipments: updatedEquipments });
  }
};
