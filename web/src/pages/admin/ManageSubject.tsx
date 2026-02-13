import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Subject } from "../../types/types";
import "../../styles/ManageSubjects.css";

export default function ManageSubject() {
    const [subjectList, setSubjectList] = useState<Subject[]>([]);
    const [search, setSearch] = useState("");

    const [showAddSubject, setShowAddSubject] = useState<boolean>(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [subjectToDelete, setSubjectToDelete] = useState<number | null>(null);


    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${API_URL}/subjects`, {
                headers: { "x-api-key": API_KEY },
            });
            setSubjectList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des matières :", err);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleAddSubjectButtonPress = () => {
        setEditingSubject(null);
        setName("");
        setDescription("");
        setShowAddSubject(true);
    }

    const handleEditSubjectButtonPress = (subject: Subject) => {
        setEditingSubject(subject);
        setName(subject.name);
        setDescription(subject.description);
        setShowAddSubject(true);
    }

    const addOrUpdateSubject = async () => {
        try {
            const subjectPayload = {
                name,
                description
            };

            if (editingSubject) {
                await axios.put(`${API_URL}/subjects/${editingSubject.id}`, subjectPayload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            } else {
                await axios.post(`${API_URL}/subjects`, subjectPayload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            }

            await fetchSubjects();
            setShowAddSubject(false);
            setName("");
            setDescription("");
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de la matière :", err);
        }
    }

    const deleteSubject = async (idSubject: number) => {
        try {
            await axios.delete(`${API_URL}/subjects/${idSubject}`, {
                headers: { "x-api-key": API_KEY },
            });
            await fetchSubjects();
            setSubjectToDelete(null);
        } catch (err) {
            console.error("Erreur lors de la suppression des étudiants :", err);
        }
    };

    const filteredSubjects = subjectList.filter((subject) => {
        const value = search.toLowerCase();
        return (
            subject.name.toLowerCase().includes(value) ||
            subject.description.toLowerCase().includes(value)
        );
    });

    useEffect(() => {
        if (showAddSubject || subjectToDelete !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showAddSubject, subjectToDelete]);


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">

                <div className="flex justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-semibold text-left whitespace-nowrap">
                        Gestion des matières
                    </h1>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                        />

                        <button onClick={handleAddSubjectButtonPress} className="add-subject-btn text-white px-4 py-2 rounded transition cursor-pointer whitespace-nowrap">
                            + Ajouter une matière
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left w-1/4">Nom</th>
                                <th className="border border-gray-300 px-4 py-2 text-left w-2/4">Description</th>
                                <th className="border border-gray-300 px-4 py-2 text-left w-1/4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td className="border border-gray-300 px-4 py-2 text-left">{subject.name}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-left">{subject.description}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center space-x-4">
                                        <button
                                            onClick={() => handleEditSubjectButtonPress(subject)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition cursor-pointer"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => setSubjectToDelete(subject.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition cursor-pointer"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredSubjects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-500">
                                        Aucune matière trouvé
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pop-up ajout / modification */}
                {showAddSubject && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-250">
                            <h2 className="text-xl font-semibold mb-4">{editingSubject ? "Modifier l'étudiant" : "Ajouter un étudiant"}</h2>
                            <form onSubmit={(e) => { e.preventDefault(); addOrUpdateSubject(); }}>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="name" className="mb-1 font-medium">Nom</label>
                                        <input
                                            id="name"
                                            type="text"
                                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="description" className="mb-1 font-medium">Description</label>
                                        <textarea
                                            id="description"
                                            rows={6}
                                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                                    <button type="button" onClick={() => { setShowAddSubject(false); setEditingSubject(null); }} className="px-4 py-2 cancel-send-subject-btn rounded transition cursor-pointer">Annuler</button>
                                    <button type="submit" className="px-4 py-2 send-subject-btn text-white rounded transition cursor-pointer">Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Pop-up suppression */}
                {subjectToDelete !== null && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                            <p>Êtes-vous sûr de vouloir supprimer cette matière ?</p>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => setSubjectToDelete(null)}
                                    className="px-4 py-2 rounded cancel-delete-subject-btn transition cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => subjectToDelete && deleteSubject(subjectToDelete)}
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