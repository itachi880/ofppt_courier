import { Store } from "react-data-stores";
import "./index.css";
import { User, events, documentType } from "../data";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns"; // Import date-fns for relative time
export default () => {
  const [userData, setUserData] = User.useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [eventsData, setEventsData] = events.useStore();

  const [alertEvents, setAlertEvents] = useState([]);
  useEffect(() => {
    // Filter events that are within the next 48 hours
    const upcomingEvents = eventsData.data.filter(
      (event) =>
        new Date(event.deadline).getTime() <= Date.now() + 48 * 60 * 60 * 1000
    );
    setAlertEvents(upcomingEvents);
    console.log(alertEvents);
  }, [eventsData]);
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
          {userData.data.role === "admin" && (
            <div
              className={`dropdown ${
                openDropdown === "departement" ? "open" : ""
              }`}
              onMouseEnter={() => handleDropdown("departement")}
              onMouseLeave={() => handleDropdown(null)}
            >
              <button>
                <i className="fa-solid fa-building"></i>
                <span> Entité </span>
              </button>
              <div className="dropdown-content">
                <button onClick={() => Store.navigateTo("/departement")}>
                  <i className="fa-solid fa-list"></i>
                  <span>Afficher Entité</span>
                </button>
                <button onClick={() => Store.navigateTo("/departement/add")}>
                  <i className="fa-solid fa-plus"></i>
                  <span>Ajouter Entité</span>
                </button>
              </div>
            </div>
          )}

          {/* Groupes Dropdown */}
          {userData.data.role === "admin" && (
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
          )}

          {/* Courriers Dropdown (Admin can add, all can view) */}
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
              {userData.data.role === "admin" && (
                <button onClick={() => Store.navigateTo("/courrier/add")}>
                  <i className="fa-solid fa-plus"></i>
                  <span>Ajouter Courrier</span>
                </button>
              )}
            </div>
          </div>
          {/* i5tra3 dyal */}
          <div
            className={`dropdown ${openDropdown === "events" ? "open" : ""}`}
            onMouseEnter={() => handleDropdown("events")}
            onMouseLeave={() => handleDropdown(null)}
          >
            <button>
              <i className="fa-solid fa-envelope"></i>
              <span>Events</span>
            </button>
            <div className="dropdown-content">
              <button onClick={() => Store.navigateTo("/courrier?event=true")}>
                <i className="fa-solid fa-list"></i>
                <span>Afficher events</span>
              </button>
              <button
                onClick={() =>
                  Store.navigateTo(
                    "/courrier/add?" + documentType.event + "=true"
                  )
                }
              >
                <i className="fa-solid fa-plus"></i>
                <span>Ajouter events</span>
              </button>
            </div>
          </div>

          {userData.data.role === "admin" && (
            <div
              className={`dropdown ${
                openDropdown === "utilisateur" ? "open" : ""
              }`}
              onMouseEnter={() => handleDropdown("utilisateur")}
              onMouseLeave={() => handleDropdown(null)}
            >
              <button>
                <i className="fa-solid fa-user"></i>
                <span>Utilisateurs</span>
              </button>
              <div className="dropdown-content">
                <button
                  onClick={() => Store.navigateTo("/utilisateur/afficheUsers")}
                >
                  <i className="fa-solid fa-list"></i>
                  <span>Afficher Utilisateurs</span>
                </button>
                <button onClick={() => Store.navigateTo("/utilisateur/add")}>
                  <i className="fa-solid fa-plus"></i>
                  <span>Ajouter Utilisateur</span>
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Notifications Dropdown */}
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => handleDropdown("notifications")}
              className="relative p-2"
            >
              <i className="fa-solid fa-bell text-xl text-white"></i>
              {alertEvents.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {alertEvents.filter((alert) => alert.is_courier == 1).length}
                  {/* Show only the count */}
                </span>
              )}
            </button>

            {openDropdown === "notifications" && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                {" "}
                {/* Increased width, added overflow-hidden */}
                <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                  {" "}
                  {/* Added header styling */}
                  Notifications
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  {alertEvents.length > 0 ? (
                    alertEvents.map((event) => (
                      <li
                        key={event.id}
                        className="p-3 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer" // Added hover effect, removed last border
                        onClick={() => {
                          // Handle notification click (e.g., navigate to event details)
                          Store.navigateTo(`/courrier/detail/${event.id}`); // Example navigation
                          setOpenDropdown(null); // Close the dropdown
                        }}
                      >
                        <div className="flex items-start">
                          {" "}
                          {/* Use flexbox for layout */}
                          <div className="flex-shrink-0 mr-2">
                            {" "}
                            {/* Icon container */}
                            <i className="fa-solid fa-exclamation-triangle text-yellow-500"></i>{" "}
                            {/* Example icon */}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {event.title}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {formatDistanceToNow(new Date(event.deadline), {
                                addSuffix: true,
                              })}{" "}
                              {/* Relative time */}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-center text-gray-500">
                      Pas d&apos; notifications
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Logout Section (Right) */}
          <div className="logout">
            <button>
              <span
                className="logout text-2xl m-0"
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
