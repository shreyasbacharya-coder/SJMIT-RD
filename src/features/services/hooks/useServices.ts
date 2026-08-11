'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../api';
import { Service, ServiceEquipment } from '../../../shared/types';

export function useServices(deptId?: string) {
  return useQuery({
    queryKey: ['services', deptId],
    queryFn: () => deptId ? servicesApi.getByDepartment(deptId) : servicesApi.getAll(),
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => servicesApi.getById(id!),
    enabled: !!id,
  });
}

export function useAddService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Service, 'id'>) => servicesApi.add(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) => servicesApi.update(id, data),
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
        queryClient.invalidateQueries({ queryKey: ['services', variables.id] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useAddServiceEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, equipment }: { serviceId: string; equipment: Omit<ServiceEquipment, 'id'> }) => servicesApi.addEquipment(serviceId, equipment),
    onSuccess: (_data, { serviceId }) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services', serviceId] });
    },
  });
}

export function useDeleteServiceEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, equipmentId }: { serviceId: string; equipmentId: string }) => servicesApi.deleteEquipment(serviceId, equipmentId),
    onSuccess: (_data, { serviceId }) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services', serviceId] });
    },
  });
}

export function useUpdateServiceEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, equipment }: { serviceId: string; equipment: ServiceEquipment }) => servicesApi.updateEquipment(serviceId, equipment),
    onSuccess: (_data, { serviceId }) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services', serviceId] });
    },
  });
}
