import { IApiResponse } from "@/interfaces/api.response";
import { ILoginResponse } from "@/interfaces/auth/auth.interface";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/stores";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth/auth.Service";
import { logout, setAuth, setRefreshing } from "@/stores/slices/authSlice";


export const useRefesh = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const isRefreshing = useAppSelector((state) => state.auth.isRefreshing)

    const [isRefreshSuccessful, setRefreshSuccessful] = useState<boolean | null>(null)

    const refreshToken = useMutation<IApiResponse<ILoginResponse, unknown>, Error, unknown>(
        {
            mutationFn: authService.refresh,
            onMutate: () => {
                dispatch(setRefreshing(true))
                setRefreshSuccessful(null)
            },
            onSuccess: (response: IApiResponse<ILoginResponse, unknown>) => {
                if (response && 'data' in response) {
                    dispatch(setAuth(response.data as ILoginResponse))
                    setRefreshSuccessful(true)
                } else {
                    setRefreshSuccessful(false)
                }
            },
            onError: (error) => {
                console.log("Refresh Token failed: ", error)
                dispatch(logout())
                setRefreshSuccessful(false)
                navigate('/admin', { replace: true })
            },
            onSettled: () => {
                dispatch(setRefreshing(true))
            }
        })
    return {
        refreshToken,
        isRefreshing,
        isRefreshSuccessful,
        isLoading: refreshToken.isPending,
        error: refreshToken.error
    }
}