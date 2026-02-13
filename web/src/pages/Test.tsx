import ReservationCalendar from "../components/ReservationCalendar";
import RoomCard from "../components/RoomCard";
import iutMeauxImg from "../assets/images/iut-meaux.jpg";

function Test() {
  // Variables de test pour une seule salle
  const testRoom = {
    imgUrl: iutMeauxImg,
    name: "Salle TP Informatique",
    room: "A101",
    type: "Salle de TP",
    description: "Salle composée de beaucoup d'ordinateurs",
  };

  // Variables de test pour plusieurs salles
  const testRooms = [
    {
      imgUrl: iutMeauxImg,
      name: "Salle TP Informatique",
      room: "A101",
      type: "Salle de TP",
      description: "Salle avec beaucoup d'ordinateurs",
    },
    {
      imgUrl: iutMeauxImg,
      name: "Amphithéâtre A",
      room: "B201",
      type: "Amphithéâtre",
      description:
        "Grand amphithéâtre pouvant accueillir jusqu'à 200 personnes, équipé d'un système de projection moderne",
    },
    {
      imgUrl: iutMeauxImg,
      name: "Salle de Réunion B12",
      room: "B012",
      type: "Salle de réunion",
      description:
        "Salle de réunion équipée d'un écran interactif et d'une table de conférence pour 12 personnes",
    },
  ];

  return (
    <div>
      <div className="p-5">
        <ReservationCalendar />
      </div>

      {/* Test avec une seule salle */}
      <div className="p-5">
        <RoomCard
          imgUrl={testRoom.imgUrl}
          name={testRoom.name}
          room={testRoom.room}
          type={testRoom.type}
          description={testRoom.description}
        />
      </div>

      {/* Test avec plusieurs salles */}
      <div className="p-5 space-y-4">
        {testRooms.map((room, index) => (
          <RoomCard
            key={index}
            imgUrl={room.imgUrl}
            name={room.name}
            room={room.room}
            type={room.type}
            description={room.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Test;
