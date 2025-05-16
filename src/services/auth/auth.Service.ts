import { privateApi, publicApi } from "@/config/axios";
import { IApiResponse, IApiMessageResponse } from "@/interfaces/api.response";
import { TLoginRequest } from "@/components/login-form";
import { ILoginResponse } from "@/interfaces/auth/auth.interface";


const ENDPOINT = "api/v1/auth";

export const authService = {
    login: async (payload: TLoginRequest): Promise<IApiResponse<ILoginResponse, unknown>> => {
        const response = await publicApi.post(`${ENDPOINT}/authenticate`, payload)
        return response.data
    },
    refresh: async (): Promise<IApiResponse<ILoginResponse, unknown>> => {
        const response = await privateApi.post(`${ENDPOINT}/refresh-token`)
        return response.data
    },

    logout: async (): Promise<IApiMessageResponse> => {
        const response = await privateApi.post(`${ENDPOINT}/logout`)
        return response.data
    }

}