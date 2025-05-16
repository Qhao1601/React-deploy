import { RouteObject } from "react-router-dom";

import UserCatalogueIndex from "@/pages/users/catalogue/Index";
import UserCatalogueSave from "@/pages/users/catalogue/Save";
import UserIndex from "@/pages/users/user/Index";
import UserSave from "@/pages/users/user/Save";
import { PermissionGuard } from "@/Guards/permissionGuard";

export const useRoute: RouteObject[] = [
    {
        path: 'user_catalogues',
        element: (
            <PermissionGuard permissionName="user_catalogues:index">
                <UserCatalogueIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'user_catalogue/create',
        element: (
            <PermissionGuard permissionName="user_catalogues:store">
                <UserCatalogueSave />
            </PermissionGuard>
        )
    },
    {
        path: 'user_catalogues/edit/:id',
        element: (
            <PermissionGuard permissionName="user_catalogues:update">
                <UserCatalogueSave />
            </PermissionGuard>
        )
    },

    {
        path: 'users',
        element: (
            <PermissionGuard permissionName="users:index">
                <UserIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'user/create',
        element: (
            <PermissionGuard permissionName="users:store">
                <UserSave />
            </PermissionGuard>
        )
    },
    {
        path: 'user/edit/:id',
        element: (
            <PermissionGuard permissionName="users:update">
                <UserSave />
            </PermissionGuard>
        )
    },

]