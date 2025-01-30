import { useEffect } from "react";
import { events, User } from "../../../data";
import { GetEvents } from "../../../api";
import { Calendar } from "../../../utils";
import "./index.css";
export default () => {
  const [CalendarEvents, setCalendarEvents] = events.useStore();
  const [userData, setUserData] = User.useStore();
  return (
    <div
      className="show-courier"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <form
        autoFocus
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="search-bar"
      >
        <input
          type="search"
          placeholder="Search"
          aria-label="Search input"
          required
        />
        <i className="fa fa-search"></i>
        <button type="submit">Search</button>
      </form>

      <Calendar
        events={CalendarEvents.data.map((e) => ({
          id: e.id,
          start: new Date(e.deadline.split("T")[0]),
          end: new Date(e.deadline.split("T")[0]),
          title: e.title,
          backgroundColor: "red",
          description: e.description,
        }))}
      />
    </div>
  );
};
