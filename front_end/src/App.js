import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { departements_group_store, User } from "./data";
import { LoginForm } from "./Routes/login";
import { Store } from "react-data-stores";
import { getDepartements, getGroups, tokenAuthApi } from "./api";
import Courier from "./Routes/Courier";
import NavBar from "./NavBar";

function App() {
  Store.navigateTo = useNavigate();
  const [userData, setUserData] = User.useStore();
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
  }, [userData.token]);
  return (
    <>
      <NavBar />
      <Routes>
        <Route index element={<>index</>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/courrier/*" element={<Courier />} />
        <Route path="*" element={<>404</>} />
      </Routes>
    </>
  );
}

export default App;
