import { useEffect, useState } from "react";
import { getDepartements, DeleteDepartment } from "../../../api"; // Assurez-vous que cette fonction existe dans vos APIs.
import { departements_group_store, User } from "../../../data";
import UpdateDepartment from "../updateDepartement";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

export default function ShowDepartments() {
  const [userData, setUserData] = User.useStore();
  const [departementsGroups, setDepartmentsGroups] =
    departements_group_store.useStore();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    DeleteDepartment(userData.token, id).then((res) => {
      console.log(res);
      setDepartmentsGroups({
        departements: departementsGroups.departements.filter(
          (dept) => dept.department_id !== id
        ),
      });
    });
  };

  const handleUpdate = (id) => {
    navigate("update/" + id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-4 w-full max-w-4xl bg-white shadow-md rounded-md">
        <h1 className="text-xl font-semibold text-gray-800 mb-3 text-center">
          Departments
        </h1>

        <table className="w-full table-auto border-separate border-spacing-0.5">
          <thead>
            <tr>
              <th className="text-sm text-gray-600 font-medium py-2 px-3 border-b">
                Name
              </th>

              <th className="text-sm text-gray-600 font-medium py-2 px-3 border-b">
                Option
              </th>
            </tr>
          </thead>
          <tbody>
            {departementsGroups.departements.map((e) => (
              <tr key={e.department_id} className="hover:bg-gray-100">
                <td className="text-sm text-gray-700 py-2 px-3 border-b">
                  {e.department_name}
                </td>

                <td className="py-2 px-3 border-b">
                  <button
                    onClick={() => handleDelete(e.department_id)}
                    className="text-red-500 hover:text-red-700 mr-2"
                    aria-label="Delete Department"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    onClick={() => handleUpdate(e.department_id)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Update Department"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
