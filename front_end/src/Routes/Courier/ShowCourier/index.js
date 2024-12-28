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
      response[1].data.forEach((event) => {
        const index = events.findIndex((e) => e.id == event.id);
        if (index < 0) {
          const obj = { id: event.id, deadline: event.deadline, title: event.titel, description: event.description, id: event.id, departements: [], groups: [] };

          if (event.department_id) obj.departements.push(event.department_id);
          if (event.group_id) obj.groups.push(event.group_id);
          events.push(obj);
        } else {
          console.log(events[index]);
          if (event.group_id && !events[index].groups.includes(event.group_id)) events[index].groups.push(event.group_id);
          if (event.department_id && !events[index].departements.includes(event.department_id)) events[index].departements.push(event.department_id);
        }
      });

      setCalendarEvents({ data: events });
    });
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Calendar events={CalendarEvents.data.map((e) => ({ id: e.id, start: new Date(e.deadline.split("T")[0]), end: new Date(e.deadline.split("T")[0]), title: e.title, backgroundColor: "red", description: e.description }))} />
    </div>
  );
};
