import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import MyCalendar from "./utils";
import { events, User } from "./data";
import { LoginForm } from "./Routes/login";
import { Store } from "react-data-stores";
import { GetEvents, tokenAuthApi } from "./api";

function App() {
  Store.navigateTo = useNavigate();
  const [userData, setUserData] = User.useStore();
  const [CalendarEvents, setCalendarEvents] = events.useStore();
  useEffect(() => {
    console.log("Checking token", userData.token);
    if (!userData.token) return Store.navigateTo("/login");
    tokenAuthApi(userData.token).then((response) => {
      if (response[0]) return Store.navigateTo("/login");
      setUserData(response.data);
      // localStorage.setItem("token", response.data.token);
      Store.navigateTo("/");
    });
  }, []);
  useEffect(() => {
    if (!userData.token) return console.log("No token");
    console.log("Getting events");
    GetEvents(userData.token).then((response) => {
      if (response[0]) return console.log("Error getting events", response[0]);
      const events = [];
      response[1].data.forEach((event) => {
        const index = events.findIndex((e) => e.id == event.id);
        if (index < 0) {
          const obj = { deadline: event.deadline, description: event.description, id: event.id };
          if (event.department_id) obj.departements = [event.department_id];
          if (event.group_id) obj.groups = [event.group_id];
          events.push(obj);
        } else {
          if (event.group_id && !events[index].groups.includes(event.group_id)) events[index].groups.push(event.group_id);
          if (event.department_id && !events[index].departements.includes(event.department_id)) events[index].departements.push(event.department_id);
        }
      });
      console.log("Events:", response[1].data);
      console.log("Events:", events);
      setCalendarEvents({ data: events });
    });
  }, [userData]);
  useEffect(() => {
    console.log(
      "CalendarEvents:",
      CalendarEvents.data.map((e) => ({ start: new Date(e.deadline.split("T")[0]), end: new Date(e.deadline.split("T")[0]), title: e.description }))
    );
  }, [CalendarEvents]);
  return (
    <Routes>
      <Route
        index
        element={
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <MyCalendar events={CalendarEvents.data.map((e) => ({ start: new Date(e.deadline.split("T")[0]), end: new Date(e.deadline.split("T")[0]), title: e.description }))} />
          </div>
        }
      />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;
