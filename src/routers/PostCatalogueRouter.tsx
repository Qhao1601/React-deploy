import { RouteObject } from "react-router-dom";

import PostCataloguesSave from "@/pages/posts/catalogue/Save";
import PostCatalogueIndex from "@/pages/posts/catalogue/Index";
import { PermissionGuard } from "@/Guards/permissionGuard";

export const PostCataloguesRoute: RouteObject[] = [
    {
        path: 'post_catalogues',
        element: (
            <PermissionGuard permissionName="post_catalogues:index">
                <PostCatalogueIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'post_catalogues/create',
        element: (
            <PermissionGuard permissionName="post_catalogues:store">
                <PostCataloguesSave />
            </PermissionGuard>
        )
    },
    {
        path: 'post_catalogues/edit/:id',
        element: (
            <PermissionGuard permissionName="post_catalogues:update">
                <PostCataloguesSave />
            </PermissionGuard>
        )
    },

]