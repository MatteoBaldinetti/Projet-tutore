import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Notification, User } from "../../types/types";
import "../../styles/ManageNotifications.css";
import Layout from "../../components/Layout";

const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};

export default function ManageNotifications() {
    const [notificationList, setNotificationList] = useState<Notification[]>([]);
    const [search, setSearch] = useState("");

    const [showAddNotification, setShowAddNotification] = useState<boolean>(false);
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

    const [message, setMessage] = useState("");
    const [userList, setUserList] = useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [userSearch, setUserSearch] = useState("");

    const [notificationToDelete, setNotificationToDelete] = useState<number | null>(null);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_URL}/notifications`, {
                headers: { "x-api-key": API_KEY },
            });
            setNotificationList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des notifications :", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`, {
                headers: { "x-api-key": API_KEY },
            });
            setUserList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs :", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchUsers();
    }, []);

    const filteredNotifications = notificationList.filter((n) =>
        n.message.toLowerCase().includes(search.toLowerCase())
    );

    const filteredUsers = userList.filter((u) => {
        const value = userSearch.toLowerCase();
        return (
            u.firstName.toLowerCase().includes(value) ||
            u.lastName.toLowerCase().includes(value) ||
            u.email.toLowerCase().includes(value)
        );
    });

    const handleAddNotificationButtonPress = () => {
        setEditingNotification(null);
        setMessage("");
        setSelectedUserIds([]);
        setUserSearch("");
        setShowAddNotification(true);
    };

    const handleEditNotificationButtonPress = (notification: Notification) => {
        setEditingNotification(notification);
        setMessage(notification.message);
        setSelectedUserIds([]);
        setUserSearch("");
        setShowAddNotification(true);
    };

    const addOrUpdateNotification = async () => {
        try {
            const payload = {
                message,
                createdAt: editingNotification ? editingNotification.createdAt : new Date().toISOString(),
                userIds: selectedUserIds,
            };

            if (editingNotification) {
                await axios.put(`${API_URL}/notifications/${editingNotification.id}`, payload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            } else {
                await axios.post(`${API_URL}/notifications`, payload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            }

            await fetchNotifications();
            setShowAddNotification(false);
            setEditingNotification(null);
            setMessage("");
            setSelectedUserIds([]);
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de la notification :", err);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/notifications/${id}`, {
                headers: { "x-api-key": API_KEY },
            });
            await fetchNotifications();
            setNotificationToDelete(null);
        } catch (err) {
            console.error("Erreur lors de la suppression de la notification :", err);
        }
    };

    const toggleSelectAll = () => {
        if (selectedUserIds.length === filteredUsers.length) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(filteredUsers.map((u) => u.id));
        }
    };

    useEffect(() => {
        if (showAddNotification || notificationToDelete !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [showAddNotification, notificationToDelete]);

    return (
        <Layout
            titleHeader="Gestion des notifications"
            children={
                <div className="min-h-screen bg-gray-100 p-6">
                    <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">

                        <div className="flex justify-between items-center mb-6 gap-4">
                            <h1 className="text-3xl font-semibold text-left whitespace-nowrap">
                                Liste des notifications
                            </h1>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                                />
                                <button onClick={handleAddNotificationButtonPress} className="add-notification-btn text-white px-4 py-2 rounded transition cursor-pointer whitespace-nowrap">
                                    + Envoyer une notification
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-md">
                                <thead className="bg-[#E8F4F3] border border-[#E8F4F3]">
                                    <tr>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-3/4">Message</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-1/4">Date</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-center w-1/4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNotifications.map((notification) => (
                                        <tr key={notification.id}>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9] max-w-md truncate">{notification.message}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{formatDate(notification.createdAt)}</td>
                                            <td className="px-4 py-3 text-center space-x-4 border-b border-[#F1F5F9]">
                                                <button onClick={() => handleEditNotificationButtonPress(notification)} className="cursor-pointer">
                                                    <svg className="w-5 h-5 text-gray-400 hover:text-[#3A8C85] transition-colors" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.00023 16H3.42523L13.2002 6.225L11.7752 4.8L2.00023 14.575V16ZM0.000234375 18V13.75L13.2002 0.575C13.4002 0.391666 13.6211 0.25 13.8627 0.150001C14.1044 0.0500002 14.3586 0 14.6252 0C14.8919 0 15.1502 0.0500002 15.4002 0.150001C15.6502 0.25 15.8669 0.4 16.0502 0.599999L17.4252 2C17.6252 2.18333 17.7711 2.4 17.8627 2.65C17.9544 2.9 18.0002 3.15 18.0002 3.4C18.0002 3.66667 17.9544 3.92083 17.8627 4.1625C17.7711 4.40417 17.6252 4.625 17.4252 4.825L4.25023 18H0.000234375ZM16.0002 3.4L14.6002 2L16.0002 3.4ZM12.4752 5.525L11.7752 4.8L13.2002 6.225L12.4752 5.525Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => setNotificationToDelete(notification.id)} className="cursor-pointer">
                                                    <svg className="w-5 h-5 text-gray-400 hover:text-red-600 transition-colors" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3.00023 18C2.45023 18 1.9794 17.8042 1.58773 17.4125C1.19607 17.0208 1.00023 16.55 1.00023 16V3H0.000234494V1H5.00023V0H11.0002V1H16.0002V3H15.0002V16C15.0002 16.55 14.8044 17.0208 14.4127 17.4125C14.0211 17.8042 13.5502 18 13.0002 18H3.00023ZM13.0002 3H3.00023V16H13.0002V3ZM5.00023 14H7.00023V5H5.00023V14ZM9.00023 14H11.0002V5H9.00023V14ZM3.00023 3V16V3Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredNotifications.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center py-6 text-gray-500 italic">Aucune notification trouvée</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {showAddNotification && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl w-250 max-h-[90vh] overflow-y-auto">
                                    <h2 className="text-xl font-semibold mb-4">{editingNotification ? "Modifier la notification" : "Envoyer une notification"}</h2>
                                    <form onSubmit={(e) => { e.preventDefault(); addOrUpdateNotification(); }}>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col">
                                                <label htmlFor="message" className="mb-1 font-medium">Message</label>
                                                <textarea
                                                    id="message"
                                                    rows={4}
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="mb-2 font-medium">Destinataires</label>
                                                <input
                                                    type="text"
                                                    placeholder="Rechercher un utilisateur..."
                                                    value={userSearch}
                                                    onChange={(e) => setUserSearch(e.target.value)}
                                                    className="border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                                />
                                                <div className="flex items-center gap-2 mb-2">
                                                    <input
                                                        type="checkbox"
                                                        id="selectAll"
                                                        checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                                                        onChange={toggleSelectAll}
                                                        className="cursor-pointer"
                                                    />
                                                    <label htmlFor="selectAll" className="text-sm cursor-pointer">Tout sélectionner ({filteredUsers.length})</label>
                                                </div>
                                                <div className="border border-gray-300 rounded p-2 max-h-40 overflow-y-auto">
                                                    {filteredUsers.length === 0 ? (
                                                        <p className="text-sm text-gray-500 italic">Aucun utilisateur trouvé</p>
                                                    ) : (
                                                        filteredUsers.map((user) => (
                                                            <label key={user.id} className="flex items-center gap-2 mb-1 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedUserIds.includes(user.id)}
                                                                    onChange={() => {
                                                                        if (selectedUserIds.includes(user.id)) {
                                                                            setSelectedUserIds(selectedUserIds.filter((id) => id !== user.id));
                                                                        } else {
                                                                            setSelectedUserIds([...selectedUserIds, user.id]);
                                                                        }
                                                                    }}
                                                                    className="cursor-pointer"
                                                                />
                                                                <span>{user.firstName} {user.lastName}</span>
                                                                <span className="text-gray-400 text-xs">({user.email})</span>
                                                            </label>
                                                        ))
                                                    )}
                                                </div>
                                                {selectedUserIds.length > 0 && (
                                                    <p className="text-sm text-[#3A8C85] mt-1">{selectedUserIds.length} destinataire(s) sélectionné(s)</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button type="button" onClick={() => { setShowAddNotification(false); setEditingNotification(null); }} className="px-4 py-2 cancel-send-notification-btn rounded transition cursor-pointer">Annuler</button>
                                            <button type="submit" className="px-4 py-2 send-notification-btn text-white rounded transition cursor-pointer">Envoyer</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {notificationToDelete !== null && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
                                    <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                                    <p>Êtes-vous sûr de vouloir supprimer cette notification ?</p>
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button onClick={() => setNotificationToDelete(null)} className="px-4 py-2 rounded cancel-delete-notification-btn transition cursor-pointer">Annuler</button>
                                        <button onClick={() => notificationToDelete && deleteNotification(notificationToDelete)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer">Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            } />
    );
}
