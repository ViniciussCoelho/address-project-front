import React from 'react';
import { Navigate, Outlet, Route, RouteProps } from 'react-router-dom';

type RoutePropsWithAuth = RouteProps & {
    isAuthenticated: boolean;
    redirectTo: string;
}

export const ProtectedRoute: React.FC<RoutePropsWithAuth> = ({
    isAuthenticated,
    redirectTo = '/landing',
    children,
}) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return children ? children : <Outlet />;
};