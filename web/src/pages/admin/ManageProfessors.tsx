import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Professor, Subject } from "../../types/types";
import "../../styles/ManageProfessors.css";

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
                    <table className="w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left w-1/5">Prénom</th>
                                <th className="border border-gray-300 px-4 py-2 text-left w-1/5">Nom</th>
                                <th className="border border-gray-300 px-4 py-2 text-left w-1/5">Email</th>
                                <th className="border border-gray-300 px-4 py-2 text-left w-1/5">Matières prises en charge</th>
                                <th className="border border-gray-300 px-4 py-2 text-center w-1/5">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProfessors.map((professor) => (
                                <tr key={professor.id}>
                                    <td className="border border-gray-300 px-4 py-2">{professor.firstName}</td>
                                    <td className="border border-gray-300 px-4 py-2">{professor.lastName}</td>
                                    <td className="border border-gray-300 px-4 py-2">{professor.email}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {professor.subjects
                                            ?.sort((a, b) => a.name.localeCompare(b.name))
                                            .map((s) => s.name)
                                            .join(", ") || "—"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center space-x-4">
                                        <button
                                            onClick={() => handleEditProfessorsButtonPress(professor)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition cursor-pointer"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => setProfessorsToDelete(professor.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition cursor-pointer"
                                        >
                                            Supprimer
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
    );
}