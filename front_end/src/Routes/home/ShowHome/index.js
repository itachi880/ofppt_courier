import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("courrier");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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
              Courrier
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "evenements" ? "bg-blue-800" : "hover:bg-blue-700"
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
        {activeTab === "courrier" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Courrier</h2>
            <div className="bg-white shadow-md rounded-md p-6">
              <p className="text-gray-600">
                Ici, vous pouvez gérer et consulter vos courriers.
              </p>
              {/* Example Table */}
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Expéditeur</th>
                    <th className="border border-gray-300 p-2">Objet</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">2025-01-01</td>
                    <td className="border border-gray-300 p-2">Service A</td>
                    <td className="border border-gray-300 p-2">
                      Demande de document
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">2025-01-10</td>
                    <td className="border border-gray-300 p-2">Service B</td>
                    <td className="border border-gray-300 p-2">Invitation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "evenements" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Événements</h2>
            <div className="bg-white shadow-md rounded-md p-6">
              <p className="text-gray-600">
                Consultez les événements à venir et leurs détails.
              </p>
              {/* Example Event List */}
              <ul className="mt-4">
                <li className="mb-3">
                  <h3 className="text-lg font-bold">Formation React</h3>
                  <p className="text-gray-500">Date : 2025-02-15</p>
                  <p className="text-gray-500">Lieu : Centre OFPPT</p>
                </li>
                <li className="mb-3">
                  <h3 className="text-lg font-bold">Atelier Java</h3>
                  <p className="text-gray-500">Date : 2025-03-01</p>
                  <p className="text-gray-500">Lieu : Centre OFPPT</p>
                </li>
              </ul>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
    </div>
  );
}
