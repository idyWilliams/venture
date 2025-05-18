import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
;
import { AxiosError, AxiosRequestConfig } from 'axios';
import api from '../lib/api';

// Generic hook for GET requests
export function useApiQuery<T>(
  endpoint: string,
  queryKey: any[],
  config?: AxiosRequestConfig,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError) => void;
  }
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await api.get<T>(endpoint, config);
      return response.data;
    },
    enabled: options?.enabled,
    refetchInterval: options?.refetchInterval,
    //@ts-ignore
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

// Generic hook for POST, PUT, DELETE mutations
export function useApiMutation<TData, TVariables>(
  method: 'post' | 'put' | 'delete',
  endpoint: string,
  options?: {
    invalidateQueries?: any[];
    onSuccess?: (data: TData) => void;
    onError?: (error: AxiosError) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await api[method]<TData>(endpoint, variables);
      return response.data;
    },
    onSuccess: (data) => {
      if (options?.invalidateQueries) {
        // Invalidate queries to refetch data
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: options?.onError,
  });
}