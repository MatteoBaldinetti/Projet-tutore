import { useEffect, useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { API_URL, API_KEY } from "../constants/apiConstants";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ProfilePage.css";

function getEndpoint(userType: string | null): string {
    switch (userType) {
        case "ADMIN":     return "admins";
        case "PROFESSOR": return "professors";
        case "SECURITY":  return "security";
        default:          return "students";
    }
}

function getRoleLabel(userType: string | null): string {
    switch (userType) {
        case "ADMIN":     return "Administrateur";
        case "PROFESSOR": return "Professeur";
        case "SECURITY":  return "Agent de sécurité";
        default:          return "Étudiant";
    }
}

const IconLock = () => (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
        <path d="M2 18C1.45 18 0.979 17.804 0.588 17.413C0.196 17.021 0 16.55 0 16V8C0 7.45 0.196 6.979 0.588 6.588C0.979 6.196 1.45 6 2 6H3V4C3 2.9 3.392 1.958 4.175 1.175C4.958 0.392 5.9 0 7 0H9C10.1 0 11.042 0.392 11.825 1.175C12.608 1.958 13 2.9 13 4V6H14C14.55 6 15.021 6.196 15.413 6.588C15.804 6.979 16 7.45 16 8V16C16 16.55 15.804 17.021 15.413 17.413C15.021 17.804 14.55 18 14 18H2ZM8 13C8.55 13 9.021 12.804 9.413 12.413C9.804 12.021 10 11.55 10 11C10 10.45 9.804 9.979 9.413 9.588C9.021 9.196 8.55 9 8 9C7.45 9 6.979 9.196 6.588 9.588C6.196 9.979 6 10.45 6 11C6 11.55 6.196 12.021 6.588 12.413C6.979 12.804 7.45 13 8 13ZM5 6H11V4C11 3.45 10.804 2.979 10.413 2.588C10.021 2.196 9.55 2 9 2H7C6.45 2 5.979 2.196 5.588 2.588C5.196 2.979 5 3.45 5 4V6Z" fill="currentColor"/>
    </svg>
);

export default function ProfilePage() {
    const { userId, userType } = useAuth();

    const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(true);

    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [nameSuccess, setNameSuccess] = useState("");
    const [nameError, setNameError] = useState("");
    const [savingName, setSavingName] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const endpoint = getEndpoint(userType);
    const roleLabel = getRoleLabel(userType);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`${API_URL}/${endpoint}/${userId}`, {
                    headers: { "x-api-key": API_KEY },
                });
                setUserData(res.data);
                setEditFirstName(res.data.firstName ?? "");
                setEditLastName(res.data.lastName ?? "");
            } catch (err) {
                console.error("Erreur lors de la récupération du profil :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId, endpoint]);

    const handleChangeName = async () => {
        setNameError("");
        setNameSuccess("");
        if (!editFirstName.trim() || !editLastName.trim()) {
            setNameError("Le prénom et le nom ne peuvent pas être vides.");
            return;
        }
        if (!userData) return;
        setSavingName(true);
        try {
            await axios.put(
                `${API_URL}/${endpoint}/${userId}`,
                { ...userData, firstName: editFirstName.trim(), lastName: editLastName.trim() },
                { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
            );
            setUserData({ ...userData, firstName: editFirstName.trim(), lastName: editLastName.trim() });
            setNameSuccess("Nom mis à jour avec succès !");
        } catch (err) {
            console.error("Erreur lors du changement de nom :", err);
            setNameError("Une erreur est survenue.");
        } finally {
            setSavingName(false);
        }
    };

    const handleChangePassword = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }
        if (newPassword.length < 4) {
            setErrorMessage("Le mot de passe doit contenir au moins 4 caractères.");
            return;
        }
        if (!userData) return;

        setSaving(true);
        try {
            const isValid = await bcrypt.compare(currentPassword, userData.password as string);
            if (!isValid) {
                setErrorMessage("Mot de passe actuel incorrect.");
                return;
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await axios.put(
                `${API_URL}/${endpoint}/${userId}`,
                { ...userData, password: hashedPassword },
                { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
            );

            setUserData({ ...userData, password: hashedPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setSuccessMessage("Mot de passe mis à jour avec succès !");
        } catch (err) {
            console.error("Erreur lors du changement de mot de passe :", err);
            setErrorMessage("Une erreur est survenue.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                <p className="text-gray-500 italic">Chargement…</p>
            </div>
        );
    }

    const firstName = (userData?.firstName as string) ?? "";
    const lastName  = (userData?.lastName as string) ?? "";
    const initials  = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="w-full bg-white rounded-xl shadow-md p-8">

                {/* EN-TÊTE */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="profile-page-avatar w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 select-none">
                        {initials}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{firstName} {lastName}</h1>
                        <p className="text-gray-500 text-sm">{userData?.email as string}</p>
                        <p className="profile-page-role-badge text-xs font-medium mt-1">{roleLabel}</p>
                    </div>
                </div>

                {/* INFORMATIONS */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 profile-page-section-title">Mes informations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Prénom",        value: firstName },
                            { label: "Nom",           value: lastName },
                            { label: "Email",         value: userData?.email as string },
                            { label: "Compte actif",  value: userData?.enabled ? "Oui" : "Non" },
                            { label: "Membre depuis", value: userData?.createdAt ? new Date(userData.createdAt as string).toLocaleDateString("fr-FR") : "—" },
                            { label: "Rôle",          value: roleLabel },
                        ].map(({ label, value }) => (
                            <div key={label} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase font-medium mb-1">{label}</p>
                                <p className="text-gray-800 font-medium">{value ?? "—"}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MODIFICATION DU NOM */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 profile-page-section-title">Modifier le prénom et le nom</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-sm">Prénom</label>
                            <input
                                type="text"
                                value={editFirstName}
                                onChange={e => setEditFirstName(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-sm">Nom</label>
                            <input
                                type="text"
                                value={editLastName}
                                onChange={e => setEditLastName(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                            />
                        </div>
                    </div>
                    {nameError && <p className="text-red-600 text-sm mb-3">{nameError}</p>}
                    {nameSuccess && <p className="text-green-600 text-sm mb-3">{nameSuccess}</p>}
                    <div className="flex justify-end">
                        <button
                            onClick={handleChangeName}
                            disabled={savingName}
                            className="profile-page-save-btn px-5 py-2 text-white rounded transition cursor-pointer disabled:opacity-50"
                        >
                            {savingName ? "Enregistrement…" : "Enregistrer le nom"}
                        </button>
                    </div>
                </div>

                {/* CHANGEMENT DE MOT DE PASSE */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 profile-page-section-title flex items-center gap-2">
                        <IconLock />
                        Changer le mot de passe
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-1 font-medium text-sm">Mot de passe actuel</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-sm">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-sm">Confirmer le nouveau mot de passe</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                            />
                        </div>
                    </div>
                    {errorMessage && <p className="text-red-600 text-sm mb-3">{errorMessage}</p>}
                    {successMessage && <p className="text-green-600 text-sm mb-3">{successMessage}</p>}
                    <div className="flex justify-end">
                        <button
                            onClick={handleChangePassword}
                            disabled={saving}
                            className="profile-page-save-btn px-5 py-2 text-white rounded transition cursor-pointer disabled:opacity-50"
                        >
                            {saving ? "Enregistrement…" : "Enregistrer le mot de passe"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
