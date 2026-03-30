import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type { Student } from "../../types/types";
import StudentLayout from "../../components/StudentLayout";
import "../../styles/MyProfile.css";

const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.00023 16H3.42523L13.2002 6.225L11.7752 4.8L2.00023 14.575V16ZM0.000234375 18V13.75L13.2002 0.575C13.4002 0.391666 13.6211 0.25 13.8627 0.150001C14.1044 0.0500002 14.3586 0 14.6252 0C14.8919 0 15.1502 0.0500002 15.4002 0.150001C15.6502 0.25 15.8669 0.4 16.0502 0.599999L17.4252 2C17.6252 2.18333 17.7711 2.4 17.8627 2.65C17.9544 2.9 18.0002 3.15 18.0002 3.4C18.0002 3.66667 17.9544 3.92083 17.8627 4.1625C17.7711 4.40417 17.6252 4.625 17.4252 4.825L4.25023 18H0.000234375ZM12.4752 5.525L11.7752 4.8L13.2002 6.225L12.4752 5.525Z" fill="currentColor"/>
    </svg>
);

export default function MyProfile() {
    const { userId, updateContext } = useAuth();

    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchStudent = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`${API_URL}/students/${userId}`, {
                    headers: { "x-api-key": API_KEY },
                });
                setStudent(res.data);
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setEmail(res.data.email);
            } catch (err) {
                console.error("Erreur lors de la récupération du profil :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [userId]);

    const handleSave = async () => {
        if (!student || !userId) return;
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const payload = {
                firstName,
                lastName,
                email,
                password: student.password,
                enabled: student.enabled,
                studentNumber: student.studentNumber,
                createdAt: student.createdAt,
            };
            await axios.put(`${API_URL}/students/${userId}`, payload, {
                headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
            });
            setStudent({ ...student, firstName, lastName, email });
            updateContext(userId, email, firstName, lastName, "STUDENT");
            setSuccessMessage("Profil mis à jour avec succès !");
            setIsEditing(false);
        } catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
            setErrorMessage("Une erreur est survenue lors de la mise à jour.");
        }
    };

    const handleCancel = () => {
        if (student) {
            setFirstName(student.firstName);
            setLastName(student.lastName);
            setEmail(student.email);
        }
        setIsEditing(false);
        setErrorMessage("");
        setSuccessMessage("");
    };

    if (loading) {
        return (
            <StudentLayout titleHeader="Mon profil">
                <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                    <p className="text-gray-500 italic">Chargement…</p>
                </div>
            </StudentLayout>
        );
    }

    const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

    return (
        <StudentLayout titleHeader="Mon profil">
            <div className="min-h-screen bg-gray-100 p-6">

                <div className="w-full bg-white rounded-xl shadow-md p-8 mb-6">
                    {/* EN-TÊTE */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="profile-avatar w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 select-none">
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{student?.firstName} {student?.lastName}</h1>
                            <p className="text-gray-500 text-sm">{student?.email}</p>
                            <p className="text-xs text-gray-400 mt-1">N° étudiant : {student?.studentNumber}</p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="ml-auto edit-profile-btn text-white px-5 py-2 rounded flex items-center gap-2 transition cursor-pointer"
                            >
                                <IconEdit />
                                Modifier
                            </button>
                        )}
                    </div>

                    {/* FORMULAIRE / INFOS */}
                    {isEditing ? (
                        <div>
                            <h2 className="text-lg font-semibold mb-4 profile-section-title">Modifier mes informations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm">Prénom</label>
                                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm">Nom</label>
                                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]" />
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                    <label className="mb-1 font-medium text-sm">Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]" />
                                </div>
                            </div>
                            {errorMessage && <p className="text-red-600 text-sm mb-3">{errorMessage}</p>}
                            {successMessage && <p className="text-green-600 text-sm mb-3">{successMessage}</p>}
                            <div className="flex justify-end gap-3">
                                <button onClick={handleCancel} className="px-4 py-2 cancel-edit-profile-btn rounded transition cursor-pointer">Annuler</button>
                                <button onClick={handleSave} className="px-4 py-2 save-profile-btn text-white rounded transition cursor-pointer">Enregistrer</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold mb-4 profile-section-title">Mes informations</h2>
                            {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "Prénom",        value: student?.firstName },
                                    { label: "Nom",           value: student?.lastName },
                                    { label: "Email",         value: student?.email },
                                    { label: "N° étudiant",  value: student?.studentNumber },
                                    { label: "Compte actif",  value: student?.enabled ? "Oui" : "Non" },
                                    { label: "Membre depuis", value: student?.createdAt ? new Date(student.createdAt).toLocaleDateString("fr-FR") : "—" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-medium mb-1">{label}</p>
                                        <p className="text-gray-800 font-medium">{value ?? "—"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </StudentLayout>
    );
}
