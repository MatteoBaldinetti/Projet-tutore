import "../styles/RoomCard.css";

function RoomCard(props: any) {
  return (
    <div className="bg-white px-8 py-7 flex rounded-xl shadow-md">
      <div className="w-1/3" style={{ maxWidth: "400px" }}>
        <img
          src={props.imgUrl}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      <div className="w-2/3 ms-10 flex flex-col justify-between">
        <div>
          <h1 className="text-xl">
            <a href="">{props.name}</a>
          </h1>
          <h2>N° de Salle : {props.room}</h2>
          <h2 className="mb-5 text-gray-400 italic">{props.type}</h2>
          <h3 className="mb-5">
            Description : <br></br> <p>{props.description}</p>
          </h3>
        </div>

        <div className="flex justify-end gap-2">
          <button className="details-btn text-white p-2 rounded transition cursor-pointer">
            Détails
          </button>
          <button className="reserve-btn text-white p-2 rounded transition cursor-pointer">
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
