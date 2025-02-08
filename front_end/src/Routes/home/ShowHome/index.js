import { useState, useEffect } from "react";
import { events, User, documentType } from "../../../data";
import { GetEvents } from "../../../api";
import { Store } from "react-data-stores";
import { roles, useQuery } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome
import {
  faInbox,
  faCalendarAlt,
  faUser,
  faStickyNote,
} from "@fortawesome/free-solid-svg-icons"; // Import icons

export default function Home() {
  const [activeTab, setActiveTab] = useState("courrier");
  const [userData, setUserData] = User.useStore();
  const [eventsData, setEventData] = events.useStore();
  useEffect(() => {
    if (!userData.token) return;
    GetEvents(userData.token).then((res) => {
      console.log(res);
      if (res[0]) return;
      const formattedEvents = res[1].data.map((e) => ({
        ...e,
        deadline: e.deadline.split("T")[0],
        expiditeur: e.expiditeur || "unknown",
        title: e.title,
        id: e.id,
      }));
      setEventData({ data: formattedEvents });
    });
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
  }, [eventsData]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      {/* Navbar */}
      <header className="bg-gray-800 text-white shadow-md py-4 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Courrier Dashboard</h1>
          <nav className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md transition duration-300
                ${
                  activeTab === "courrier"
                    ? "bg-blue-800 text-white font-semibold"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
              onClick={() => setActiveTab("courrier")}
            >
              Courrier
            </button>
            <button
              className={`px-4 py-2 rounded-md transition duration-300
                ${
                  activeTab === "evenements"
                    ? "bg-blue-800 text-white font-semibold"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
              onClick={() => setActiveTab("evenements")}
            >
              Événements
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Common Section Styles */}
        <div className="bg-white shadow-md rounded-md p-6 mb-8">
          {/* Added margin bottom */}
          {activeTab === "courrier" && (
            <CourrierTable
              eventsData={eventsData.data}
              userData={userData.data}
            />
          )}{" "}
          {activeTab === "evenements" && (
            <EventTable eventsData={eventsData.data} userData={userData.data} />
          )}{" "}
          {activeTab === "evenements" && (
            <EventTable eventsData={eventsData.data} userData={userData.data} />
          )}
        </div>
      </main>
    </div>
  );
}

// Separate components for tables (cleaner code)
const CourrierTable = ({ eventsData, userData }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4">
      Courriers <i className="fas fa-inbox"></i>{" "}
    </h2>
    <p className="text-gray-600">
      Ici, vous pouvez gérer et consulter vos courries.
    </p>
    <table className="w-full mt-4 border-collapse table-auto">
      {" "}
      {/* table-auto for better responsiveness */}
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-gray-500 uppercase font-medium tracking-wider">
            Deadline <FontAwesomeIcon icon={faCalendarAlt} className="ml-2" />
          </th>
          <th className="px-4 py-2 text-left text-gray-500 uppercase font-medium tracking-wider">
            Expéditeur <FontAwesomeIcon icon={faUser} className="ml-2" />
          </th>
          <th className="px-4 py-2 text-left text-gray-500 uppercase font-medium tracking-wider">
            Objet <FontAwesomeIcon icon={faStickyNote} className="ml-2" />
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {eventsData
          .filter((event) => {
            return event.is_courier == 1;
          })
          .map((e) => (
            <tr
              key={e.id}
              className="hover:bg-gray-50 cursor-pointer transition duration-200" // Hover effect
              onClick={() => {
                if (userData.role == roles.admin) {
                  Store.navigateTo("/courrier/update/" + e.id);
                } else {
                  Store.navigateTo("/courrier/detail/" + e.id);
                }
              }}
            >
              <td className="px-4 py-2 whitespace-nowrap">{e?.deadline}</td>
              <td className="px-4 py-2 whitespace-nowrap">{e?.expiditeur}</td>
              <td className="px-4 py-2 ">{e?.title}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </section>
);

const EventTable = ({ eventsData, userData }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4">
      Evenements <i className="fas fa-calendar-alt"></i>{" "}
    </h2>
    <p className="text-gray-600">
      Ici, vous pouvez gérer et consulter vos events.
    </p>
    <table className="min-w-full divide-y divide-gray-200 table-auto">
      {" "}
      {/* table-auto for better responsiveness */}
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 text-left text-gray-500 uppercase font-medium tracking-wider">
            Deadline <i className="fas fa-calendar-alt"></i>{" "}
          </th>{" "}
          {/* Text alignment */}
          <th className="px-4 py-2 text-left text-gray-500 uppercase font-medium tracking-wider">
            Expéditeur <i className="fas fa-user"></i>{" "}
          </th>
          <th className="px-4 py-2 text-left text-gray-500 uppercase font-medium tracking-wider">
            Objet <i className="fas fa-sticky-note"></i>{" "}
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {eventsData
          .filter((event) => {
            return event.is_courier == 0;
          })
          .map((e) => (
            <tr
              key={e.id}
              className="hover:bg-gray-50 cursor-pointer transition duration-200" // Hover effect
              onClick={() => {
                if (userData.role == roles.admin) {
                  Store.navigateTo("/courrier/update/" + e.id);
                } else {
                  Store.navigateTo("/courrier/detail/" + e.id);
                }
              }}
            >
              <td className="px-4 py-2 whitespace-nowrap">{e?.deadline}</td>
              <td className="px-4 py-2 whitespace-nowrap">{e?.expiditeur}</td>
              <td className="px-4 py-2">{e?.title}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </section>
);
