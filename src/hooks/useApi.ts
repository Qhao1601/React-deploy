import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseService } from "@/services/base.service";
import { IApiResponse, IApiMessageResponse } from "@/interfaces/api.response";
import { buildUrlWithQueryString } from "@/utils/helper"
import { toast } from "sonner";


const useApi = () => {

    const queryClient = useQueryClient()

    // queryParam là truyền điều kiện trên url . khi tìm phân trang
    const usePagiante = <T>(endpoint: string, queryParams?: Record<string, string>) => {
        const fullUrl = buildUrlWithQueryString(endpoint, queryParams)
        return useQuery<IApiResponse<T, unknown>, Error>({
            queryKey: [endpoint, queryParams],
            queryFn: () => baseService.paginate<T>(fullUrl)
        })
    }

    const useShow = <T>(endpoint: string, id: number, options?: { enabled?: boolean }) => {
        return useQuery<IApiResponse<T, unknown>, Error>({
            queryKey: [endpoint, id],
            queryFn: () => baseService.show<T>(endpoint, id),
            enabled: options?.enabled ?? true
        });
    }

    const useCreate = <T, P>(endpoint: string) => {
        return useMutation<IApiResponse<T, unknown>, Error, P>({
            mutationFn: (payload: P) => baseService.create<T, P>(endpoint, payload),
            onSuccess: () => {
                // khi thêm xong rồi xóa endpoint củ 
                queryClient.invalidateQueries({ queryKey: [endpoint], exact: true })

            },
            onError: (error) => {
                toast.error(`Lổi khi tạo bản ghi: ${error.message}`)
            }
        })
    }

    const useUpdate = <T, P>(endpoint: string, id: number) => {
        return useMutation<IApiResponse<P, unknown>, Error, P>({
            mutationFn: (payload: P) => baseService.update<T, P>(endpoint, id, payload),
            onSuccess: (response) => {
                queryClient.invalidateQueries({ queryKey: [endpoint], exact: true })
                queryClient.invalidateQueries({ queryKey: [endpoint, id] })
                toast.success(response.message)
            },
            onError: (error) => {
                toast.error(`Lổi khi tạo bản ghi: ${error.message}`)
            }
        })
    }

    const useUpdatePost = <T, P>(endpoint: string, id: number) => {
        return useMutation<IApiResponse<P, unknown>, Error, P>({
            mutationFn: (payload: P) => baseService.updatePost<T, P>(endpoint, id, payload),
            onSuccess: (response) => {
                queryClient.invalidateQueries({ queryKey: [endpoint], exact: true })
                queryClient.invalidateQueries({ queryKey: [endpoint, id] })
                toast.success(response.message)
            },
            onError: (error) => {
                toast.error(`Lổi khi tạo bản ghi: ${error.message}`)
            }
        })
    }

    const usePatchUpdate = <T, P>(endpoint: string) => {
        return useMutation<IApiResponse<P, unknown>, Error, { payload: P, id: number }>({
            mutationFn: ({ payload, id }) => baseService.patch<T, P>(endpoint, id, payload),
            onSuccess: (response, variables) => {
                queryClient.invalidateQueries({ queryKey: [endpoint], exact: true })
                queryClient.invalidateQueries({ queryKey: [endpoint, variables.id] })
                toast.success(response.message)
            },
            onError: (error) => {
                toast.error(`Lổi khi tạo bản ghi: ${error.message}`)
            }
        })
    }

    const useDelete = (endpoint: string) => {
        return useMutation<IApiMessageResponse, Error, number>({
            mutationFn: (id) => baseService.delete(endpoint, id),
            onSuccess: (response) => {
                queryClient.invalidateQueries({ queryKey: [endpoint], exact: true })
                // toast.success(response.message)
            },
            onError: (error) => {
                toast.error(`Lổi khi xóa bản ghi ${error.message}`)
            }
        })
    }

    const useBulkDelete = (endpoint: string, ids: number[]) => {
        return useMutation<IApiMessageResponse, Error, unknown>({
            mutationFn: () => baseService.bulkDelete(endpoint, ids),
            onSuccess: (response) => {
                queryClient.invalidateQueries({ queryKey: [endpoint], exact: true })
                toast.success(response.message)
            },
            onError: (error) => {
                toast.error(`Lổi khi xóa bản ghi ${error.message}`)
            }
        })
    }


    return {
        usePagiante,
        useShow,
        useCreate,
        useUpdate,
        useDelete,
        useBulkDelete,
        usePatchUpdate,
        useUpdatePost
    }
}

export default useApi