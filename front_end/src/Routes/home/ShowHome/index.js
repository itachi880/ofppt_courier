import { useState, useEffect } from "react";
import { events, User,documentType } from "../../../data";
import { GetEvents } from "../../../api";
import { Store } from "react-data-stores";
import { roles ,useQuery} from "../../../utils";

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
      <header className="bg-blue-600 text-white shadow-md py-4 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">OFPPT Dashboard</h1>
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
          )}  {activeTab === "evenements" && (
            <EventTable
              eventsData={eventsData.data}
              userData={userData.data}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Separate components for tables (cleaner code)
const CourrierTable = ({ eventsData, userData }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4">courrie</h2>
    <p className="text-gray-600">Ici, vous pouvez gérer et consulter vos courries.</p>
    <table className="w-full mt-4 border-collapse table-auto"> {/* table-auto for better responsiveness */}
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 p-2 text-left">Date</th> {/* Text alignment */}
          <th className="border border-gray-300 p-2 text-left">Expéditeur</th>
          <th className="border border-gray-300 p-2 text-left">Objet</th>
        </tr>
      </thead>
      <tbody>
        {eventsData.filter(event=>{
          return (event.is_courier==1 )
        } ).map((e) => (
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
            <td className="border border-gray-300 p-2">{e?.deadline}</td>
            <td className="border border-gray-300 p-2">{e?.expiditeur}</td>
            <td className="border border-gray-300 p-2">{e?.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);





const EventTable = ({ eventsData, userData }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4">event</h2>
    <p className="text-gray-600">Ici, vous pouvez gérer et consulter vos events.</p>
    <table className="w-full mt-4 border-collapse table-auto"> {/* table-auto for better responsiveness */}
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 p-2 text-left">Date</th> {/* Text alignment */}
          <th className="border border-gray-300 p-2 text-left">Expéditeur</th>
          <th className="border border-gray-300 p-2 text-left">Objet</th>
        </tr>
      </thead>
      <tbody>
        {eventsData.filter(event=>{
          return (event.is_courier==0 )
        } ).map((e) => (
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
            <td className="border border-gray-300 p-2">{e?.deadline}</td>
            <td className="border border-gray-300 p-2">{e?.expiditeur}</td>
            <td className="border border-gray-300 p-2">{e?.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);