import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
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
      components={{
        agenda: {
          event: ({ event }) => (
            <div style={{ backgroundColor: "lightblue", padding: "10px", borderRadius: "5px" }}>
              <strong>{event.title}</strong>
              <p>{event.start.toLocaleString()}</p>
            </div>
          ),
          time: () => null,
        },
      }}
      messages={{ time: "" }}
      defaultView="month"
      eventPropGetter={(event) => {
        return { style: event.style || {} };
      }}
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "500px" }}
      views={{ day: false, agenda: true, month: true, week: true }}
      doShowMoreDrillDown={true}
    />
  );
}
