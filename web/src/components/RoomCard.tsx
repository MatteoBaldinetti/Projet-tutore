import "../styles/RoomCard.css";

function RoomCard(props: any) {
  return (
    <div className="bg-white px-8 py-7 flex items-center rounded-xl shadow-md">
      <div className="w-1/3">
        <img
          src={props.imgUrl}
          alt={props.name}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      <div className="w-2/3 ms-10">
        <h3 className="text-xl">
          <a href="">{props.name}</a>
        </h3>
        <p className="mb-5">Type : {props.type}</p>
        <p className="mb-5">Responsable : {props.resp}</p>

        <div className="flex justify-end gap-2">
          <button className="reserve-btn text-white p-2 rounded transition cursor-pointer">
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
