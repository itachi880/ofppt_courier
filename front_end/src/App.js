import { use, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import "./App.css";
import { Calendar } from "./utils";
import { departements_group_store, events, User } from "./data";
import { LoginForm } from "./Routes/login";
import { Store } from "react-data-stores";
import { getDepartements, GetEvents, getGroups, tokenAuthApi } from "./api";
import Courier from "./Routes/Courier";

function App() {
  Store.navigateTo = useNavigate();
  const [userData, setUserData] = User.useStore();
  const [CalendarEvents, setCalendarEvents] = events.useStore();
  const [departements_group, setDepartementsGroup] = departements_group_store.useStore();
  useEffect(() => {
    if (!userData.token) return Store.navigateTo("/login");
    tokenAuthApi(userData.token).then((response) => {
      if (response[0]) return Store.navigateTo("/login");
      setUserData(response.data);
      Store.navigateTo("/");
    });
  }, []);

  useEffect(() => {
    console.log(departements_group);
  }, [departements_group]);
  useEffect(() => {
    if (!userData.token) return;
    getDepartements(userData.token).then(async (departements_res) => {
      if (departements_res[0]) return console.log("Error getting departements", departements_res[0]);
      await getGroups(userData.token).then((groups_res) => {
        if (groups_res[0]) return console.log("Error getting groups", groups_res[0]);

        setDepartementsGroup({
          departements: departements_res[1].map((dep) => ({
            ...dep,
            groups: groups_res[1].filter((group) => group.departement_id == dep.id),
          })),
          groups: groups_res[1],
        });
      });
    });
    GetEvents(userData.token).then((response) => {
      if (response[0]) return console.log("Error getting events", response[0]);
      const events = [];
      response[1].data.forEach((event) => {
        const index = events.findIndex((e) => e.id == event.id);
        if (index < 0) {
          const obj = { deadline: event.deadline, description: event.description, id: event.id, departements: [], groups: [] };

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
  }, [userData.token]);
  return (
    <Routes>
      <Route
        index
        element={
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Calendar events={CalendarEvents.data.map((e) => ({ start: new Date(e.deadline.split("T")[0]), end: new Date(e.deadline.split("T")[0]), title: e.description, style: { backgroundColor: "red" } }))} />
            <button onClick={() => Store.navigateTo("/courrier")}>courier</button>
          </div>
        }
      />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/courrier/*" element={<Courier />} />
    </Routes>
  );
}

export default App;
