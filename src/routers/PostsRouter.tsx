import { RouteObject } from "react-router-dom";

import PostsSave from "@/pages/posts/post/Save";
import PostsIndex from "@/pages/posts/post/Index";
import { PermissionGuard } from "@/Guards/permissionGuard";

export const PostsRoute: RouteObject[] = [
    {
        path: 'posts',
        element: (
            <PermissionGuard permissionName="posts:index">
                <PostsIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'posts/create',
        element: (
            <PermissionGuard permissionName="posts:store">
                <PostsSave />
            </PermissionGuard>
        )
    },
    {
        path: 'posts/edit/:id',
        element: (
            <PermissionGuard permissionName="posts:update">
                <PostsSave />
            </PermissionGuard>
        )
    },

]