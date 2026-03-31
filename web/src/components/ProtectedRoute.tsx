import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Mapping des routes vers les rôles autorisés
const ROUTE_PERMISSIONS: Record<string, string[]> = {
    "/admin":     ["ADMIN"],
    "/professor": ["PROFESSOR"],
    "/student":   ["STUDENT"],
    "/security":  ["SECURITY"],
};

// Dashboard de chaque rôle (pour redirection si déjà connecté)
export const ROLE_DASHBOARDS: Record<string, string> = {
    ADMIN:     "/admin/dashboard",
    PROFESSOR: "/professor/dashboard",
    STUDENT:   "/student/dashboard",
    SECURITY:  "/security/today",
};

// Pages publiques (accessibles sans être connecté)
//const PUBLIC_PATHS = ["/", "/register", "/forget-password", "/confirm-reset-password"];

type ProtectedRouteProps = {
    children: React.ReactNode;
    /** Si true, redirige les utilisateurs déjà connectés vers leur dashboard */
    authOnly?: boolean;
};

export default function ProtectedRoute({ children, authOnly = false }: ProtectedRouteProps) {
    const { userType } = useAuth();
    const location = useLocation();
    const path = location.pathname;

    // Cas 1 : page publique (login, register, etc.)
    // → si déjà connecté, rediriger vers le dashboard du rôle
    if (authOnly) {
        if (userType) {
            const dashboard = ROLE_DASHBOARDS[userType] || "/";
            return <Navigate to={dashboard} replace />;
        }
        return <>{children}</>;
    }

    // Cas 2 : page protégée
    // → si non connecté, rediriger vers login
    if (!userType) {
        return <Navigate to="/" replace state={{ from: path }} />;
    }

    // Vérifier si le chemin correspond à une zone protégée
    const zone = Object.keys(ROUTE_PERMISSIONS).find(prefix => path.startsWith(prefix));
    if (zone) {
        const allowed = ROUTE_PERMISSIONS[zone];
        if (!allowed.includes(userType)) {
            return <Navigate to="/403" replace />;
        }
    }

    return <>{children}</>;
}
