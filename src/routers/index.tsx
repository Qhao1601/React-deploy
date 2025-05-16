import { createBrowserRouter, RouteObject } from "react-router-dom";
import Login from "../pages/auth/login";
import Dashboard from "@/pages/dashboard/Dashboard";
import { RequiredAuth, NoRequiredAuth } from "@/Guards/authGuard";
import Layout from "@/pages/dashboard/Layout";
import { useRoute } from "./useRoutes";
import { permissionRoute } from "./PermissionRouter"
import { PostCataloguesRoute } from "./PostCatalogueRouter";
import { PostsRoute } from "./PostsRouter";

const routes: RouteObject[] = [
    {
        path: '/admin',
        element: (
            <NoRequiredAuth>
                <Login />
            </NoRequiredAuth>
        ),
    },
    {
        path: '/',
        element: (
            <RequiredAuth>
                <Layout />
            </RequiredAuth>
        ),
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            ...useRoute,
            ...permissionRoute,
            ...PostCataloguesRoute,
            ...PostsRoute

        ]
    }

]

const router = createBrowserRouter(routes)
export default router