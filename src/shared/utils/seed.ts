import { db } from '../../lib/firebase/firebase';
import { collection, writeBatch, doc, getCountFromServer } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function seedDatabase() {
  if (!db) {
    console.error("Firestore is not initialized.");
    throw new Error("Firestore is not initialized.");
  }
  
  const departmentsCollection = collection(db, 'departments');
  
  try {
    const departmentsSnapshot = await getCountFromServer(departmentsCollection);
    if (departmentsSnapshot.data().count > 0) {
      console.log('Database already contains data. Skipping seed.');
      return;
    }
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError({
        path: `/${departmentsCollection.path}`,
        operation: 'list',
        requestResourceData: { note: 'Checking if departments collection is empty before seeding.' }
      });
      errorEmitter.emit('permission-error', permissionError);
    }
    // Re-throw the error to be handled by the calling function's catch block
    throw error;
  }
  
  console.log('Database is empty. Seeding...');
  const batch = writeBatch(db);

  // --- Departments ---
  const civilId = 'civil-eng';
  const civilRef = doc(db, 'departments', civilId);
  batch.set(civilRef, {
    name: 'Civil Engineering',
    hod: 'Dr. Srishaila J M',
    email: 'hod.civil@sjmit.ac.in',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800'
  });

  const cseId = 'cse-dept';
  const cseRef = doc(db, 'departments', cseId);
  batch.set(cseRef, {
    name: 'Computer Science & Engineering',
    hod: 'Dr. Aravinda T V',
    email: 'tvaravinda@gmail.com',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
  });

  const eceId = 'ece-dept';
  const eceRef = doc(db, 'departments', eceId);
  batch.set(eceRef, {
    name: 'Electronics & Communication',
    hod: 'Dr. Siddesh K B',
    email: 'chetan.s@sjmit.ac.in',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
  });
  
  const eeeId = 'eee-dept';
  const eeeRef = doc(db, 'departments', eeeId);
  batch.set(eeeRef, {
    name: 'Electrical & Electronics',
    hod: 'Dr. Kumarswamy B G',
    email: 'scm.eee@sjmit.ac.in',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800'
  });

  const mechId = 'mech-eng';
  const mechRef = doc(db, 'departments', mechId);
  batch.set(mechRef, {
    name: 'Mechanical Engineering',
    hod: 'Dr. Bharath P B',
    email: 'rajesham@sjmit.ac.in',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800'
  });


  // --- Facilities ---

  // Civil Facility
  batch.set(doc(db, 'facilities', 'civil-rd-centre'), {
    labName: 'Civil Engineering R&D Centre',
    facultyInCharge: 'Dr. Srishaila J M',
    department: 'Civil Engineering',
    researchFocus: 'Construction Technology, Concrete Technology and Repair & Rehabilitation of structure',
    email: 'hod.civil@sjmit.ac.in',
    contact: '',
    deptId: civilId,
    equipments: [
      { id: 'civil-eq-1', name: 'Compression testing machine', isAvailable: true, tags: ['Testing', 'Concrete'] },
      { id: 'civil-eq-2', name: 'Flexural testing machine', isAvailable: true, tags: ['Testing', 'Structural'] },
      { id: 'civil-eq-3', name: 'Concrete Permeability testing machine', isAvailable: true, tags: ['Testing', 'Concrete'] },
      { id: 'civil-eq-4', name: 'Turbidity Meter', isAvailable: true, tags: ['Water Quality'] },
      { id: 'civil-eq-5', name: 'PH Meter', isAvailable: true, tags: ['Water Quality', 'Chemistry'] },
      { id: 'civil-eq-6', name: 'Spectrophotometer', isAvailable: true, tags: ['Chemistry', 'Analysis'] },
      { id: 'civil-eq-7', name: 'Rapid moisture meter', isAvailable: true, tags: ['Testing', 'Materials'] },
      { id: 'civil-eq-8', name: 'Unconfined Compression test apparatus', isAvailable: true, tags: ['Geotechnical', 'Testing'] },
      { id: 'civil-eq-9', name: 'Direct shear test apparatus', isAvailable: true, tags: ['Geotechnical', 'Testing'] },
    ]
  });

  // CSE Facility
  batch.set(doc(db, 'facilities', 'cse-rd-centre'), {
    labName: 'CSE R&D Centre',
    facultyInCharge: 'Dr. Aravinda T V',
    department: 'Computer Science & Engineering',
    researchFocus: 'Image Processing, Multimedia and Networking',
    email: 'tvaravinda@gmail.com',
    contact: '',
    deptId: cseId,
    equipments: [
      { id: 'cse-eq-1', name: 'Computers – 02', description: 'For complex computations & simulations.', isAvailable: true, tags: ['HPC', 'Simulation'] },
      { id: 'cse-eq-2', name: 'Software’s: Win 11, Visual Studio, VC++, ImageJ/Fiji', description: 'Suite of software for development and analysis.', isAvailable: true, tags: ['Software', 'Development'] },
    ]
  });

  // ECE Facility
  batch.set(doc(db, 'facilities', 'ece-rd-centre'), {
    labName: 'E&CE R&D Centre',
    facultyInCharge: 'Dr. Chetan S',
    department: 'Electronics & Communication',
    researchFocus: 'Image Processing, VTU',
    email: 'chetan.s@sjmit.ac.in',
    contact: '',
    deptId: eceId,
    equipments: [
      { id: 'ece-eq-1', name: 'Matlab 2019b Software', description: 'Industry-standard software for technical computing.', isAvailable: true, tags: ['Software', 'Simulation'] },
    ]
  });

  // EEE Facility
  batch.set(doc(db, 'facilities', 'eee-rd-centre'), {
    labName: 'EEE R&D Centre',
    facultyInCharge: 'Dr. Manujath S C',
    department: 'Electrical & Electronics',
    researchFocus: 'Energy sustainability in residential and commercialsectors an empirical study',
    email: 'scm.eee@sjmit.ac.in',
    contact: '',
    deptId: eeeId,
    equipments: [
      { id: 'eee-eq-1', name: 'Two digital oscilloscopes - 100Mhz Bandwidth', isAvailable: true, tags: ['Electronics', 'Testing'] },
      { id: 'eee-eq-2', name: 'Candence software', isAvailable: true, tags: ['Software', 'VLSI'] },
      { id: 'eee-eq-3', name: 'power system simulation software', isAvailable: true, tags: ['Software', 'Simulation'] },
      { id: 'eee-eq-4', name: 'Intel Core i5 Processor Computer Systems', isAvailable: true, tags: ['Hardware', 'Computing'] },
    ]
  });

  // Mechanical Facility
  batch.set(doc(db, 'facilities', 'mech-rd-centre'), {
    labName: 'Mechanical Engineering R&D Centre',
    facultyInCharge: 'Dr. Rajesh A M',
    department: 'Mechanical Engineering',
    researchFocus: 'Investigations of high temperature influence on wear properties of heat treated A413 alloy with intermediate particles',
    email: 'rajesham@sjmit.ac.in',
    contact: '',
    deptId: mechId,
    equipments: [
        { id: 'mech-eq-1', name: 'Induction furnace with cooling tower', isAvailable: true, tags: ['Metallurgy', 'Casting'] },
        { id: 'mech-eq-2', name: 'Polishing machine (double disc)', isAvailable: true, tags: ['Materials', 'Preparation'] },
        { id: 'mech-eq-3', name: 'Muffle furnace (Heat treatment)', isAvailable: true, tags: ['Metallurgy', 'Heat Treatment'] },
        { id: 'mech-eq-4', name: 'Muffle furnace (Melting)', isAvailable: true, tags: ['Metallurgy', 'Melting'] },
        { id: 'mech-eq-5', name: 'Image Analyzer with accessories', isAvailable: true, tags: ['Analysis', 'Microscopy'] },
        { id: 'mech-eq-6', name: 'Wear testing machine with software', isAvailable: true, tags: ['Testing', 'Tribology'] },
        { id: 'mech-eq-7', name: 'Vickers’s Micro Hardness tester with software', isAvailable: true, tags: ['Testing', 'Hardness'] },
        { id: 'mech-eq-8', name: 'UTM with controller set up (50 KN capacity)', isAvailable: true, tags: ['Testing', 'Material Strength'] },
    ]
  });
  
  // --- Services ---

  // Civil Service
  batch.set(doc(db, 'services', 'civil-testing-services'), {
    deptId: civilId,
    department: 'Civil Engineering',
    suitableDates: 'Monday to Friday (working days)',
    equipments: [
      { id: 'civil-serv-eq-1', name: 'Compression testing machine', utilizationRate: '25hrs/week', isAvailable: true },
      { id: 'civil-serv-eq-2', name: 'Flexural testing machine', utilizationRate: '12hrs/Week', isAvailable: true },
      { id: 'civil-serv-eq-3', name: 'Concrete Permeability testing machine', utilizationRate: '12hrs/Week', isAvailable: true },
      { id: 'civil-serv-eq-4', name: 'Turbidity Meter', utilizationRate: '16hrs/Week', isAvailable: true },
      { id: 'civil-serv-eq-5', name: 'PH Meter', utilizationRate: '16hrs/Week', isAvailable: true },
      { id: 'civil-serv-eq-6', name: 'Spectrophotometer', utilizationRate: '16hrs/Week', isAvailable: true },
      { id: 'civil-serv-eq-7', name: 'Rapid moisture meter', utilizationRate: '18hrs/Week', isAvailable: true },
      { id: 'civil-serv-eq-8', name: 'Unconfined Compression test apparatus', utilizationRate: '18hrs/Week', isAvailable: true },
      { id: 'civil-serv-eq-9', name: 'Direct shear test apparatus', utilizationRate: '18hrs/Week', isAvailable: true },
    ]
  });

  // CSE Service
  batch.set(doc(db, 'services', 'cse-computing-services'), {
    deptId: cseId,
    department: 'Computer Science and Engineering',
    suitableDates: 'Monday to Friday (working days)',
    equipments: [
      { id: 'cse-serv-eq-1', name: 'Computers', utilizationRate: '50%', isAvailable: true },
    ]
  });

  // ECE Service
  batch.set(doc(db, 'services', 'ece-software-services'), {
    deptId: eceId,
    department: 'Electronics & Communication Engineering',
    suitableDates: 'Monday to Friday (working days)',
    equipments: [
      { id: 'ece-serv-eq-1', name: 'Matlab 2019b Software', utilizationRate: '50%', isAvailable: true },
    ]
  });
  
  // EEE Service
  batch.set(doc(db, 'services', 'eee-testing-services'), {
    deptId: eeeId,
    department: 'Electrical and Electronics Engineering',
    suitableDates: 'Monday to Friday (working days)',
    equipments: [
      { id: 'eee-serv-eq-1', name: 'Two digital oscilloscopes - 100Mhz Bandwidth', utilizationRate: '50%', isAvailable: true },
    ]
  });
  
  // Mechanical Service
  batch.set(doc(db, 'services', 'mech-testing-services'), {
    deptId: mechId,
    department: 'Mechanical Engineering',
    suitableDates: 'Monday to Friday (working days)',
    equipments: [
        { id: 'mech-serv-eq-1', name: 'Induction furnace with cooling tower', utilizationRate: '100%', isAvailable: true },
        { id: 'mech-serv-eq-2', name: 'Polishing machine (double disc)', utilizationRate: '100%', isAvailable: true },
        { id: 'mech-serv-eq-3', name: 'Muffle furnace (Heat treatment)', utilizationRate: '100%', isAvailable: true },
        { id: 'mech-serv-eq-4', name: 'Muffle furnace (Melting)', utilizationRate: '100%', isAvailable: true },
        { id: 'mech-serv-eq-5', name: 'Image Analyzer with accessories', utilizationRate: '100%', isAvailable: true },
        { id: 'mech-serv-eq-6', name: 'Wear testing machine with software', utilizationRate: '100%', isAvailable: true },
        { id: 'mech-serv-eq-7', name: 'Vickers’s Micro Hardness tester with software', utilizationRate: '100%', isAvailable: true },
        { id: 'mech-serv-eq-8', name: 'UTM with controller set up (50 KN capacity)', utilizationRate: '100%', isAvailable: true },
    ]
  });


  try {
    await batch.commit();
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError({
        path: `/[batch-write]`,
        operation: 'write',
        requestResourceData: { note: 'Seeding multiple documents for departments, facilities, and services.' }
      });
      errorEmitter.emit('permission-error', permissionError);
    }
    // Re-throw the error to be handled by the calling function's catch block
    throw error;
  }
}
