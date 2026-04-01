import "../styles/ItemCard.css";

interface ItemCardProps {
    name: string;
    description: string;
    quantity: number;
    imgUrl: string;
    categoryName?: string;
    onReserve: () => void;
    onDetails: () => void;
}

function ItemCard(props: ItemCardProps) {
    return (
        <div className="bg-white flex flex-col sm:flex-row rounded-xl overflow-hidden border border-[#E2E8F0]">

            {/* IMAGE */}
            <div className="w-full sm:w-64 shrink-0">
                <img
                    src={props.imgUrl}
                    className="h-48 sm:h-full w-full object-cover"
                />
            </div>

            {/* CONTENU */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-3xl mb-4">{props.name}</h3>
                    <p className="text-gray-500 mb-5">{props.description}</p>
                    <div className="flex flex-row">
                        <div className="me-5">
                            <p className="text-gray-400 uppercase">
                                Quantité
                            </p>
                            <p>
                                {props.quantity} disponibles
                            </p>
                        </div>
                        <div className="ms-5">
                            <p className="text-gray-400 uppercase">
                                Catégorie
                            </p>
                            <p>
                                {props.categoryName || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                <hr className="border-[#F1F5F9]" />

                <div className="flex flex-wrap justify-between items-center gap-2">
                    <button className="more-btn text-white p-2 rounded transition cursor-pointer flex items-center" onClick={props.onDetails}>
                        <svg className="me-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 4.96875H10.9688V6.98438H9V4.96875ZM9 9H10.9688V15H9V9ZM9.98438 0C8.17024 0 6.48795 0.453125 4.9375 1.35938C3.43204 2.23933 2.23933 3.43204 1.35938 4.9375C0.453125 6.48795 0 8.17024 0 9.98438C0 11.7985 0.453125 13.4808 1.35938 15.0313C2.23933 16.5367 3.43204 17.7294 4.9375 18.6094C6.48795 19.5156 8.17024 19.9688 9.98438 19.9688C11.7985 19.9688 13.4808 19.5156 15.0312 18.6094C16.5367 17.7294 17.7294 16.5367 18.6094 15.0313C19.5156 13.4808 19.9688 11.7985 19.9688 9.98438C19.9688 8.17024 19.5156 6.48795 18.6094 4.9375C17.7294 3.43204 16.5367 2.23933 15.0312 1.35938C13.4808 0.453125 11.7985 0 9.98438 0ZM9.98438 18C8.53998 18 7.1945 17.6337 5.94792 16.901C4.73855 16.1903 3.77848 15.2302 3.06771 14.0208C2.33507 12.7743 1.96875 11.4288 1.96875 9.98438C1.96875 8.53998 2.33507 7.1945 3.06771 5.94792C3.77848 4.73855 4.73855 3.77848 5.94792 3.06771C7.1945 2.33507 8.53998 1.96875 9.98438 1.96875C11.4288 1.96875 12.7743 2.33507 14.0208 3.06771C15.2302 3.77848 16.1903 4.73855 16.901 5.94792C17.6337 7.1945 18 8.53998 18 9.98438C18 11.4288 17.6337 12.7743 16.901 14.0208C16.1903 15.2302 15.2302 16.1903 14.0208 16.901C12.7743 17.6337 11.4288 18 9.98438 18Z" fill="currentColor" />
                        </svg>
                        Consulter les détails
                    </button>
                    <button className="reserve-btn text-white py-3 px-4 rounded-3xl transition cursor-pointer flex items-center" onClick={props.onReserve}>
                        Réserver
                        <svg className="ms-3" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.40625 0L0 1.40625L4.59375 6L0 10.5938L1.40625 12L7.40625 6L1.40625 0Z" fill="currentColor" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;