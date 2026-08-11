export type Department = {
  id: string;
  name: string;
  hod?: string;
  email?: string;
  contact?: string;
  image?: string;
};

export type FacilityEquipment = {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  tags?: string[];
  isAvailable?: boolean;
};

export type Facility = {
  id: string;
  deptId: string;
  department: string; // Display name
  labName: string;
  facultyInCharge?: string;
  researchFocus?: string;
  email?: string;
  contact?: string;
  workingDays?: string;
  equipments: FacilityEquipment[];
};

export type ServiceEquipment = {
  id: string;
  name: string;
  description?: string;
  utilizationRate?: string;
  images?: string[];
  tags?: string[];
  isAvailable?: boolean;
};

export type Service = {
  id: string;
  deptId: string;
  department: string;
  serviceName?: string;
  facultyInCharge?: string;
  email?: string;
  contact?: string;
  suitableDates?: string;
  equipments: ServiceEquipment[];
};
