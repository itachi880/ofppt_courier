import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { events } from "../data";

export function MyCalendar() {
  const [CalenderEvents, setCalenderEvents] = events.useStore(); // Récupère les données depuis votre store
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notification, setNotification] = useState("");

  //hasEvent() vérifie si un événement est présent pour une date donnée
  const hasEvent = (date) => {
    return CalenderEvents.data.some((e) => e.date === date.toISOString().split("T")[0]);
  };

  // Génération des lignes du tableau en fonction des événements
  const RenderTableRows = () => {
    if (!selectedDate) return null; // Pas de date sélectionnée
    const event = CalenderEvents.data.find((e) => e.date === selectedDate.toISOString().split("T")[0]);
    if (event) {
      return (
        <tr>
          <td style={{ border: "1px solid black", padding: "10px", fontWeight: "bold", height: " fit-content" }}>{event.date}</td>
          <td style={{ border: "1px solid black", padding: "10px", fontWeight: "bold", height: " fit-content" }}>{event.note}</td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td style={{ border: "1px solid black", padding: "10px", fontWeight: "bold" }}>{selectedDate.toISOString().split("T")[0]}</td>
          <td style={{ border: "1px solid black", padding: "10px", fontWeight: "bold" }}>Aucun événement pour cette date</td>
        </tr>
      );
    }
  };

  return (
    <>
      <h1>Mon Calendrier</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "60px", flexWrap: "wrap" }}>
        <Calendar
          onChange={(date) => {
            setSelectedDate(date);
            setNotification(CalenderEvents.data.find((e) => e.date == date.toISOString().split("T")[0])?.note || "Aucun événement pour cette date");
          }}
          value={selectedDate}
          tileContent={({ date, view }) => {
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
          }} // Ajoute la personnalisation des cases
        />
        <div>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              fontSize: "16px",
              textAlign: "left",
            }}
          >
            <thead style={{ backgroundColor: "#f4f4f4" }}>
              <tr>
                <th style={{ border: "1px solid black", padding: "10px" }}>Date</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Événement</th>
              </tr>
            </thead>
            <tbody
              style={{
                height: "100%",
              }}
            >
              <RenderTableRows />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
