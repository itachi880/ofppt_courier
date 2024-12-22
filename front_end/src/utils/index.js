import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { events } from "../data";

export function MyCalendar() {
  const [CalendarEvents] = events.useStore(); // Récupère les données depuis votre store
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [notification, setNotification] = useState("");

  //hasEvent() vérifie si un événement est présent pour une date donnée
  const hasEvent = (date) => {
    return CalendarEvents.data.some((e) => e.date === date.toISOString().split("T")[0]);
  };
  const tileContent = ({ date, view }) => {
    if (view === "month" && hasEvent(date)) {
      return (
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              bottom: "-4px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "6px",
              height: "6px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          ></span>
        </div>
      );
    }
    return null;
  };
  // Génération des lignes du tableau en fonction des événements
  const RenderTableRows = () => {
    if (!selectedDate) return null; // Pas de date sélectionnée
    const event = CalendarEvents.data.find((e) => e.date === selectedDate);
    if (event) {
      return (
        <tr>
          <td className="table-cell">{event.date}</td>
          <td className="table-cell">{event.note}</td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td className="table-cell">{selectedDate}</td>
          <td className="table-cell">Aucun événement pour cette date</td>
        </tr>
      );
    }
  };

  return (
    <>
      <h1>Mon Calendrier</h1>
      <div className="calendar-container">
        <Calendar
          onChange={(date) => {
            const selectedDate = Array.isArray(date) ? new Date(date[0]) : new Date(date);
            selectedDate.setDate(selectedDate.getDate() + 1);
            setSelectedDate(selectedDate.toISOString().split("T")[0]);
            setNotification(CalendarEvents.data.find((e) => e.date === selectedDate)?.note || "Aucun événement pour cette date");
          }}
          value={selectedDate}
          tileContent={tileContent} 
   // Ajoute la personnalisation des cases
        />
        <div>
          <table className="event-table">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Événement</th>
              </tr>
            </thead>
            <tbody>
              <RenderTableRows />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
