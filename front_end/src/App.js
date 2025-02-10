import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import Utilisateur from "./Routes/Utilisateur";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { LoadingBar } from "./utils";

function App() {
  Store.navigateTo = useNavigate();
  const [userData, setUserData] = User.useStore();
  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener("resize", (e) => {
    setWidth(window.innerWidth);
  });

  const [departements_group, setDepartementsGroup] =
    departements_group_store.useStore();

  useEffect(() => {
    if (!userData.token) return Store.navigateTo("/login");
    if (Object.keys(userData.data).length > 0) return;
    tokenAuthApi(userData.token).then((response) => {
      if (response[0]) return Store.navigateTo("/login");
      setUserData(response[1], true);
      Store.navigateTo("/");
    });
  }, [userData.token]);

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
  //! dyal simo mat9arbch liha
  const location = useLocation();

  // Animation variants (for more complex animations)
  const variants = {
    initial: { opacity: 0, y: 10, scale: 0.95 }, // Initial state
    animate: { opacity: 1, y: 0, scale: 1 }, // Final state
    exit: { opacity: 0, y: -10, scale: 0.95 }, // Exit state
  };

  // if (width < 1000)
  //   return (
  //     <p className="text-center text-2xl mt-20 text-red-600">
  //       you don't have acces in your mobil phone!! 🧐
  //     </p>
  //   );

  return (
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
              <Route path="/courrier/*" element={<Courier />} />
              <Route path="/departement/*" element={<Departement />} />
              <Route path="/group/*" element={<Group />} />
              <Route path="/utilisateur/*" element={<Utilisateur />} />
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
  );
}

export default App;
