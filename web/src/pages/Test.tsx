import iutMeauxImg from "../assets/images/iut-meaux.jpg";
import logo from "../assets/images/pret&go.png";
import RoomDetails from "./RoomDetails.tsx";

function Test() {
  const imgTable: string[] = [iutMeauxImg, logo];

  return (
    <div>
      <RoomDetails
        id={1}
        name="Salle de working"
        description="Salle sur deux étages avec plusieurs écrans à disposition pour le travail de groupe."
        salle={209}
      />
    </div>
  );
}

export default Test;
