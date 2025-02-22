import { use, useState,useEffect } from "react";
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
  useEffect(() => {
    console.log("start comp", departementsGroups);
  })

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
        <div className="p-6 w-full max-w-4xl bg-white shadow-lg rounded-lg">
          {" "}
          {/* Increased padding, rounded corners */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            {" "}
            {/* Increased title size, margin */}
            Departments
          </h1>
          <table className="w-full table-auto border-collapse">
            {" "}
            {/* Use border-collapse for cleaner table */}
            <thead>
              <tr className="bg-gray-100">
                {" "}
                {/* Added background color to header row */}
                <th className="text-left text-gray-700 font-medium py-3 px-4 border-b border-gray-200">
                  {" "}
                  {/* Adjusted padding, border */}
                  Name
                </th>
                <th className="text-center text-gray-700 font-medium py-3 px-4 border-b border-gray-200">
                  {" "}
                  {/* Centered text */}
                  Delete
                </th>
                <th className="text-center text-gray-700 font-medium py-3 px-4 border-b border-gray-200">
                  {" "}
                  {/* Centered text */}
                  Update
                </th>
              </tr>
            </thead>
            <tbody>
              {departementsGroups.departements.map((e) => (
                <tr
                  key={e.department_id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  {" "}
                  {/* Added hover effect, transition */}
                  <td className="text-gray-700 py-3 px-4 border-b border-gray-200">
                    {" "}
                    {/* Adjusted padding, border */}
                    {e.department_name}
                  </td>
                  <td className="text-center py-3 px-4 border-b border-gray-200">
                    {" "}
                    {/* Centered buttons */}
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "vous êtes sûr de vouloir supprimer cette entité?",
                          icon: "question",
                          iconHtml: "؟",
                          confirmButtonText: "Oui",
                          cancelButtonText: "Non",
                          showCancelButton: true,
                          showCloseButton: true
                        }).then((result)=>{
                          if(result.isConfirmed){
                            handleDelete(e.department_id)
                          }
                        })
                       }}
                      className="text-red-600 hover:text-red-800 mr-2 focus:outline-none transition duration-200" /* Improved button styling */
                      aria-label="Delete Department"
                    >
                      <FaTrashAlt className="text-lg" /> {/* Larger icon */}
                    </button>
                  </td>
                  <td className="text-center py-3 px-4 border-b border-gray-200">
                    {" "}
                    {/* Centered buttons */}
                    <button
                      onClick={() => handleUpdate(e.department_id)}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none transition duration-200" /* Improved button styling */
                      aria-label="Update Department"
                    >
                      <FaEdit className="text-lg" /> {/* Larger icon */}
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
