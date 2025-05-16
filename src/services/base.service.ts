import { IApiResponse, IApiMessageResponse } from "@/interfaces/api.response";
import { privateApi } from "@/config/axios";


export const baseService = {
    paginate: async<T>(endpoint: string): Promise<IApiResponse<T, unknown>> => {
        const response = await privateApi.get(`${endpoint}`)
        return response.data
    },
    show: async<T>(endpoint: string, id: number): Promise<IApiResponse<T, unknown>> => {
        const response = await privateApi.get(`${endpoint}/${id}`)
        return response.data
    },

    create: async<T, P>(endpoint: string, payload: P): Promise<IApiResponse<T, unknown>> => {
        const response = await privateApi.post(`${endpoint}`, payload)
        return response.data
    },

    // update: async<T, P>(endpoint: string, id: number, payload: P): Promise<IApiResponse<T, unknown>> => {
    //     const response = await privateApi.put(`${endpoint}/${id}`, payload)
    //     return response.data
    // },
    update: async<T, P>(endpoint: string, id: number, payload: P): Promise<IApiResponse<T, unknown>> => {
        const response = await privateApi.put(`${endpoint}/${id}`, payload); // Dùng POST kèm `_method: PUT`
        return response.data;
    },

    updatePost: async<T, P>(endpoint: string, id: number, payload: P): Promise<IApiResponse<T, unknown>> => {
        const response = await privateApi.post(`${endpoint}/${id}`, payload); // Dùng POST kèm `_method: PUT`
        return response.data;
    },


    patch: async<T, P>(endpoint: string, id: number, payload: P): Promise<IApiResponse<T, unknown>> => {
        const response = await privateApi.patch(`${endpoint}/${id}`, payload)
        return response.data
    },

    delete: async (endpoint: string, id: number): Promise<IApiMessageResponse> => {
        const response = await privateApi.delete(`${endpoint}/${id}`)
        return response.data
    },

    bulkDelete: async (endpoint: string, ids: number[]): Promise<IApiMessageResponse> => {
        const response = await privateApi.delete(`${endpoint}/${ids}`)
        return response.data
    },
    attach: async (endpoint: string, id: number, payload: { ids: number[], relation: string }): Promise<IApiMessageResponse> => {
        const response = await privateApi.post(`${endpoint}/${id}/attach`, payload)
        return response.data
    },

    detach: async (endpoint: string, id: number, payload: { ids: number[], relation: string }): Promise<IApiMessageResponse> => {
        const response = await privateApi.delete(`${endpoint}/${id}/detach`, { data: payload })
        return response.data
    }
}