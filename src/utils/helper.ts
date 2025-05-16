import { AxiosError } from "axios";
import { toast } from "sonner"

import { IApiErrorResponse, IApiResponse, IApiSuccessResponse, IApiMessageResponse } from "@/interfaces/api.response";


export const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError) {
        if (error.response) {
            const errorResponse = error.response.data
            if (errorResponse.message) {
                toast.error(errorResponse.message)
            } else {
                toast.error(`Lỗi: ${errorResponse.status}`)
            }
        } else if (error.request) {
            toast.error('Không nhận được phản hồi từ phía server')
        } else {
            toast.error('Lổi gửi yêu cầu')
        }
    } else {
        toast.error('Lổi không xác định')
    }
}


export const buildUrlWithQueryString = (endpoint: string, queryParams?: Record<string, string>) => {
    const basePath = `${endpoint}`
    if (!queryParams) return basePath;
    const queryString = new URLSearchParams(queryParams).toString()
    return `${basePath}${queryString ? `?${queryString}` : ""}`
}

export const toSlug = (str: string): string => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

}
// export const isSuccessResponse = <T, E>(response: IApiResponse<T, E> | undefined): response is IApiSuccessResponse<T> => {
//     return Boolean(response && 'data' in response && response.status === true)
// }

export const isErrorResponse = <T, E>(response: IApiResponse<T, E> | undefined): response is IApiErrorResponse<E> => {
    return Boolean(response && 'errors' in response && response.status === false)
}

export const isMessageResponse = <T, E>(response: IApiResponse<T, E> | undefined): response is IApiMessageResponse => {
    return Boolean(response && !('data' in response) && !('errors' in response))
}
