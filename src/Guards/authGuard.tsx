import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/stores";
import { useEffect, useRef } from "react";
import { useRefesh } from "@/hooks/useRefesh";
import { setRefreshing } from "@/stores/slices/authSlice";



export const RequiredAuth = ({ children }: { children: React.ReactElement }) => {

    const dispatch = useAppDispatch();
    const auth = useSelector((state: RootState) => state.auth)
    const { refreshToken, isRefreshing, isRefreshSuccessful } = useRefesh()
    const isAuthenticated = auth.isAuthenticated && !!auth.accessToken
    const isTokenValid = auth.expiresAt ? auth.expiresAt > Date.now() : false

    // lưu trạng thái xem đã refresh hay chưa
    const hasRefresh = useRef<boolean>(false)

    useEffect(() => {
        dispatch(setRefreshing(false))
    }, [dispatch])


    useEffect(() => {

        if (isAuthenticated && !isTokenValid && !hasRefresh.current) {
            console.log('trigger refresh token')
            hasRefresh.current = true
            refreshToken.mutate(undefined)
        }
        return () => {
            if (!isAuthenticated) {
                hasRefresh.current = false
            }
        }
    }, [isAuthenticated, isTokenValid, hasRefresh, refreshToken])

    if (isRefreshing && isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />

    }

    if (!isTokenValid && isRefreshSuccessful === false) {
        return <Navigate to="/admin" replace />
    }
    return children;
}

export const NoRequiredAuth = ({ children }: { children: React.ReactElement }) => {
    const auth = useSelector((state: RootState) => state.auth)
    const isAuthenticated = auth.isAuthenticated && !!auth.accessToken
    const isTokenValid = auth.expiresAt ? auth.expiresAt > Date.now() : false

    if (isAuthenticated && isTokenValid) {
        return <Navigate to="/dashboard" replace />
    }
    return children;
}