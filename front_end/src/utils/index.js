import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Store } from "react-data-stores";
const localizer = momentLocalizer(moment);

export function Calendar({
  events = [
    {
      id: 0,
      title: "Sample Event",
      start: new Date(2024, 11, 22, 10, 0), // Début le 22 décembre à 10h00
      end: new Date(2024, 11, 29, 12, 0), // Fin le 29 décembre à 12h00
      backgroundColor: "lightgreen",
    },
  ],
}) {
  return (
    <BigCalendar
      components={{
        agenda: {
          event: ({ event }) => (
            <div
              onClick={() => Store.navigateTo(`/courrier/update/${event.id}`)}
            >
              <h4 style={{ margin: "0" }}>{event.title}</h4>
              <p style={{ margin: "0" }}>{event.description}</p>
            </div>
          ),
          time: () => null,
        },

        month: {
          event: ({ event }) => (
            <div
              style={{
                backgroundColor: event.backgroundColor,
                borderRadius: "5px",
                margin: "2px 0",
              }}
              onClick={() => {
                Store.navigateTo("/courrier/update/" + event.id);
              }}
            >
              <strong>{event.title}</strong>
            </div>
          ),
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
      style={{ height: "500px", aspectRatio: 1 }}
      views={{ day: false, agenda: true, month: true, week: false }}
      doShowMoreDrillDown={true}
    />
  );
}
export const GreenBox = ({ children, onClick = () => {} }) => (
  <span
    onClick={onClick}
    style={{
      padding: "5px 10px",
      background: "rgba(130, 255, 213, 0.48)",
      color: "rgb(0, 255, 170)",
      borderRadius: "5px",
      margin: "0 5px",
    }}
  >
    {children}
  </span>
);
export const RedBox = ({ children, onClick = () => {} }) => (
  <span
    onClick={onClick}
    style={{
      padding: "5px 10px",
      background: "rgba(255, 156, 156, 0.48)",
      color: "red",
      borderRadius: "5px",
      margin: "0 5px",
    }}
  >
    {children}
  </span>
);
export const ImgsWithCancelIcon = ({
  imgClick = (e) => {},
  Xclick = (e) => {},
  imgStyle = { width: 50, height: 50, cursor: "pointer" },
  containerClick = (e) => {},
  src = "",
}) => {
  return (
    <div
      onClick={containerClick}
      style={{
        position: "relative",
        width: imgStyle.width,
      }}
    >
      <img src={src} onClick={imgClick} style={imgStyle} />
      <i
        className="fa-solid fa-ban"
        onClick={Xclick}
        style={{
          position: "absolute",
          top: "5px",
          left: imgStyle.width - 20,
          color: "red",
          cursor: "pointer",
        }}
      ></i>
    </div>
  );
};
