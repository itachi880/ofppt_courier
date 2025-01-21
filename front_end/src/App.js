import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { departements_group_store, User } from "./data";
import { LoginForm } from "./Routes/login";
import { Store } from "react-data-stores";
import { getDepartements, getGroups, tokenAuthApi } from "./api";
import Courier from "./Routes/Courier";
import Departement from "./Routes/departement";
import NavBar from "./NavBar";
import Group from "./Routes/Group";
import Home from "./Routes/home";
import Footer from "./Footer/Footer";

function App() {
  Store.navigateTo = useNavigate();
  const [userData, setUserData] = User.useStore();
  const [departements_group, setDepartementsGroup] =
    departements_group_store.useStore();
  useEffect(() => {
    if (!userData.token)
      return Store.navigateTo(
        "/login" + "?redirect=" + window.location.pathname
      );
    if (Object.keys(userData.data).length > 0) return;
    tokenAuthApi(userData.token).then((response) => {
      if (response[0])
        return Store.navigateTo(
          "/login" + "?redirect=" + window.location.pathname
        );
      setUserData(response[1], true);
      Store.navigateTo("/");
    });
  }, [userData.token]);

  useEffect(() => {
    console.log(departements_group);
  }, [departements_group]);
  useEffect(() => {
    if (!userData.token) return;
    getDepartements(userData.token).then(async (departements_res) => {
      if (departements_res[0])
        return console.log("Error getting departements", departements_res[0]);
      await getGroups(userData.token).then((groups_res) => {
        if (groups_res[0])
          return console.log("Error getting groups", groups_res[0]);

        setDepartementsGroup({
          departements: departements_res[1],
          groups: groups_res[1],
        });
      });
    });
  }, [userData.token]);
  return (
    <>
      <NavBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/courrier/*" element={<Courier />} />
        <Route path="/departement/*" element={<Departement />} />
        <Route path="/group/*" element={<Group />} />
        <Route path="*" element={<>404</>} />
      </Routes>
      <footer className="bg-gray-800 text-white py-4 text-center fixed bottom-0 w-full z-50">
        <p>&copy; 2025 OFPPT. Tous droits réservés.</p>
      </footer>
    </>
  );
}

export default App;
