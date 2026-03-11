import { useState } from "react";
import ImageSlider from "../components/ImageSlider";
import Layout from "../components/Layout";
import ReservationCalendar from "../components/ReservationCalendar";

import room1 from "../assets/room1.png";
import room2 from "../assets/room2.png";
import room3 from "../assets/room3.png";
import room4 from "../assets/room4.png";

import "../styles/RoomDetails.css";

const placeholderImages = [room1, room2, room3, room4];

interface Room {
  id: number;
  name: string;
  description: string;
  salle: number;
  capacity: number;
  type: string;
  equipment: string[];
  images: string[];
}

const placeholderRoom: Room = {
  id: 1,
  name: "Salle Innovation",
  description:
    "Grande salle de travail collaboratif équipée de tableaux blancs interactifs, de prises de courant et d'une connexion Wi-Fi haut débit. Idéale pour les travaux de groupe et les présentations.",
  salle: 203,
  capacity: 30,
  type: "Salle de cours",
  equipment: [
    "Projecteur",
    "Tableau blanc interactif",
    "Wi-Fi",
    "Climatisation",
    "Prises USB",
  ],
  images: placeholderImages,
};

export default function RoomDetails() {
  const props = placeholderRoom;

  const [activeTab, setActiveTab] = useState<"description" | "calendar">(
    "description",
  );

  return (
    <Layout titleHeader="Détails de la salle">
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Bloc principal : deux cartes côte à côte */}
        <div className="flex gap-6 mb-6">

          {/* Carte slider (60%) */}
          <div className="bg-white p-6 rounded-xl shadow-sm" style={{ flex: 6, minWidth: 0 }}>
            <ImageSlider images={props.images} />
          </div>

          {/* Carte infos (40%) */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between" style={{ flex: 4 }}>
            <div>
              {/* Titre + N° salle */}
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {props.name}
              </h1>
              <h2 className="italic text-gray-500 mb-4">
                N° Salle : {props.salle}
              </h2>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="room-info-badge text-sm font-medium px-3 py-1 rounded-full">
                  {props.type}
                </span>
                <span className="room-info-badge text-sm font-medium px-3 py-1 rounded-full">
                  👥 {props.capacity} places
                </span>
              </div>

              {/* Équipements */}
              <div>
                <h3 className="room-section-title text-base font-semibold mb-2">
                  Équipements
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {props.equipment.map((item, index) => (
                    <li
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bouton réserver */}
            <div className="flex justify-end mt-4">
              <button className="reserve-room-btn text-white px-5 py-2 rounded transition cursor-pointer font-medium whitespace-nowrap">
                Réserver cette salle
              </button>
            </div>
          </div>
        </div>

        {/* Bloc inférieur : onglets description / calendrier */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Onglets */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium transition cursor-pointer ${
                activeTab === "description"
                  ? "border-b-2 text-(--dark-cyan) border-(--dark-cyan)"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium transition cursor-pointer ${
                activeTab === "calendar"
                  ? "border-b-2 text-(--dark-cyan) border-(--dark-cyan)"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              Disponibilités
            </button>
          </div>

          {/* Contenu onglets */}
          <div className="p-6">
            {activeTab === "description" && (
              <div>
                <h2 className="room-section-title text-lg font-semibold mb-3">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {props.description}
                </p>
              </div>
            )}

            {activeTab === "calendar" && (
              <div>
                <h2 className="room-section-title text-lg font-semibold mb-3">
                  Calendrier des disponibilités
                </h2>
                <ReservationCalendar />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
