import { Store } from "react-data-stores";
import "./index.css";
import { User, events } from "../data";
import { useEffect, useState } from "react";

export default () => {
  const [userData, setUserData] = User.useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [eventsData, setEventsData] = events.useStore();
  const [alertEvents, setAlertEvents] = useState([

  ]); // ⚠️ Replace with real API data

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  if (!userData.token || Object.keys(userData.data).length === 0) return null;

  const handleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="navbar-holder">
      <nav className="navbar">
        {/* Profile Section (Left) */}
        <div className="profile">
          <img
            src="https://seeklogo.com/images/O/ofppt-logo-B2CAD4E136-seeklogo.com.png"
            alt="profile"
          />
          <span className="name text-white">
            {userData.data.first_name + " " + userData.data.last_name}
          </span>
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <div
          className="mobile-menu-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className="fa-solid fa-bars"></i>
        </div>

        {/* Menu Items (Center) */}
        <div className={`options ${isMenuOpen ? "open" : ""}`}>
          <button onClick={() => Store.navigateTo("/")}>
            <i className="fa-solid fa-calendar-day"></i>
            <span>Accueil</span>
          </button>

          {/* Départements Dropdown */}
          <div
            className={`dropdown ${
              openDropdown === "departement" ? "open" : ""
            }`}
            onMouseEnter={() => handleDropdown("departement")}
            onMouseLeave={() => handleDropdown(null)}
          >
            <button>
              <i className="fa-solid fa-building"></i>
              <span>Départements</span>
            </button>
            <div className="dropdown-content">
              <button onClick={() => Store.navigateTo("/departement")}>
                <i className="fa-solid fa-list"></i>
                <span>Afficher Départements</span>
              </button>
              <button onClick={() => Store.navigateTo("/departement/add")}>
                <i className="fa-solid fa-plus"></i>
                <span>Ajouter Département</span>
              </button>
            </div>
          </div>

          {/* Groupes Dropdown */}
          <div
            className={`dropdown ${openDropdown === "group" ? "open" : ""}`}
            onMouseEnter={() => handleDropdown("group")}
            onMouseLeave={() => handleDropdown(null)}
          >
            <button>
              <i className="fa-solid fa-users"></i>
              <span>Groupes</span>
            </button>
            <div className="dropdown-content">
              <button onClick={() => Store.navigateTo("/Group")}>
                <i className="fa-solid fa-list"></i>
                <span>Afficher Groupes</span>
              </button>
              <button onClick={() => Store.navigateTo("/Group/add")}>
                <i className="fa-solid fa-plus"></i>
                <span>Ajouter Groupe</span>
              </button>
            </div>
          </div>

          {/* Courriers Dropdown */}
          <div
            className={`dropdown ${openDropdown === "courrier" ? "open" : ""}`}
            onMouseEnter={() => handleDropdown("courrier")}
            onMouseLeave={() => handleDropdown(null)}
          >
            <button>
              <i className="fa-solid fa-envelope"></i>
              <span>Courriers</span>
            </button>
            <div className="dropdown-content">
              <button onClick={() => Store.navigateTo("/courrier")}>
                <i className="fa-solid fa-list"></i>
                <span>Afficher Courriers</span>
              </button>
              <button onClick={() => Store.navigateTo("/courrier/add")}>
                <i className="fa-solid fa-plus"></i>
                <span>Ajouter Courrier</span>
              </button>
            </div>
          </div>

          {/* Utilisateur Dropdown */}
          <div
            className={`dropdown ${
              openDropdown === "utilisateur" ? "open" : ""
            }`}
            onMouseEnter={() => handleDropdown("utilisateur")}
            onMouseLeave={() => handleDropdown(null)}
          >
            <button>
              <i className="fa-solid fa-user"></i>
              <span>Utilisateur</span>
            </button>
            <div className="dropdown-content">
              <button onClick={() => Store.navigateTo("/utilisateur/afficheUsers")}>
                <i className="fa-solid fa-list"></i>
                <span>Afficher Utilisateurs</span>
              </button>
              <button onClick={() => Store.navigateTo("/utilisateur/add")}>
                <i className="fa-solid fa-plus"></i>
                <span>Ajouter Utilisateur</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="flex">
          <div className="relative">
            <button
              onClick={() => handleDropdown("notifications")}
              className="relative p-2"
            >
              <i className="fa-solid fa-bell text-xl text-white"></i>
              {alertEvents.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {
                    eventsData.data.filter((event) => {
                      if (
                        new Date(event.deadline).getTime() <=
                        Date.now() + 48 * 60 * 60 * 1000
                      )
                        return true;
                      return false;
                    }).length
                  }
                </span>
              )}
            </button>

            {openDropdown === "notifications" && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 shadow-lg rounded-lg">
                <div className="p-4 font-bold border-b">Notifications</div>
                <ul className="max-h-60 overflow-y-auto">
                  {alertEvents.length > 0 ? (
                    alertEvents.map((event) => (
                      <li
                        key={event.id}
                        className="p-3 hover:bg-gray-100 border-b"
                      >
                        <span className="font-semibold">{event.title}</span> -{" "}
                        {event.deadline}
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-gray-500">Aucune notification</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Logout Section (Right) */}
          <div className="logout">
            <button>
              <span
                className="logout text-2xl"
                onClick={() => {
                  setUserData({ token: undefined });
                  localStorage.removeItem("token");
                  Store.navigateTo("/login");
                }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
