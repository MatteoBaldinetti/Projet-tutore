import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { API_URL, API_KEY } from "../constants/apiConstants";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

type AuthContextType = {
    userId: number | null;
    userFirstname: string | null;
    userLastname: string | null;
    userEmail: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateContext: (
        userId: number,
        userEmail: string,
        userFirstname: string,
        userLastname: string
    ) => void;
    authLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const navigate = useNavigate();

    const [userId, setUserId] = useState(() => {
        const savedId = localStorage.getItem("id");
        return savedId ? JSON.parse(savedId) : null;
    });

    const [userFirstname, setUserFirstName] = useState(() => {
        const savedFirstname = localStorage.getItem("firstname");
        return savedFirstname ? JSON.parse(savedFirstname) : null;
    });

    const [userLastname, setUserLastName] = useState(() => {
        const savedLastname = localStorage.getItem("lastname");
        return savedLastname ? JSON.parse(savedLastname) : null;
    });

    const [userEmail, setUserEmail] = useState(() => {
        const savedEmail = localStorage.getItem("email");
        return savedEmail ? JSON.parse(savedEmail) : null;
    });

    const [authLoading, setAuthLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setAuthLoading(true);
        try {
            const res = await fetch(`${API_URL}/users/search?email=${email}`, {
                headers: { "X-API-KEY": API_KEY }
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la connexion");
            }

            let data = await res.json();
            data = data[0];

            if (data.email === null) {
                throw new Error("Aucun utilisateur trouvé pour cette adresse mail");
            }

            const isValid = await bcrypt.compare(password, data.password);

            if (isValid) {
                setUserId(data.id);
                setUserFirstName(data.firstname);
                setUserLastName(data.lastname);
                setUserEmail(data.email);

                localStorage.setItem("id", JSON.stringify(data.id));
                localStorage.setItem("firstname", JSON.stringify(data.firstname));
                localStorage.setItem("lastname", JSON.stringify(data.lastname));
                localStorage.setItem("email", JSON.stringify(data.email));

                setAuthLoading(false);
                navigate("/");
            } else {
                throw new Error("Mot de passe incorrect");
            }
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = () => {
        setUserId(null);
        setUserFirstName(null);
        setUserLastName(null);
        setUserEmail(null);

        localStorage.removeItem("id");
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");
        localStorage.removeItem("email");

        navigate("/");
    };

    const updateContext = (userId: number, userEmail: string, userFirstname: string, userLastname: string) => {
        setAuthLoading(true);

        setUserId(userId);
        setUserFirstName(userFirstname);
        setUserLastName(userLastname);
        setUserEmail(userEmail);
        
        localStorage.setItem("id", JSON.stringify(userId));
        localStorage.setItem("firstname", JSON.stringify(userFirstname));
        localStorage.setItem("lastname", JSON.stringify(userLastname));
        localStorage.setItem("email", JSON.stringify(userEmail));
        
        setAuthLoading(false);
    };

    const value = {
        userId,
        userFirstname,
        userLastname,
        userEmail,
        login,
        logout,
        updateContext,
        authLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}