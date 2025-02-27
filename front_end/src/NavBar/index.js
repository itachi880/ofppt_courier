import { Store } from "react-data-stores";
import "./index.css";
import { User, events, documentType } from "../data";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns"; // Import date-fns for relative time
import { roles } from "../utils";
export default () => {
  const [userData, setUserData] = User.useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [renderSudoActions, setRenderSudoActions] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [eventsData, setEventsData] = events.useStore();
  const [activeNavElement, setActiveNavElement] = useState("");
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [alertEvents, setAlertEvents] = useState([]);
  useEffect(() => {
    // Filter events that are within the next 48 hours
    const upcomingEvents = eventsData.data.filter((event) => {
      const date = new Date(event.deadline).getTime();
      if (date <= Date.now() + 48 * 60 * 60 * 1000 && date >= Date.now()) {
        return true;
      }
    });
    setAlertEvents(upcomingEvents);
  }, [eventsData]);

  const handleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    setIsSettingOpen(false);
  };
  useEffect(() => {
    if (userData.token && Object.keys(userData.data || {}).length > 0) {
      setRenderSudoActions(
        !(
          userData.data.role != roles.admin ||
          (userData.data.role == roles.admin &&
            (userData.data.departement_id || userData.data.group_id))
        )
      );
    }
  }, [userData]);
  return !userData.token || Object.keys(userData.data || {}).length == 0 ? (
    <></>
  ) : (
    <div className="navbar-holder shadow-2xl ">
      <nav className="navbar">
        {/* Profile Section (Left) */}
        <div className="profile">
          <img
            src="https://seeklogo.com/images/O/ofppt-logo-B2CAD4E136-seeklogo.com.png"
            alt="profile"
          />
        </div>

        {/* Hamburger Menu Icon for Mobile */}

        {/* Menu Items (Center) */}
        <div className={`options ${isMenuOpen ? "open" : ""}`}>
          <button
            title="Accueil"
            className={
              activeNavElement == "Accueil" ? "active-nav-element" : ""
            }
            onClick={() => {
              Store.navigateTo("/");
              setActiveNavElement("Accueil");
            }}
          >
            <i className="fa-solid fa-calendar-day"></i>
          </button>

          {/* Départements Dropdown */}
          {renderSudoActions && (
            <div
              className={`dropdown ${
                openDropdown === "departement" ? "open" : ""
              }`}
              onMouseEnter={() => handleDropdown("departement")}
              onMouseLeave={() => handleDropdown(null)}
            >
              <button
                title="Entite"
                className={
                  activeNavElement == "Entite" ? "active-nav-element" : ""
                }
              >
                <i className="fa-solid fa-building"></i>
              </button>
              <div className="dropdown-content">
                <button
                  onClick={() => {
                    Store.navigateTo("/departement");
                    setActiveNavElement("Entite");
                  }}
                >
                  <i className="fa-solid fa-list"></i>
                  <span>Afficher Entité</span>
                </button>

                <button
                  onClick={() => {
                    Store.navigateTo("/departement/add");
                    setActiveNavElement("Entite");
                  }}
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Ajouter Entité</span>
                </button>
              </div>
            </div>
          )}

          {/* Groupes Dropdown */}
          {renderSudoActions && (
            <div
              className={`dropdown ${openDropdown === "group" ? "open" : ""}`}
              onMouseEnter={() => handleDropdown("group")}
              onMouseLeave={() => handleDropdown(null)}
            >
              <button
                title="Groupes"
                className={
                  activeNavElement == "Groupes" ? "active-nav-element" : ""
                }
              >
                <i className="fa-solid fa-users"></i>
              </button>
              <div className="dropdown-content">
                <button
                  onClick={() => {
                    Store.navigateTo("/Group");
                    setActiveNavElement("Groupes");
                  }}
                >
                  <i className="fa-solid fa-list"></i>
                  <span>Afficher Groupes</span>
                </button>

                <button
                  onClick={() => {
                    Store.navigateTo("/Group/add");
                    setActiveNavElement("Groupes");
                  }}
                >
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
            <button
              title="Courriers"
              className={
                activeNavElement == "Courriers" ? "active-nav-element" : ""
              }
            >
              <i className="fa-solid fa-envelope"></i>
            </button>
            <div className="dropdown-content">
              <button
                onClick={() => {
                  Store.navigateTo("/courrier");
                  setActiveNavElement("Courriers");
                }}
              >
                <i className="fa-solid fa-list"></i>
                <span>Afficher Courriers</span>
              </button>
              {renderSudoActions && (
                <button
                  onClick={() => {
                    Store.navigateTo("/courrier/add");
                    setActiveNavElement("Courriers");
                  }}
                >
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
            <button
              title="Events"
              className={
                activeNavElement == "Events" ? "active-nav-element" : ""
              }
            >
              <i className="fa-regular fa-calendar"></i>
            </button>
            <div className="dropdown-content">
              <button
                onClick={() => {
                  Store.navigateTo("/courrier?event=true");
                  setActiveNavElement("Events");
                }}
              >
                <i className="fa-solid fa-list"></i>
                <span>Afficher events</span>
              </button>
              {renderSudoActions && (
                <button
                  onClick={() => {
                    Store.navigateTo(
                      "/courrier/add?" + documentType.event + "=true"
                    );
                    setActiveNavElement("Events");
                  }}
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Ajouter events</span>
                </button>
              )}
            </div>
          </div>

          {renderSudoActions && (
            <div
              className={`dropdown ${
                openDropdown === "utilisateur" ? "open" : ""
              }`}
              onMouseEnter={() => handleDropdown("utilisateur")}
              onMouseLeave={() => handleDropdown(null)}
            >
              <button
                title="Utilisateurs"
                className={
                  activeNavElement == "Utilisateurs" ? "active-nav-element" : ""
                }
              >
                <i className="fa-solid fa-user"></i>
              </button>
              <div className="dropdown-content">
                <button
                  onClick={() => {
                    Store.navigateTo("/utilisateur/afficheUsers");
                    setActiveNavElement("Utilisateurs");
                  }}
                >
                  <i className="fa-solid fa-list"></i>
                  <span>Afficher Utilisateurs</span>
                </button>
                {renderSudoActions && (
                  <button
                    onClick={() => {
                      Store.navigateTo("/utilisateur/add");
                      setActiveNavElement("Utilisateurs");
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>Ajouter Utilisateur</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="dropdown">
            {renderSudoActions && (
              <button
                title="Archive"
                className={
                  activeNavElement == "Archive" ? "active-nav-element" : ""
                }
                onClick={() => {
                  Store.navigateTo("/courrier/archive");
                  setActiveNavElement("Archive");
                }}
              >
                <i className="fa-solid fa-archive"></i>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="flex gap-3 relative">
          <div
            className="mobile-menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </div>
          <div className="relative">
            <button
              onClick={() => handleDropdown("notifications")}
              className="relative p-2"
            >
              <i className="fa-solid fa-bell text-xl text-black"></i>
              {alertEvents.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {alertEvents.filter((alert) => alert.is_courier == 1).length}
                </span>
              )}
            </button>

            {openDropdown === "notifications" && (
              <div className="absolute right-0 mt-2  w-64 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                  {" "}
                  {/* Added header styling */}
                  Notifications
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  {alertEvents.length > 0 ? (
                    alertEvents.map((event) => {
                      if (event.is_courier == 0) return null;
                      return (
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
                            <div className="flex-shrink-0 ">
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
                      );
                    })
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

          <div
            className={"profile" + (isSettingOpen ? " active" : "")}
            onClick={() => {
              setIsSettingOpen((prev) => !prev);
              setOpenDropdown("");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-gear text-2xl"></i>
          </div>
          {isSettingOpen ? (
            <div className="absolute -bottom-20 -right-3 bg-gray-200 flex flex-col w-48 py-2 px-4 rounded-l  before:w-4 before:h-4 before:bg-gray-200  before:absolute before:-top-2 before:right-4 before:rotate-45">
              <div className="flex items-center gap-3">
                <div className="profile">
                  <img
                    src="https://seeklogo.com/images/O/ofppt-logo-B2CAD4E136-seeklogo.com.png"
                    alt="profile"
                  />
                </div>
                <span className="name text-black text-x">
                  {userData.data.first_name + " " + userData.data.last_name}
                </span>
                <button>
                  <span
                    className="logout fa-solid fa-right-from-bracket"
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.pathname = "/";
                    }}
                  ></span>
                </button>
              </div>
              <hr />
            </div>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </div>
  );
};
