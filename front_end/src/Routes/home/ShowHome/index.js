import { useState, useEffect } from "react";
import { events, fetchedDates, User } from "../../../data";
import { GetEvents } from "../../../api";
import { Store } from "react-data-stores";
import { roles } from "../../../utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState("courrier");
  const [userData, setUserData] = User.useStore();
  const [eventsData, setEventData] = events.useStore();
  const [renderArray, setRenderArray] = useState([]);
  useEffect(() => {
    if (!userData.token) return;
    const date = new Date();
    const start = new Date(
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-1"
    );
    const computed_start = start.getTime();
    const computed_end = date.getTime();
    if (
      fetchedDates.find(
        (dateTime) =>
          dateTime.start <= computed_start && computed_end <= dateTime.end
      )
    )
      return;
    GetEvents(userData.token, {
      start: start.toISOString().split("T")[0], //from the begenin of the moth
    }).then((res) => {
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
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      fetchedDates.push({
        start: computed_start,
        end: end.getTime(), //get the last day of the month
      });
      setRenderArray(formattedEvents);
    });
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
  }, [eventsData]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <header className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg py-4 px-6 md:px-12">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide">
            Courrier Dashboard
          </h1>
          <nav className="flex space-x-2 md:space-x-6">
            <button
              className={`px-5 py-2 rounded-lg text-lg font-medium transition-all duration-300 
              ${
                activeTab === "courrier"
                  ? "bg-white text-green-700 shadow-md"
                  : "hover:bg-green-800 hover:text-white"
              }`}
              onClick={() => setActiveTab("courrier")}
            >
              Courrier
            </button>
            <button
              className={`px-5 py-2 rounded-lg text-lg font-medium transition-all duration-300 
              ${
                activeTab === "evenements"
                  ? "bg-white text-green-700 shadow-md"
                  : "hover:bg-green-800 hover:text-white"
              }`}
              onClick={() => setActiveTab("evenements")}
            >
              Événements
            </button>
          </nav>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow container mx-auto md:px-4 py-8 sm:px-0  ">
        {/* Common Section Styles */}
        <div className="bg-white shadow-md rounded-md md:p-6 sm:p-1 mb-8">
          {/* Added margin bottom */}
          {activeTab === "courrier" && (
            <CourrierTable eventsData={renderArray} userData={userData.data} />
          )}
          {activeTab === "evenements" && (
            <EventTable eventsData={renderArray} userData={userData.data} />
          )}
        </div>
      </main>
    </div>
  );
}

// Separate components for tables (cleaner code)
const CourrierTable = ({ eventsData, userData }) => {
  const dataToRender = eventsData.filter((event) => {
    return event.is_courier == 1;
  });
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        Courriers <i className="fas fa-inbox"></i>
      </h2>
      <p className="text-gray-600">
        Ici, vous pouvez gérer et consulter vos courries.
      </p>
      <table className="min-w-full divide-y divide-gray-200 table-auto border-gray-200 border-2">
        {/* table-auto for better responsiveness */}
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-center text-gray-500 uppercase font-medium tracking-wider">
              Deadline <i className="fa-solid fa-calendar-days ml-2"></i>
            </th>
            <th className="px-4 py-2 text-center text-gray-500 uppercase font-medium tracking-wider">
              Expéditeur <i className="fa-solid fa-user ml-2"></i>
            </th>
            <th className="px-4 py-2 text-center text-gray-500 uppercase font-medium tracking-wider">
              Objet <i className="fa-solid fa-note-sticky ml-2"></i>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 ">
          {dataToRender.length > 0 ? (
            dataToRender.map((e) => (
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
                <td className="px-4 text-center py-2 whitespace-nowrap">
                  {e?.deadline}
                </td>
                <td className="px-4 text-center py-2 whitespace-nowrap">
                  {e?.expiditeur}
                </td>
                <td className="px-4 text-center py-2 ">{e?.title}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td></td>
              <td className="text-center">no data</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

const EventTable = ({ eventsData, userData }) => {
  const dataToRender = eventsData.filter((event) => {
    return event.is_courier == 0;
  });
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        Evenements <i className="fas fa-calendar-alt"></i>
      </h2>
      <p className="text-gray-600">
        Ici, vous pouvez gérer et consulter vos events.
      </p>
      <table className="min-w-full divide-y divide-gray-200 table-auto border-gray-200 border-2">
        {/* table-auto for better responsiveness */}
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-center text-gray-500 uppercase font-bold  tracking-wider ">
              Deadline <i className="fas fa-calendar-alt ml-2"></i>
            </th>
            {/* Text alignment */}
            <th className="px-4 py-2 text-center text-gray-500 uppercase font-medium tracking-wider">
              Expéditeur <i className="fas fa-user ml-2"></i>
            </th>
            <th className="px-4 py-2 text-center text-gray-500 uppercase font-medium tracking-wider">
              Objet <i className="fas fa-sticky-note ml-2"></i>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dataToRender.length > 0 ? (
            dataToRender.map((e) => (
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
                <td className="px-4 text-center py-2 whitespace-nowrap">
                  {e?.deadline}
                </td>
                <td className="px-4 text-center py-2 whitespace-nowrap">
                  {e?.expiditeur}
                </td>
                <td className="px-4 text-center py-2">{e?.title}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                no data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};
