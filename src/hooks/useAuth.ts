import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.Service";


import { IApiResponse, IApiMessageResponse } from "@/interfaces/api.response";
import { ILoginResponse } from "@/interfaces/auth/auth.interface";
import { TLoginRequest } from "@/components/login-form";
import { handleApiError } from "@/utils/helper";

import { useAppDispatch, useAppSelector } from "@/stores";
import { useNavigate } from "react-router-dom";
import { setAuth, logout as logoutAction } from "@/stores/slices/authSlice";
import { toast } from "sonner";




export const useAuth = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const authenticate = useMutation<IApiResponse<ILoginResponse, unknown>, Error, TLoginRequest>({
        mutationFn: authService.login,
        onSuccess: (response) => {
            if ('data' in response) {
                dispatch(setAuth(response.data))
                toast.success("Đăng nhập vào hệ thống thành công")
                navigate("/dashboard")
            } else {
                toast.warning("Đăng nhập vào hệ thống thất bại")
            }
        },
        onError: (error) => {
            handleApiError(error)
        }
    })
    const logoutMution = useMutation<IApiMessageResponse, Error, void>({
        mutationFn: authService.logout,
        onSuccess: () => {
            dispatch(logoutAction())
            navigate('/admin')
        }
    })

    const auth = useAppSelector((state) => state.auth.user)

    return {
        authenticate,
        logoutMution,
        auth
    }
}