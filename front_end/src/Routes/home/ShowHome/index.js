import { useState, useEffect } from "react";
import { events, User } from "../../../data";
import { GetEvents } from "../../../api";
import { Store } from "react-data-stores";
import { roles } from "../../../utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState("courrier");
  const [userData, setUserData] = User.useStore();
  const [eventsData, setEventData] = events.useStore();
  const [hasUpcomingDeadline, setHasUpcomingDeadline] = useState(false);
  const [alertEvents, setAlertEvents] = useState([]);

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
    const tomorrowStr = today.toISOString().split("T")[0];
    const upcoming = eventsData.data.some((e) => e.deadline === tomorrowStr);
    setHasUpcomingDeadline(upcoming);


    const alerts = eventsData.data.filter((e) => e.deadline === tomorrowStr);
    setAlertEvents(alerts);
  }, [eventsData]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      {/* Navbar */}
      <header className="bg-blue-600 text-white shadow-md py-4 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">OFPPT Dashboard</h1>
          <nav>
            <button
              className={`mr-4 px-4 py-2 rounded ${
                activeTab === "courrier" ? "bg-blue-800" : "hover:bg-blue-700"
              }`}
              onClick={() => setActiveTab("courrier")}
            >
              Courrier{" "}
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "evenements" ? "bg-blue-800" : "hover:bg-blue-700"
              }`}
              onClick={() => setActiveTab("evenements")}
            >
              Événements
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "alerts" ? "bg-blue-800" : "hover:bg-blue-700"
              }`}
              onClick={() => setActiveTab("alerts")}
            >
              Alerts{" "}
              {hasUpcomingDeadline && (
                <span className="ml-2 text-red-500">🚨</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        {activeTab === "courrier" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Courrier</h2>
            <div className="bg-white shadow-md rounded-md p-6">
              <p className="text-gray-600">
                Ici, vous pouvez gérer et consulter vos courriers.
              </p>
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Expéditeur</th>
                    <th className="border border-gray-300 p-2">Objet</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsData.data.map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => {
                        if (userData.data.role == roles.admin) {
                        Store.navigateTo("/courrier/update/" + e.id);
                      }else{
                        Store.navigateTo("/courrier/detail/" + e.id);
                      }
                      }}
                    >
                      <td className="border border-gray-300 p-2">
                        {e?.deadline}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {e?.expiditeur}
                      </td>
                      <td className="border border-gray-300 p-2">{e?.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "alerts" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Alerts</h2>
            <div className="bg-white shadow-md rounded-md p-6">
              <p className="text-gray-600">
                Courriers avec deadline imminente.
              </p>
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Expéditeur</th>
                    <th className="border border-gray-300 p-2">Objet</th>
                  </tr>
                </thead>
                <tbody>
                  {alertEvents.map((e) => (
                    <tr key={e.id}>
                      <td className="border border-gray-300 p-2">
                        {e?.deadline}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {e?.expiditeur}
                      </td>
                      <td className="border border-gray-300 p-2">{e?.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
