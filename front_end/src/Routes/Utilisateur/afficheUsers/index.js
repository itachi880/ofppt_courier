import React, { useEffect, useState } from "react";


export function  AfficheUsers (){
  const [users, setUsers] = useState([]);


  return (
    <div className="overflow-x-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Liste des Utilisateurs</h2>
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nom</th>
            <th className="py-3 px-6 text-left">Prénom</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Rôle</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">{user.last_name}</td>
                <td className="py-3 px-6">{user.first_name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{user.role || "Utilisateur"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-3 px-6 text-center text-gray-500">
                Aucun utilisateur trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


