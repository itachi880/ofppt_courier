import { useState } from "react";
import { DeleteDepartment } from "../../../api"; // Assurez-vous que cette fonction existe dans vos APIs.
import { departements_group_store, loading, User } from "../../../data";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function ShowDepartments() {
  const [userData, setUserData] = User.useStore();
  const [departementsGroups, setDepartmentsGroups] =
    departements_group_store.useStore();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  const handleDelete = (id) => {
    setLoadingFlag({ loading: true });
    DeleteDepartment(userData.token, id).then((res) => {
      if (res[0])
        return (
          setLoadingFlag({ loading: false }) &&
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "L'entité n'a pas été supprimée.",
          })
        ); //animation
      const ids = [];
      setDepartmentsGroups({
        departements: departementsGroups.departements.filter((dept) => {
          if (dept.department_id == id) {
            ids.push(...dept.groups.map((g) => +g.id));

            return false;
          }
          return true;
        }),
        groups: departementsGroups.groups.filter(
          (grp) => !ids.includes(grp.id)
        ),
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "L'entité a été Suprimer avec succès.",
      });
      setLoadingFlag({ loading: false });
    });
  };

  const handleUpdate = (id) => {
    navigate("update/" + id);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg py-4 px-6 md:px-12">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-wide">
            Show Department
          </h1>
          <nav className="flex space-x-2 md:space-x-6"></nav>
        </div>
      </header>
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
                  Delete
                </th>
                <th className="text-sm text-gray-600 font-medium py-2 px-3 border-b">
                  Update
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
  
                  </td>
                  <td className="py-2 px-3 border-b">
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

    </>
  );
}
