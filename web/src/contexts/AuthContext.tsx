import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { API_URL, API_KEY } from "../constants/apiConstants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";

type AuthContextType = {
    userId: number | null;
    userFirstname: string | null;
    userLastname: string | null;
    userEmail: string | null;
    userType: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateContext: (
        userId: number,
        userEmail: string,
        userFirstname: string,
        userLastname: string,
        userType: string
    ) => void;
    authLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: ReactNode };

function safeParse(value: string | null) {
    try { return value ? JSON.parse(value) : null; }
    catch { return null; }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const navigate = useNavigate();

    const [userId,        setUserId]        = useState<number | null>(() => safeParse(localStorage.getItem("id")));
    const [userFirstname, setUserFirstName] = useState<string | null>(() => safeParse(localStorage.getItem("firstname")));
    const [userLastname,  setUserLastName]  = useState<string | null>(() => safeParse(localStorage.getItem("lastname")));
    const [userEmail,     setUserEmail]     = useState<string | null>(() => safeParse(localStorage.getItem("email")));
    const [userType,      setUserType]      = useState<string | null>(() => safeParse(localStorage.getItem("type")));
    const [authLoading,   setAuthLoading]   = useState(false);

    const login = async (email: string, password: string) => {
        setAuthLoading(true);
        try {
            const res = await axios.get(`${API_URL}/users/search?email=${email}`, {
                headers: { "x-api-key": API_KEY },
            });

            const data = res.data[0];

            if (!data || data.email === null) {
                throw new Error("Aucun utilisateur trouvé pour cette adresse mail");
            }

            const test = await bcrypt.hash(password, 10);
            console.log("Hash de test :", test);
                        console.log(test, data.password);

            const isValid = await bcrypt.compare(password, data.password);
            if (!isValid) {
                throw new Error("Mot de passe incorrect");
            }

            setUserId(data.id);
            setUserFirstName(data.firstName);
            setUserLastName(data.lastName);
            setUserEmail(data.email);
            setUserType(data.type);

            localStorage.setItem("id",        JSON.stringify(data.id));
            localStorage.setItem("firstname", JSON.stringify(data.firstName));
            localStorage.setItem("lastname",  JSON.stringify(data.lastName));
            localStorage.setItem("email",     JSON.stringify(data.email));
            localStorage.setItem("type",      JSON.stringify(data.type));

            // Redirection selon le rôle
            if (data.type === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (data.type === "PROFESSOR") {
                navigate("/professor/dashboard");
            } else if (data.type === "SECURITY") {
                navigate("/security/today");
            } else {
                // STUDENT
                navigate("/student/dashboard");
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
        setUserType(null);

        localStorage.removeItem("id");
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");
        localStorage.removeItem("email");
        localStorage.removeItem("type");

        navigate("/");
    };

    const updateContext = (
        userId: number,
        userEmail: string,
        userFirstname: string,
        userLastname: string,
        userType: string
    ) => {
        setAuthLoading(true);
        setUserId(userId);
        setUserFirstName(userFirstname);
        setUserLastName(userLastname);
        setUserEmail(userEmail);
        setUserType(userType);

        localStorage.setItem("id",        JSON.stringify(userId));
        localStorage.setItem("firstname", JSON.stringify(userFirstname));
        localStorage.setItem("lastname",  JSON.stringify(userLastname));
        localStorage.setItem("email",     JSON.stringify(userEmail));
        localStorage.setItem("type",      JSON.stringify(userType));
        setAuthLoading(false);
    };

    return (
        <AuthContext.Provider value={{ userId, userFirstname, userLastname, userEmail, userType, login, logout, updateContext, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth doit être utilisé avec un AuthProvider");
    return context;
}
