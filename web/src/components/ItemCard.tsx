import "../styles/ItemCard.css";

function ItemCard(props: any) {
    return (
        <div className="bg-white flex rounded-xl shadow-md overflow-hidden">

            {/* IMAGE */}
            <div className="w-40">
                <img
                    src={props.imgUrl}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* CONTENU */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl">{props.name}</h3>
                    <p className="mb-5">
                        Quantité disponible : {props.quantity}
                    </p>
                </div>

                <div className="flex justify-end">
                    <button className="more-btn text-white p-2 me-3 rounded transition cursor-pointer">
                        + de détails
                    </button>
                    <button className="reserve-btn text-white p-2 rounded transition cursor-pointer">
                        Réserver
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;