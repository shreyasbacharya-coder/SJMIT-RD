'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facilitiesApi } from '../api';
import { Facility, FacilityEquipment } from '../../../shared/types';

export function useFacilities(deptId?: string) {
  return useQuery({
    queryKey: ['facilities', deptId],
    queryFn: () => deptId ? facilitiesApi.getByDepartment(deptId) : facilitiesApi.getAll(),
  });
}

export function useFacility(id: string | undefined) {
  return useQuery({
    queryKey: ['facilities', id],
    queryFn: () => facilitiesApi.getById(id!),
    enabled: !!id,
  });
}

export function useAddFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Facility, 'id'>) => facilitiesApi.add(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['facilities'] }),
  });
}

export function useUpdateFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Facility> }) => facilitiesApi.update(id, data),
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['facilities'] });
        queryClient.invalidateQueries({ queryKey: ['facilities', variables.id] });
    },
  });
}

export function useDeleteFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => facilitiesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['facilities'] }),
  });
}

export function useAddFacilityEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ facilityId, equipment }: { facilityId: string; equipment: Omit<FacilityEquipment, 'id'> }) => facilitiesApi.addEquipment(facilityId, equipment),
    onSuccess: (_data, { facilityId }) => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facilities', facilityId] });
    },
  });
}

export function useDeleteFacilityEquipment() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ facilityId, equipmentId }: { facilityId: string; equipmentId: string }) => facilitiesApi.deleteEquipment(facilityId, equipmentId),
      onSuccess: (_data, { facilityId }) => {
        queryClient.invalidateQueries({ queryKey: ['facilities'] });
        queryClient.invalidateQueries({ queryKey: ['facilities', facilityId] });
      },
    });
}
  
export function useUpdateFacilityEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ facilityId, equipment }: { facilityId: string; equipment: FacilityEquipment }) => facilitiesApi.updateEquipment(facilityId, equipment),
    onSuccess: (_data, { facilityId }) => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facilities', facilityId] });
    },
  });
}
