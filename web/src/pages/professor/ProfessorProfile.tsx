import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type { Professor, Subject } from "../../../types/types";
import ProfessorLayout from "../../components/ProfessorLayout";
import "../../styles/ProfessorProfile.css";

const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M2.00023 16H3.42523L13.2002 6.225L11.7752 4.8L2.00023 14.575V16ZM0.000234375 18V13.75L13.2002 0.575C13.4002 0.391666 13.6211 0.25 13.8627 0.150001C14.1044 0.0500002 14.3586 0 14.6252 0C14.8919 0 15.1502 0.0500002 15.4002 0.150001C15.6502 0.25 15.8669 0.4 16.0502 0.599999L17.4252 2C17.6252 2.18333 17.7711 2.4 17.8627 2.65C17.9544 2.9 18.0002 3.15 18.0002 3.4C18.0002 3.66667 17.9544 3.92083 17.8627 4.1625C17.7711 4.40417 17.6252 4.625 17.4252 4.825L4.25023 18H0.000234375ZM12.4752 5.525L11.7752 4.8L13.2002 6.225L12.4752 5.525Z" fill="currentColor"/>
    </svg>
);

export default function ProfessorProfile() {
    const { userId, updateContext } = useAuth();

    const [professor, setProfessor] = useState<Professor | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                const [profRes, subjectsRes] = await Promise.all([
                    axios.get(`${API_URL}/professors/${userId}`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/subjects`, { headers: { "x-api-key": API_KEY } }),
                ]);
                setProfessor(profRes.data);
                setFirstName(profRes.data.firstName);
                setLastName(profRes.data.lastName);
                setEmail(profRes.data.email);

                const mySubjects = subjectsRes.data.filter((s: Subject) =>
                    s.professorIds?.includes(userId)
                );
                setSubjects(mySubjects);
            } catch (err) {
                console.error("Erreur profil prof :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const handleSave = async () => {
        if (!professor || !userId) return;
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const payload = {
                firstName,
                lastName,
                email,
                password: professor.password,
                enabled: professor.enabled,
                subjectIds: professor.subjectIds,
                createdAt: professor.createdAt,
            };
            await axios.put(`${API_URL}/professors/${userId}`, payload, {
                headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
            });
            setProfessor({ ...professor, firstName, lastName, email });
            updateContext(userId, email, firstName, lastName, "PROFESSOR");
            setSuccessMessage("Profil mis à jour avec succès !");
            setIsEditing(false);
        } catch (err) {
            console.error("Erreur mise à jour :", err);
            setErrorMessage("Une erreur est survenue lors de la mise à jour.");
        }
    };

    const handleCancel = () => {
        if (professor) {
            setFirstName(professor.firstName);
            setLastName(professor.lastName);
            setEmail(professor.email);
        }
        setIsEditing(false);
        setErrorMessage("");
        setSuccessMessage("");
    };

    if (loading) {
        return (
            <ProfessorLayout titleHeader="Mon profil">
                <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                    <p className="text-gray-500 italic">Chargement…</p>
                </div>
            </ProfessorLayout>
        );
    }

    const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

    return (
        <ProfessorLayout titleHeader="Mon profil">
            <div className="min-h-screen bg-gray-100 p-6">

                <div className="w-full bg-white rounded-xl shadow-md p-8 mb-6">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="prof-avatar w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 select-none">
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{professor?.firstName} {professor?.lastName}</h1>
                            <p className="text-gray-500 text-sm">{professor?.email}</p>
                            <p className="text-xs text-[#3A8C85] font-medium mt-1">Professeur</p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="ml-auto edit-prof-btn text-white px-5 py-2 rounded flex items-center gap-2 transition cursor-pointer"
                            >
                                <IconEdit />
                                Modifier
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div>
                            <h2 className="text-lg font-semibold mb-4 prof-section-title">Modifier mes informations</h2>
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
                                <button onClick={handleCancel} className="px-4 py-2 cancel-edit-prof-btn rounded transition cursor-pointer">Annuler</button>
                                <button onClick={handleSave} className="px-4 py-2 save-prof-btn text-white rounded transition cursor-pointer">Enregistrer</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold mb-4 prof-section-title">Mes informations</h2>
                            {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {[
                                    { label: "Prénom",        value: professor?.firstName },
                                    { label: "Nom",           value: professor?.lastName },
                                    { label: "Email",         value: professor?.email },
                                    { label: "Compte actif",  value: professor?.enabled ? "Oui" : "Non" },
                                    { label: "Membre depuis", value: professor?.createdAt ? new Date(professor.createdAt).toLocaleDateString("fr-FR") : "—" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-medium mb-1">{label}</p>
                                        <p className="text-gray-800 font-medium">{value ?? "—"}</p>
                                    </div>
                                ))}
                            </div>

                            {/* MATIÈRES */}
                            {subjects.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold mb-3 prof-section-title">Mes matières</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {subjects.map(s => (
                                            <span key={s.id} className="px-3 py-1.5 rounded-full text-sm font-medium prof-subject-badge">
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProfessorLayout>
    );
}
