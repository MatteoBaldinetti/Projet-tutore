import { useState, useEffect } from "react";
import "../styles/ReservationCalendar.css";

const START_HOUR = 8;
const END_HOUR = 19;
const QUARTERS = [0, 15, 30, 45];
const HOUR_HEIGHT = 60;

interface TimeSlot {
    day: string;
    hour: number;
    quarter: number;
}

interface ReservationCalendarSelectionProps {
    onSelectionChange?: (start: number | null, end: number | null) => void;
}

function ReservationCalendarSelection({ onSelectionChange }: ReservationCalendarSelectionProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
    const [selectionStart, setSelectionStart] = useState<TimeSlot | null>(null);
    const [selection, setSelection] = useState<TimeSlot[]>([]);

    const monthLabel = ["Jan", "Feb", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    const startOfCurrentWeek = getStartOfWeek(today);

    useEffect(() => {
        setCurrentWeek(getWeekDays(currentDate));
    }, [currentDate]);

    function getWeekDays(date: Date): Date[] {
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

    function getStartOfWeek(date: Date) {
        const d = new Date(date);
        const day = d.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        d.setDate(d.getDate() + diffToMonday);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function getNextWeek(date: Date) {
        const d = new Date(date);
        d.setDate(d.getDate() + 7);
        return d;
    }

    function getPreviousWeek(date: Date) {
        const d = new Date(date);
        d.setDate(d.getDate() - 7);
        return d;
    }

    const canGoPrevWeek = startOfCurrentWeek < getStartOfWeek(currentDate);

    const selectionStartTime = (slot: TimeSlot) => {
        const d = new Date(slot.day);
        d.setHours(slot.hour, slot.quarter, 0, 0);
        return d;
    };

    const handleCellClick = (day: Date, hour: number, quarter: number) => {
        const cellDate = new Date(day);
        cellDate.setHours(hour, quarter, 0, 0);
        if (cellDate < today) return;

        const cell: TimeSlot = { day: day.toDateString(), hour, quarter };

        if (!selectionStart) {
            setSelectionStart(cell);
            setSelection([cell]);
        } else {
            const startTime = selectionStartTime(selectionStart);

            const minTime = Math.min(startTime.getTime(), cellDate.getTime());
            const maxTime = Math.max(startTime.getTime(), cellDate.getTime());

            const slots: TimeSlot[] = [];

            for (let t = minTime; t <= maxTime; t += 15 * 60 * 1000) {
                const d = new Date(t);
                slots.push({
                    day: d.toDateString(),
                    hour: d.getHours(),
                    quarter: d.getMinutes(),
                });
            }

            setSelection(slots);
            setSelectionStart(null);
        }
    };

    const isSelected = (day: Date, hour: number, quarter: number) => {
        return selection.some(
            (s) =>
                s.day === day.toDateString() &&
                s.hour === hour &&
                s.quarter === quarter
        );
    };

    const isDisabled = (day: Date, hour: number, quarter: number) => {
        const cellDate = new Date(day);
        cellDate.setHours(hour, quarter, 0, 0);

        if (cellDate < today) return true;

        // Bloquer après 18h
        if (hour === 18 && quarter > 0) return true;

        return false;
    };

    const hours = Array.from(
        { length: END_HOUR - START_HOUR },
        (_, i) => START_HOUR + i
    );

    const formatDayMonth = (date: Date) =>
        `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

    const clearSelection = () => {
        setSelection([]);
        setSelectionStart(null);
    };

    const startTime =
        selection.length > 0
            ? new Date(selection[0].day).setHours(
                selection[0].hour,
                selection[0].quarter,
                0,
                0
            )
            : null;

    const endTime =
        selection.length > 0
            ? new Date(selection[selection.length - 1].day).setHours(
                selection[selection.length - 1].hour,
                selection[selection.length - 1].quarter,
                0,
                0
            )
            : null;

    const formatDateTime = (time: number | null) => {
        if (!time) return "-";
        const d = new Date(time);
        return `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
        ).padStart(2, "0")} ${String(d.getHours()).padStart(
            2,
            "0"
        )}:${String(d.getMinutes()).padStart(2, "0")}`;
    };

    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(startTime, endTime);
        }
    }, [startTime, endTime]);

    return (
        <div className="w-full select-none">
            <h1 className="text-3xl font-semibold text-left whitespace-nowrap">
                Sélectionnez votre horaire de réservation
            </h1>

            {/* NAVIGATION */}
            <div className="flex justify-center items-center gap-2 mb-4 mt-3">
                {/* Flèche gauche */}
                <button
                    className="px-1 py-1 me-2 rounded hover:bg-gray-200 arrow-btn transition cursor-pointer"
                    onClick={() => canGoPrevWeek && setCurrentDate(getPreviousWeek(currentDate))}
                >
                    <svg height={30} width={30} viewBox="0 0 24 24" fill="none">
                        <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="#FFFFFF" />
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
                        <path d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z" fill="#FFFFFF" />
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
            <div className="grid grid-cols-6 border-l border-t border-gray-400 text-sm">
                <div className="border-r border-b border-gray-400"></div>

                {currentWeek.map((day, i) => (
                    <div
                        key={day.toISOString()}
                        className="text-center font-semibold border-r border-b border-gray-400 py-2"
                    >
                        {["Lun.", "Mar.", "Mer.", "Jeu.", "Ven."][i]}{" "}
                        {formatDayMonth(day)}
                    </div>
                ))}

                <div>
                    {hours.map((h) => (
                        <div
                            key={h}
                            className="border-r border-b border-gray-400 text-right pr-2"
                            style={{ height: HOUR_HEIGHT }}
                        >
                            {h}:00
                        </div>
                    ))}
                </div>

                {currentWeek.map((day) => (
                    <div
                        key={day.toISOString()}
                        className="relative border-r border-gray-400"
                        style={{ height: hours.length * HOUR_HEIGHT }}
                    >
                        {hours.map((h) => (
                            <div
                                key={h}
                                className="border-b border-gray-400"
                                style={{ height: HOUR_HEIGHT }}
                            >
                                {QUARTERS.map((q) => {
                                    const disabled = isDisabled(day, h, q);

                                    return (
                                        <div
                                            key={q}
                                            className={`h-3.75 border-t border-gray-200 
                                                ${isSelected(day, h, q)
                                                    ? "bg-blue-300"
                                                    : ""
                                                }
                                                ${disabled
                                                    ? "bg-gray-200 cursor-not-allowed"
                                                    : "cursor-pointer"
                                                }
                                                ${!isSelected(day, h, q) &&
                                                    !disabled
                                                    ? "hover:bg-gray-300"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                !disabled &&
                                                handleCellClick(day, h, q)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* INFOS */}
            <div className="flex justify-center items-center gap-2 mb-4 mt-3">
                <p className="mx-5">
                    <span className="font-bold">
                        Date de départ sélectionnée :
                    </span>{" "}
                    {formatDateTime(startTime)}
                </p>

                <p className="mx-5">
                    <span className="font-bold">
                        Date de fin sélectionnée :
                    </span>{" "}
                    {formatDateTime(endTime)}
                </p>

                <button
                    className="px-2 py-2 mx-5 rounded bg-red-500 hover:bg-red-600 text-white transition cursor-pointer"
                    onClick={clearSelection}
                >
                    Effacer la sélection
                </button>
            </div>
        </div >
    );
}

export default ReservationCalendarSelection;