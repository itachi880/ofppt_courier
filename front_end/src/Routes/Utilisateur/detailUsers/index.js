import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DeleteUserApi, GetUsersById } from "../../../api";
import { User, departements_group_store, loading } from "../../../data";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

export function DetailUsers() {
  const [departementsGroups, setDepartmentsGroups] =
    departements_group_store.useStore();
  const [userData, setUserData] = User.useStore();
  const { id } = useParams();
  const [users, setUsers] = useState({})
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  const navigate = useNavigate();
  useEffect(() => {
    setLoadingFlag({ loading: true });
    GetUsersById(userData.token, id).then((res) => {
      setLoadingFlag({ loading: false });
      if (res[0]) return console.log(res[0]);
      console.log("res1", res[1]);
      setUsers( res[1]);
    });
    console.log(departementsGroups);
  }, []);
  return (
    <div className="overflow-x-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Detail Users:
      </h2>
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nom</th>
            <th className="py-3 px-6 text-left">Prénom</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Rôle</th>
            <th className="py-3 px-6 text-left">departement</th>
            <th className="py-3 px-6 text-left">group</th>
            <th className="py-3 px-6 text-left">Update</th>
            <th className="py-3 px-6 text-left">Delete</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {Object.keys(users).length > 0 ? (
          
                <tr
                  key={users.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6" onClick={() => {}}>
                    {users.last_name || ""}
                  </td>
                  <td className="py-3 px-6">{users.first_name || ""}</td>
                  <td className="py-3 px-6">{users.email}</td>
                  <td className="py-3 px-6">{users.role || "uknown"}</td>
                  <td className="py-3 px-6">
                    {departementsGroups.departements.find(
                      (e) => e.department_id == users.departement_id
                    )?.department_name || "Inconnu"}
                  </td>
                  <td className="py-3 px-6">
                    {departementsGroups.departements
                      .map(
                        (departement) =>
                          departement.groups.find(
                            (group) => group.id === users.group_id
                          )?.name
                      )
                      .find((name) => name) || "Inconnu"}
                  </td>
                  <td className="py-3 px-6">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Update Department"
                      onClick={() => {
                        navigate(`/utilisateur/updateusers/${users.id}`);
                      }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td className="py-3 px-6">
                    <button
                      className="text-red-500 hover:text-red-700 mr-2"
                      onClick={() =>
                        DeleteUserApi(users.id, userData.token)
                          .then((res) => {
                            console.log(res);
                          })
                          .catch((err) => {
                            console.log(err);
                          })
                      }
                      aria-label="Delete Department"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
           
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
}
