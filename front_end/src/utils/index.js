import "react-calendar/dist/Calendar.css";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
// import "./calender.css";
const localizer = momentLocalizer(moment);

export function Calendar({
  events = [
    {
      title: "Sample Event",
      start: new Date(2024, 11, 22, 10, 0), // Début le 22 décembre à 10h00
      end: new Date(2024, 11, 29, 12, 0), // Fin le 29 décembre à 12h00
    },
  ],
}) {
  return (
    <BigCalendar
      defaultView="month"
      eventPropGetter={(event) => {
        return { style: event.style || {} };
      }}
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "500px" }}
      // views={{ day: false }}
    />
  );
}
