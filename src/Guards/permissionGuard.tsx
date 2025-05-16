import { useEffect, ReactNode, useCallback, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { toast } from "sonner";

interface PermissionsGuard {
    children: ReactNode,
    permissionName: string,
    fallbackPath?: string
}
// hàm kiểm tra xem nếu không truyền permissionName thì bỏ qua cho truy cập bthg vào children
// còn nếu có truyền permissionName thì kiểm tra trong [] có quyền đó không ,
//  nếu không có thì k cho truy cập children và chuyển về dashboard


export const PermissionGuard = ({
    children,
    permissionName,
    fallbackPath = '/dashboard',
}: PermissionsGuard) => {
    const auth = useSelector((state: RootState) => state.auth)
    const userPermisson = useMemo(() => {
        return auth.user?.permissions || []
    }, [auth])


    const hasPermissions = useCallback((): boolean => {
        if (!permissionName) return true
        return userPermisson?.includes(permissionName)
    }, [userPermisson, permissionName])

    useEffect(() => {
        if (!hasPermissions) {
            toast.error("Bạn không có quyền truy cập chức năng này")
        }
    }, [hasPermissions])

    if (!hasPermissions()) {
        return <Navigate to={fallbackPath} replace />
    }
    return children
}