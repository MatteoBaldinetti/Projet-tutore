import "../styles/ItemCard.css";

function ItemCard(props: any) {
    return (
        <div className="bg-white p-6 flex items-center rounded-xl shadow-md">
            <div className="rounded-s-xl">
                <img
                    src={props.imgUrl}
                    width={150}
                />
            </div>

            <div className="ms-10 flex-1">
                <h3 className="text-xl">{props.name}</h3>
                <p className="mb-5">Quantité disponible : {props.quantity}</p>

                <div className="flex justify-end">
                    <button className="reserve-btn text-white p-2 rounded transition cursor-pointer">
                        Réserver
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;