import { useState, useEffect } from "react";
import '../styles/ReservationCalendar.css';

function ReservationCalendar() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

    const daysLabel = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven."];
    const monthLabel = ["Jan", "Feb", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];

    function getWeekDays(date: Date = new Date()): Date[] {
        const result: Date[] = [];
        const current = new Date(date);

        const day = current.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        current.setDate(current.getDate() + diffToMonday);

        for (let i = 0; i < 5; i++) {
            const d = new Date(current);
            d.setDate(current.getDate() + i);
            result.push(d);
        }

        return result;
    }

    function getNextWeek(date: Date): Date {
        const next = new Date(date);
        next.setDate(next.getDate() + 7);
        return next;
    }

    function getPreviousWeek(date: Date): Date {
        const prev = new Date(date);
        prev.setDate(prev.getDate() - 7);
        return prev;
    }

    const hours: number[] = Array.from({ length: 11 }, (_, i) => i + 8);
    const quarters: number[] = [0, 15, 30, 45];

    useEffect(() => {
        setCurrentWeek(getWeekDays(currentDate));
    }, [currentDate]);

    const formatDayMonth = (date: Date) =>
        `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

    const today = new Date();

    return (
        <div className="w-full">
            {/* NAVIGATION CENTRÉE */}
            <div className="flex justify-center items-center gap-2 mb-4 mt-3">
                {/* Flèche gauche */}
                <button
                    className="px-1 py-1 me-2 rounded hover:bg-gray-200 arrow-btn transition cursor-pointer"
                    onClick={() => setCurrentDate(getPreviousWeek(currentDate))}
                >
                    <svg height={30} width={30} viewBox="0 0 24 24" fill="none">
                        <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="#FFFFFF"/>
                    </svg>
                </button>

                {/* Texte semaine */}
                <div className="font-medium">
                    {currentWeek[0] && (
                        <span>
                            Du {String(currentWeek[0].getDate()).padStart(2, "0")} au {String(currentWeek[4].getDate()).padStart(2, "0")}{" "}
                            {monthLabel[currentWeek[0].getMonth()]} {currentWeek[0].getFullYear()}
                        </span>
                    )}
                </div>

                {/* Flèche droite */}
                <button
                    className="px-1 py-1 ms-2 rounded hover:bg-gray-200 arrow-btn transition cursor-pointer"
                    onClick={() => setCurrentDate(getNextWeek(currentDate))}
                >
                    <svg height={30} width={30} viewBox="0 0 24 24" fill="none">
                        <path d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z" fill="#FFFFFF"/>
                    </svg>
                </button>

                {/* Bouton Aujourd'hui */}
                <button
                    className="px-2 py-2 ms-2 rounded back-today-btn text-white transition cursor-pointer"
                    onClick={() => setCurrentDate(new Date())}
                >
                    Revenir à Aujourd'hui
                </button>
            </div>

            {/* CALENDRIER */}
            <div className="grid grid-cols-6 text-sm border-gray-400 border-l border-t">
                {/* Coin vide */}
                <div className="border-gray-400 border-r border-b"></div>

                {/* JOURS */}
                {currentWeek.map((day, index) => {
                    const isToday = day.toDateString() === today.toDateString();
                    return (
                        <div
                            key={day.toISOString()}
                            className={`text-center font-semibold border-gray-400 border-r border-b py-2 ${isToday ? "bg-yellow-100" : ""}`}
                        >
                            {daysLabel[index]} {formatDayMonth(day)}
                        </div>
                    );
                })}

                {/* HEURES */}
                {hours.map((hour) => (
                    <div className="contents" key={hour}>
                        {/* Heure */}
                        <div className="text-right pr-2 font-semibold h-30 border-gray-400 border-r border-b pt-1">
                            {hour}:00
                        </div>

                        {/* Colonnes jours */}
                        {currentWeek.map((day) => {
                            const isToday = day.toDateString() === today.toDateString();
                            return (
                                <div
                                    key={day.toISOString() + hour}
                                    className={`border-gray-400 border-r border-b h-30 ${isToday ? "bg-yellow-50" : ""}`}
                                >
                                    {quarters.map((q) => (
                                        <div
                                            key={q}
                                            className={`h-7.5 ${q === 30 ? "border-t border-gray-200" : ""}`}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReservationCalendar;