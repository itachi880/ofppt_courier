import { useEffect, useState } from "react";
import { getGroups,deleteGroupApi } from "../../../api"; // Assurez-vous que cette fonction existe dans vos APIs.
import { departements_group_store, User } from "../../../data";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa"

export default function ShowGroup() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = User.useStore();
  const [departementsGroups, setDepartmentsGroups] = departements_group_store.useStore();
  const [selecteGroups, setSelectGroups] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData.token) return;
    console.log(departementsGroups);
    getGroups(userData.token)
      .then((response) => {
        if (response[0]) {
          console.log("Error fetching departments:", response[0]);
          return;
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userData.token]); // Add userData.token as a dependency

 const handleDelete = (id) => {
    deleteGroupApi(id,userData.token).then(() => {
        setDepartmentsGroups(departementsGroups.groups.filter((gr) => gr.id !== id));
    });
    // console.log("delete group with id: ", id);
  };
  
  const handleUpdate = (id) => {
    navigate("update/"+id );
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="p-4 w-full max-w-4xl bg-white shadow-md rounded-md">
    <h1 className="text-xl font-semibold text-gray-800 mb-3 text-center">Groups</h1>
    {loading ? (
      <p className="text-gray-500 text-center">Loading...</p>
    ) : (
      <table className="w-full table-auto border-separate border-spacing-0.5">
        <thead>
          <tr>
            <th className="text-sm text-gray-600 font-medium py-2 px-3 border-b">Name</th>
            <th className="text-sm text-gray-600 font-medium py-2 px-3 border-b">Option</th>
          </tr>
        </thead>
        <tbody>
          {departementsGroups.groups.map((e) => (
            <tr key={e.id} className="hover:bg-gray-100">
              <td className="text-sm text-gray-700 py-2 px-3 border-b">{e.name}</td>
              <td className="py-2 px-3 border-b">
                <button 
                  onClick={() => handleDelete(e.id)} 
                  className="text-red-500 hover:text-red-700 mr-2"
                  aria-label="Delete Group"
                >
                  <FaTrashAlt />
                </button>
                <button 
                  onClick={() => handleUpdate(e.id)} 
                  className="text-blue-500 hover:text-blue-700"
                  aria-label="Update Group"
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</div>
  );
}

