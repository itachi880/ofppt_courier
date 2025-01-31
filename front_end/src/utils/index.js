import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Store } from "react-data-stores";
const localizer = momentLocalizer(moment);
const CustomNextButton = ({ onClick }) => {
  return (
    <button className="custom-button next-button" onClick={onClick}>
      Next <span>&#10095;</span>
    </button>
  );
};

const CustomBackButton = ({ onClick }) => {
  return (
    <button className="custom-button back-button" onClick={onClick}>
      <span>&#10094;</span> Back
    </button>
  );
};

const CustomTodayButton = ({ onClick }) => {
  return (
    <button className="custom-button today-button" onClick={onClick}>
      Today
    </button>
  );
};

const ViewToggleButton = ({ onClick, view, text }) => {
  return (
    <button
      style={{
        textTransform: "capitalize",
      }}
      className={`custom-button ${view === text ? "active" : ""}`}
      onClick={() => onClick(text)}
    >
      {text}
    </button>
  );
};

const CustomToolbar = ({ onNavigate, label, onView, view }) => {
  console.log({ onNavigate, label, onView, view });
  return (
    <div className="custom-toolbar">
      <div className="navigation-buttons">
        <CustomBackButton onClick={() => onNavigate("PREV")} />
        <CustomTodayButton onClick={() => onNavigate("TODAY")} />
        <CustomNextButton onClick={() => onNavigate("NEXT")} />
      </div>

      <div className="date-indicator">
        <span>{label}</span>
      </div>

      <div className="view-toggle-buttons">
        <ViewToggleButton onClick={onView} view={view} text="month" />
        <ViewToggleButton onClick={onView} view={view} text="agenda" />
      </div>
    </div>
  );
};
const CustomAgenda = ({ events }) => {
  return (
    <div className="custom-agenda">
      {events.length > 0 ? (
        events.map((event, index) => (
          <div key={index} className="custom-agenda-item">
            <div className="agenda-time">
              {moment(event.start).format("hh:mm A")}
            </div>
            <div className="agenda-event">{event.title}</div>
            <div className="agenda-description">
              {event.description || "No description"}
            </div>
          </div>
        ))
      ) : (
        <div className="no-events">No events for today</div>
      )}
    </div>
  );
};

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
        agenda: CustomAgenda, // Custom agenda component

        month: {
          event: ({ event }) => (
            <div
              className="event-month"
              onClick={() => {
                Store.navigateTo("/courrier/update/" + event.id);
              }}
            >
              <span>{event.title}</span>
            </div>
          ),
        },
        toolbar: CustomToolbar,
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
export const AppFirstLancheJobs = ({ user, events }) => {};
export const roles = {
  admin: "admin",
  user: "user",
};
