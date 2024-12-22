import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

export default function BigCalendarComponent({
  events = [
    {
      title: "Sample Event",
      start: new Date(2024, 11, 22, 10, 0), // Début le 22 décembre à 10h00
      end: new Date(2024, 11, 29, 12, 0), // Fin le 29 décembre à 12h00
    },
  ],
}) {
  return <BigCalendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: "500px" }} />;
}
