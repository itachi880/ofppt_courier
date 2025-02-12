import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { departements_group_store, User } from "./data";
import { LoginForm } from "./Routes/login";
import { Store } from "react-data-stores";
import { BASE_URL, getDepartements, getGroups, tokenAuthApi } from "./api";
import Courier from "./Routes/Courier";
import Departement from "./Routes/departement";
import NavBar from "./NavBar";
import Group from "./Routes/Group";
import Home from "./Routes/home";
import Utilisateur from "./Routes/Utilisateur";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { LoadingBar, noLoginRoutes, preventBacklink } from "./utils";
import { ReseteMDP } from "./Routes/mdpOublie";
import ResetPass from "./Routes/ResetPass";
import axios from "axios";

function App() {
  Store.navigateTo = useNavigate();
  const [userData, setUserData] = User.useStore();
  const [ipFetched, setIpFetched] = useState(false);
  const [departements_group, setDepartementsGroup] =
    departements_group_store.useStore();

  useEffect(() => {
    if (noLoginRoutes.includes(window.location.pathname)) return;

    if (!userData.token) {
      Store.navigateTo(
        "/login" +
          (!preventBacklink.includes(window.location.pathname)
            ? "?path=" + window.location.pathname
            : "")
      );
    }
  }, []);
  useEffect(() => {
    //await getting the back end ip
    axios.get("https://itachi880.github.io/public_ip/back_end").then((res) => {
      BASE_URL.link = "http://" + res.data;
      tokenAuthApi(userData.token).then((response) => {
        if (response[0])
          return Store.navigateTo(
            "/login" +
              (!preventBacklink.includes(window.location.pathname)
                ? "?path=" + window.location.pathname
                : "")
          );
        console.log(response);
        setUserData(response[1], true);

        Store.navigateTo(window.location.pathname);
      });
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
      setIpFetched(true);
    });
    if (noLoginRoutes.includes(window.location.pathname)) return;
    if (Object.keys(userData.data || {}).length > 0) return;
  }, [userData.token]);

  //! dyal simo mat9arbch liha
  const location = useLocation();

  // Animation variants (for more complex animations)
  const variants = {
    initial: { opacity: 0, y: 10, scale: 0.95 }, // Initial state
    animate: { opacity: 1, y: 0, scale: 1 }, // Final state
    exit: { opacity: 0, y: -10, scale: 0.95 }, // Exit state
  };

  return ipFetched ? (
    <>
      <div className="min-h-screen flex flex-col mb-5">
        <NavBar />
        {/* Wrap Routes with AnimatePresence */}
        <AnimatePresence mode="wait">
          {" "}
          {/* mode="wait" for smoother transitions */}
          <motion.div
            key={location.pathname}
            variants={variants} // Use animation variants
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, type: "tween" }} // Add type for smoother scaling
            className="flex-grow relative" // Added relative for absolute positioning of loading overlay (if needed)
          >
            <Routes>
              <Route index element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/resetPassword" element={<ReseteMDP />} />
              <Route path="/courrier/*" element={<Courier />} />
              <Route path="/departement/*" element={<Departement />} />
              <Route path="/group/*" element={<Group />} />
              <Route path="/utilisateur/*" element={<Utilisateur />} />
              <Route path="/new_password/*" element={<ResetPass />} />
              <Route path="*" element={<>404</>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        <footer className=" py-4 text-center mt-auto w-full fixed bottom-0 shadow-md z-auto">
          <div className="container mx-auto">
            <p className="text-sm">&copy; 2025 OFPPT. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
      <LoadingBar />
    </>
  ) : (
    <>loading</>
  );
}

export default App;
