import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { departements_group_store, loading, User } from "./data";
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
import { LoadingBar, noLoginRoutes, preventBacklink, USE_DEV } from "./utils";
import { ReseteMDP } from "./Routes/mdpOublie";
import ResetPass from "./Routes/ResetPass";
import axios from "axios";

function App() {
  Store.navigateTo = useNavigate();
  const [userData, setUserData] = User.useStore();
  const [isDataFetched, setDataFetched] = useState(false);
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  const [departements_group, setDepartementsGroup] =
    departements_group_store.useStore();

  //!
  const fetchData = async () => {
    setLoadingFlag({ loading: true });
    if (window.location.pathname == "/login") {
      setLoadingFlag({ loading: false });
      localStorage.clear();
      return;
    }
    const token = localStorage.getItem("token");
    //if token present init the data if not go to login thene fetch
    const tokenRes = await tokenAuthApi(userData.token || token);
    if (tokenRes[0]) {
      localStorage.clear();
      setDataFetched(true);
      setLoadingFlag({ loading: false });
      setUserData({ token: undefined, data: undefined });
      Store.navigateTo(
        "/login" +
          (!preventBacklink.includes(window.location.pathname)
            ? "?path=" + window.location.pathname
            : "")
      );
      return;
    }
    console.log("user set", tokenRes);
    setUserData({
      data: { ...tokenRes[1].data },
      token: tokenRes[1].token,
    });
    const departementsRes = await getDepartements(tokenRes[1].token);
    if (departementsRes[0]) {
      setLoadingFlag({ loading: false });
      setDataFetched(true);
      return console.log("Error getting departements", departementsRes[0]);
    }
    const groupsRes = await getGroups(tokenRes[1].token);
    if (groupsRes[0]) {
      setLoadingFlag({ loading: false });
      setDataFetched(true);
      return console.log("Error getting groups", groupsRes[0]);
    }
    setDepartementsGroup({
      departements: departementsRes[1],
      groups: groupsRes[1],
    });
    setLoadingFlag({ loading: false });
    setDataFetched(true);
  };
  useEffect(() => {
    if (noLoginRoutes.includes(window.location.pathname)) return;

    if (!localStorage.getItem("token")) {
      setDataFetched(true);
      Store.navigateTo(
        "/login" +
          (!preventBacklink.includes(window.location.pathname)
            ? "?path=" + window.location.pathname
            : "")
      );
      return;
    }
    setUserData({ token: localStorage.getItem("token") });
  }, []);
  useEffect(() => {
    if (userData.token && Object.keys(userData.data || {}).length > 0) return;
    //!=> for dev purposes
    if (!USE_DEV) {
      axios
        .get("https://itachi880.github.io/public_ip/back_end")
        .then((res) => {
          BASE_URL.link = "http://" + res.data;
        })
        .catch(() => {
          BASE_URL.link = "http://localhost:4000";
        })
        .finally(fetchData);
    } else {
      BASE_URL.link = "http://localhost:4000";
      fetchData();
    }
    if (noLoginRoutes.includes(window.location.pathname)) return;
  }, [userData]);
  useEffect(() => {
    console.log(departements_group);
  }, [departements_group]);

  //! dyal simo mat9arbch liha
  const location = useLocation();

  // Animation variants (for more complex animations)
  const variants = {
    initial: { opacity: 0, y: 10, scale: 0.95 }, // Initial state
    animate: { opacity: 1, y: 0, scale: 1 }, // Final state
    exit: { opacity: 0, y: -10, scale: 0.95 }, // Exit state
  };

  return isDataFetched ? (
    <>
      <div className="min-h-screen flex flex-col mb-5">
        <NavBar />

        {/* Wrap Routes with AnimatePresence */}
        <AnimatePresence mode="wait">
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
        <footer
          className="bg-slate-700 text-white py-4 text-center mt-auto w-full fixed bottom-0 shadow-md "
          style={{ zIndex: "1000000" }}
        >
          <div className="container mx-auto">
            <p className="text-sm">&copy; 2025 OFPPT. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
      <LoadingBar />
    </>
  ) : (
    <LoadingBar state={true} />
  );
}

export default App;
