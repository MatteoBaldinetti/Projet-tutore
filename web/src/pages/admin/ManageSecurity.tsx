import { useEffect, useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { SecurityAgent } from "../../../types/types";
import "../../styles/ManageSecurity.css";
import Layout from "../../components/Layout";

export default function ManageSecurity() {
    const [agentList, setAgentList] = useState<SecurityAgent[]>([]);
    const [search, setSearch] = useState("");

    const [showAddAgent, setShowAddAgent] = useState<boolean>(false);
    const [editingAgent, setEditingAgent] = useState<SecurityAgent | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [agentToDelete, setAgentToDelete] = useState<number | null>(null);

    const fetchAgents = async () => {
        try {
            const res = await axios.get(`${API_URL}/security`, {
                headers: { "x-api-key": API_KEY },
            });
            setAgentList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des agents de sécurité :", err);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleAddButtonPress = () => {
        setEditingAgent(null);
        setFirstName("");
        setLastName("");
        setEmail("");
        setShowAddAgent(true);
    };

    const handleEditButtonPress = (agent: SecurityAgent) => {
        setEditingAgent(agent);
        setFirstName(agent.firstName);
        setLastName(agent.lastName);
        setEmail(agent.email);
        setShowAddAgent(true);
    };

    const addOrUpdateAgent = async () => {
        try {
            const password = editingAgent
                ? editingAgent.password
                : await bcrypt.hash("test", 10);

            const payload = {
                firstName,
                lastName,
                email,
                password,
                createdAt: editingAgent ? editingAgent.createdAt : new Date().toISOString(),
                enabled: true,
            };

            if (editingAgent) {
                await axios.put(`${API_URL}/security/${editingAgent.id}`, payload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            } else {
                await axios.post(`${API_URL}/security`, payload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            }

            await fetchAgents();
            setShowAddAgent(false);
            setEditingAgent(null);
            setFirstName("");
            setLastName("");
            setEmail("");
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de l'agent :", err);
        }
    };

    const deleteAgent = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/security/${id}`, {
                headers: { "x-api-key": API_KEY },
            });
            await fetchAgents();
            setAgentToDelete(null);
        } catch (err) {
            console.error("Erreur lors de la suppression de l'agent :", err);
        }
    };

    const filteredAgents = agentList.filter((agent) => {
        const value = search.toLowerCase();
        return (
            agent.lastName.toLowerCase().includes(value) ||
            agent.firstName.toLowerCase().includes(value)
        );
    });

    useEffect(() => {
        if (showAddAgent || agentToDelete !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showAddAgent, agentToDelete]);

    return (
        <Layout
            titleHeader="Gestion des agents de sécurité"
            children={
                <div className="min-h-screen bg-gray-100 p-6">
                    <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">

                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                            <h1 className="text-xl sm:text-3xl font-semibold">
                                Liste des agents de sécurité
                            </h1>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-full sm:w-64"
                                />
                                <button onClick={handleAddButtonPress} className="add-security-btn text-white px-4 py-2 rounded transition cursor-pointer whitespace-nowrap">
                                    + Ajouter un agent
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-md">
                                <thead className="bg-[#E8F4F3] border border-[#E8F4F3]">
                                    <tr>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-1/4">Prénom</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-1/4">Nom</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-2/4">Email</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-center w-1/4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAgents.map((agent) => (
                                        <tr key={agent.id}>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{agent.firstName}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{agent.lastName}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{agent.email}</td>
                                            <td className="px-4 py-3 text-center space-x-4 border-b border-[#F1F5F9]">
                                                <button onClick={() => handleEditButtonPress(agent)} className="cursor-pointer">
                                                    <svg className="w-5 h-5 text-gray-400 hover:text-[#3A8C85] transition-colors" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                        <path d="M2.00023 16H3.42523L13.2002 6.225L11.7752 4.8L2.00023 14.575V16ZM0.000234375 18V13.75L13.2002 0.575C13.4002 0.391666 13.6211 0.25 13.8627 0.150001C14.1044 0.0500002 14.3586 0 14.6252 0C14.8919 0 15.1502 0.0500002 15.4002 0.150001C15.6502 0.25 15.8669 0.4 16.0502 0.599999L17.4252 2C17.6252 2.18333 17.7711 2.4 17.8627 2.65C17.9544 2.9 18.0002 3.15 18.0002 3.4C18.0002 3.66667 17.9544 3.92083 17.8627 4.1625C17.7711 4.40417 17.6252 4.625 17.4252 4.825L4.25023 18H0.000234375ZM12.4752 5.525L11.7752 4.8L13.2002 6.225L12.4752 5.525Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => setAgentToDelete(agent.id)} className="cursor-pointer">
                                                    <svg className="w-5 h-5 text-gray-400 hover:text-red-600 transition-colors" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                                        <path d="M3.00023 18C2.45023 18 1.9794 17.8042 1.58773 17.4125C1.19607 17.0208 1.00023 16.55 1.00023 16V3H0.000234494V1H5.00023V0H11.0002V1H16.0002V3H15.0002V16C15.0002 16.55 14.8044 17.0208 14.4127 17.4125C14.0211 17.8042 13.5502 18 13.0002 18H3.00023ZM13.0002 3H3.00023V16H13.0002V3ZM5.00023 14H7.00023V5H5.00023V14ZM9.00023 14H11.0002V5H9.00023V14Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredAgents.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                                                Aucun agent de sécurité trouvé
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pop-up ajout / modification */}
                        {showAddAgent && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl w-full max-w-2xl mx-4">
                                    <h2 className="text-xl font-semibold mb-4">{editingAgent ? "Modifier l'agent" : "Ajouter un agent de sécurité"}</h2>
                                    <form onSubmit={(e) => { e.preventDefault(); addOrUpdateAgent(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="firstname" className="mb-1 font-medium">Prénom</label>
                                            <input
                                                id="firstname"
                                                type="text"
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="lastname" className="mb-1 font-medium">Nom</label>
                                            <input
                                                id="lastname"
                                                type="text"
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col md:col-span-2">
                                            <label htmlFor="email" className="mb-1 font-medium">Email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        {!editingAgent && (
                                            <p className="md:col-span-2 text-xs text-gray-400 italic">
                                                Le mot de passe par défaut sera <strong>test</strong>. L'agent devra le changer lors de sa première connexion.
                                            </p>
                                        )}
                                        <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                                            <button type="button" onClick={() => { setShowAddAgent(false); setEditingAgent(null); }} className="px-4 py-2 cancel-send-security-btn rounded transition cursor-pointer">Annuler</button>
                                            <button type="submit" className="px-4 py-2 send-security-btn text-white rounded transition cursor-pointer">Enregistrer</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Pop-up suppression */}
                        {agentToDelete !== null && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 shadow-lg">
                                    <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                                    <p>Êtes-vous sûr de vouloir supprimer cet agent de sécurité ?</p>
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button onClick={() => setAgentToDelete(null)} className="px-4 py-2 rounded cancel-delete-security-btn transition cursor-pointer">
                                            Annuler
                                        </button>
                                        <button onClick={() => agentToDelete && deleteAgent(agentToDelete)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer">
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
