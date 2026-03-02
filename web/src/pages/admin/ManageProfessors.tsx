import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Professor, Subject } from "../../types/types";
import "../../styles/ManageProfessors.css";
import Layout from "../../components/Layout";

type ProfessorWithSubjects = Professor & {
    subjects?: Subject[];
};

export default function ManageProfessors() {
    const [professorList, setProfessorList] = useState<ProfessorWithSubjects[]>([]);
    const [search, setSearch] = useState("");

    const [showAddProfessors, setShowAddProfessors] = useState<boolean>(false);
    const [editingProfessors, setEditingProfessors] = useState<Professor | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);

    const [professorToDelete, setProfessorsToDelete] = useState<number | null>(null);

    // Récupération des professeurs et leurs matières
    const fetchProfessors = async () => {
        try {
            const res = await axios.get(`${API_URL}/professors`, {
                headers: { "x-api-key": API_KEY },
            });
            const professors: Professor[] = res.data;

            const professorsWithSubjects = await Promise.all(
                professors.map(async (prof) => {
                    const subjects = await Promise.all(
                        prof.subjectIds?.map(async (id) => {
                            const res = await axios.get(`${API_URL}/subjects/${id}`, {
                                headers: { "x-api-key": API_KEY },
                            });
                            return res.data;
                        }) || []
                    );
                    subjects.sort((a, b) => a.name.localeCompare(b.name));
                    return { ...prof, subjects };
                })
            );

            setProfessorList(professorsWithSubjects);
        } catch (err) {
            console.error("Erreur lors de la récupération des professeurs :", err);
        }
    };

    // Récupération de toutes les matières pour le formulaire
    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${API_URL}/subjects`, {
                headers: { "x-api-key": API_KEY },
            });
            setAllSubjects(res.data.sort((a: Subject, b: Subject) => a.name.localeCompare(b.name)));
        } catch (err) {
            console.error("Erreur lors de la récupération des matières :", err);
        }
    };

    useEffect(() => {
        fetchProfessors();
        fetchSubjects();
    }, []);

    // Filtrage pour la recherche
    const filteredProfessors = professorList.filter((professor) => {
        const value = search.toLowerCase();
        return (
            professor.lastName.toLowerCase().includes(value) ||
            professor.firstName.toLowerCase().includes(value)
        );
    });

    // Gestion ajout / modification
    const handleAddProfessorsButtonPress = () => {
        setEditingProfessors(null);
        setFirstName("");
        setLastName("");
        setEmail("");
        setSelectedSubjectIds([]);
        setShowAddProfessors(true);
    };

    const handleEditProfessorsButtonPress = (professor: ProfessorWithSubjects) => {
        setEditingProfessors(professor);
        setFirstName(professor.firstName);
        setLastName(professor.lastName);
        setEmail(professor.email);
        setSelectedSubjectIds(professor.subjects?.map(s => s.id) || []);
        setShowAddProfessors(true);
    };

    const addOrUpdateProfessors = async () => {
        try {
            const payload = {
                firstName,
                lastName,
                email,
                password: "string",
                createdAt: editingProfessors ? editingProfessors.createdAt : new Date().toISOString(),
                enabled: true,
                subjectIds: selectedSubjectIds,
            };

            if (editingProfessors) {
                await axios.put(`${API_URL}/professors/${editingProfessors.id}`, payload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            } else {
                await axios.post(`${API_URL}/professors`, payload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            }

            await fetchProfessors();
            setShowAddProfessors(false);
            setEditingProfessors(null);
            setFirstName("");
            setLastName("");
            setEmail("");
            setSelectedSubjectIds([]);
        } catch (err) {
            console.error("Erreur lors de l'enregistrement du professeur :", err);
        }
    };

    const deleteProfessors = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/professors/${id}`, {
                headers: { "x-api-key": API_KEY },
            });
            await fetchProfessors();
            setProfessorsToDelete(null);
        } catch (err) {
            console.error("Erreur lors de la suppression du professeur :", err);
        }
    };

    useEffect(() => {
        if (showAddProfessors || professorToDelete !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showAddProfessors, professorToDelete]);

    return (
        <Layout
            children={
                <div className="min-h-screen bg-gray-100 p-6">
                    <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-6 gap-4">
                            <h1 className="text-3xl font-semibold text-left whitespace-nowrap">
                                Gestion des professeurs
                            </h1>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                                />
                                <button
                                    onClick={handleAddProfessorsButtonPress}
                                    className="add-professor-btn text-white px-4 py-2 rounded transition cursor-pointer whitespace-nowrap"
                                >
                                    + Ajouter un professeur
                                </button>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-md">
                                <thead className="bg-[#E8F4F3] border border-[#E8F4F3]">
                                    <tr>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-1/5">Prénom</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-1/5">Nom</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-1/5">Email</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-2/5">Matières prises en charge</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-center w-1/5">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProfessors.map((professor) => (
                                        <tr key={professor.id}>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{professor.firstName}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{professor.lastName}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{professor.email}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">
                                                {professor.subjects
                                                    ?.sort((a, b) => a.name.localeCompare(b.name))
                                                    .map((s) => s.name)
                                                    .join(", ") || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center space-x-4 border-b border-[#F1F5F9]">
                                                <button
                                                    onClick={() => handleEditProfessorsButtonPress(professor)}
                                                    className="cursor-pointer"
                                                >
                                                    <svg className="w-5 h-5 text-gray-400 hover:text-[#3A8C85] transition-colors" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.00023 16H3.42523L13.2002 6.225L11.7752 4.8L2.00023 14.575V16ZM0.000234375 18V13.75L13.2002 0.575C13.4002 0.391666 13.6211 0.25 13.8627 0.150001C14.1044 0.0500002 14.3586 0 14.6252 0C14.8919 0 15.1502 0.0500002 15.4002 0.150001C15.6502 0.25 15.8669 0.4 16.0502 0.599999L17.4252 2C17.6252 2.18333 17.7711 2.4 17.8627 2.65C17.9544 2.9 18.0002 3.15 18.0002 3.4C18.0002 3.66667 17.9544 3.92083 17.8627 4.1625C17.7711 4.40417 17.6252 4.625 17.4252 4.825L4.25023 18H0.000234375ZM16.0002 3.4L14.6002 2L16.0002 3.4ZM12.4752 5.525L11.7752 4.8L13.2002 6.225L12.4752 5.525Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setProfessorsToDelete(professor.id)}
                                                    className="cursor-pointer"
                                                >
                                                    <svg className="w-5 h-5 text-gray-400 hover:text-red-600 transition-colors" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3.00023 18C2.45023 18 1.9794 17.8042 1.58773 17.4125C1.19607 17.0208 1.00023 16.55 1.00023 16V3H0.000234494V1H5.00023V0H11.0002V1H16.0002V3H15.0002V16C15.0002 16.55 14.8044 17.0208 14.4127 17.4125C14.0211 17.8042 13.5502 18 13.0002 18H3.00023ZM13.0002 3H3.00023V16H13.0002V3ZM5.00023 14H7.00023V5H5.00023V14ZM9.00023 14H11.0002V5H9.00023V14ZM3.00023 3V16V3Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pop-up ajout / modification */}
                        {showAddProfessors && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl w-250 max-h-[90vh] overflow-y-auto">
                                    <h2 className="text-xl font-semibold mb-4">{editingProfessors ? "Modifier le professeur" : "Ajouter un professeur"}</h2>
                                    <form onSubmit={(e) => { e.preventDefault(); addOrUpdateProfessors(); }}>
                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            {/* Prénom */}
                                            <div className="flex flex-col">
                                                <label htmlFor="firstname" className="mb-1 font-medium">Prénom</label>
                                                <input
                                                    id="firstname"
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                                />
                                            </div>
                                            {/* Nom */}
                                            <div className="flex flex-col">
                                                <label htmlFor="lastname" className="mb-1 font-medium">Nom</label>
                                                <input
                                                    id="lastname"
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Email */}
                                            <div className="flex flex-col">
                                                <label htmlFor="email" className="mb-1 font-medium">Email</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-full"
                                                />
                                            </div>
                                            {/* Matières */}
                                            <div className="flex flex-col">
                                                <label className="mb-2 font-medium">Matières</label>
                                                <div className="border border-gray-300 rounded p-2 max-h-32 overflow-y-auto">
                                                    {allSubjects.length === 0 ? (
                                                        <p className="text-sm text-gray-500 italic">
                                                            Aucun professeur trouvé
                                                        </p>
                                                    ) : (
                                                        allSubjects
                                                            .slice()
                                                            .sort((a, b) => a.name.localeCompare(b.name))
                                                            .map(subj => (
                                                                <label key={subj.id} className="flex items-center gap-2 mb-1">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedSubjectIds.includes(subj.id)}
                                                                        onChange={() => {
                                                                            if (selectedSubjectIds.includes(subj.id)) {
                                                                                setSelectedSubjectIds(selectedSubjectIds.filter(id => id !== subj.id));
                                                                            } else {
                                                                                setSelectedSubjectIds([...selectedSubjectIds, subj.id]);
                                                                            }
                                                                        }}
                                                                        className="cursor-pointer"
                                                                    />
                                                                    {subj.name}
                                                                </label>
                                                            ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Boutons */}
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => { setShowAddProfessors(false); setEditingProfessors(null); setSelectedSubjectIds([]); }}
                                                className="px-4 py-2 cancel-send-professor-btn rounded transition cursor-pointer"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 send-professor-btn text-white rounded transition cursor-pointer"
                                            >
                                                Enregistrer
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Pop-up suppression */}
                        {professorToDelete !== null && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
                                    <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                                    <p>Êtes-vous sûr de vouloir supprimer ce professeur ?</p>
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button
                                            onClick={() => setProfessorsToDelete(null)}
                                            className="px-4 py-2 rounded cancel-delete-professor-btn transition cursor-pointer"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={() => professorToDelete && deleteProfessors(professorToDelete)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            } />
    );
}