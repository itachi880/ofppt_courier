import { useEffect } from "react";
import { events, User } from "../../../data";
import { GetEvents } from "../../../api";
import { Calendar } from "../../../utils";

export default () => {
  const [CalendarEvents, setCalendarEvents] = events.useStore();
  const [userData, setUserData] = User.useStore();

  useEffect(() => {
    if (!userData.token) return;
    GetEvents(userData.token).then((response) => {
      if (response[0]) return console.log("Error getting events", response[0]);
      const events = [];
      console.log(response);
      setCalendarEvents({ data: response[1].data });
    });
  }, []);
  useEffect(() => {
    console.log(CalendarEvents);
  }, [CalendarEvents]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Calendar
        events={CalendarEvents.data.map((e) => ({
          id: e.id,
          start: new Date(e.deadline.split("T")[0]),
          end: new Date(e.deadline.split("T")[0]),
          title: e.titel,
          backgroundColor: "red",
          description: e.description,
        }))}
      />
    </div>
  );
};
