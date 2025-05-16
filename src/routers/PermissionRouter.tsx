import { RouteObject } from "react-router-dom";

import PermissionIndex from "@/pages/permissions/Index";
import PermissionSave from "@/pages/permissions/Save";
import { PermissionGuard } from "@/Guards/permissionGuard";



export const permissionRoute: RouteObject[] = [
    {
        path: 'permissions',
        element: (
            <PermissionGuard permissionName="permissions:index">
                <PermissionIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'permissions/create',
        element: (
            <PermissionGuard permissionName="permissions:store">
                <PermissionSave />
            </PermissionGuard>
        )
    },
    {
        path: 'permissions/edit/:id',
        element: (
            <PermissionGuard permissionName="permissions:update">
                <PermissionSave />
            </PermissionGuard>
        )
    },

]