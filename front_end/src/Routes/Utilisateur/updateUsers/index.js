import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, usersStore, departements_group_store } from "../../../data";
import { useNavigate } from "react-router-dom";
import { GetUsersById, UpdateUserApi } from "../../../api";
import { roles } from "../../../utils";
import Swal from "sweetalert2";

export function UpdateUsers() {
  const { id } = useParams();
  const [users, setUsers] = useState({});
  useEffect(() => {
    GetUsersById(userData.token, id).then((res) => {
      if (res[0]) return console.log(res[0]);
      setUsers(res[1]);
    });
  }, []);
  useEffect(() => {
    console.log("table", users);
  }, [users]);
  const [departementsGroups, setDepartmentsGroups] =
    departements_group_store.useStore();
  const [userData, setUserData] = User.useStore();
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Modifié utilisateurs:
      </h2>
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nom</th>
            <th className="py-3 px-6 text-left">Prénom</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Rôle</th>
            <th className="py-3 px-6 text-left">Entité</th>
            <th className="py-3 px-6 text-left">Service</th>
            <th className="py-3 px-6 text-left">Enregistré</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-6" onClick={() => {}}>
              <input
                value={users.last_name || ""}
                type="text"
                onChange={(e) => {
                  setUsers({ ...users, last_name: e.target.value });
                }}
              />
            </td>
            <td className="py-3 px-6">
              <input
                value={users.first_name || ""}
                type="text"
                onChange={(e) => {
                  setUsers({ ...users, first_name: e.target.value });
                }}
              />
            </td>
            <td className="py-3 px-6">
              <input
                value={users.email}
                type="text"
                onChange={(e) => {
                  setUsers({ ...users, email: e.target.value });
                }}
              />
            </td>
            <td className="py-3 px-6">
              <select
                onChange={(e) => {
                  setUsers({
                    ...users,
                    role: e.target.value,
                  });
                }}
                value={users.role}
              >
                <option value={""}>Selectionne le role</option>
                {Object.values(roles).map((role) => {
                  return (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  );
                })}
              </select>
            </td>
            <td className="py-3 px-6">
              {" "}
              <select
                onChange={(e) => {
                  setUsers({
                    ...users,
                    departement_id: e.target.value,
                    group_id: null,
                  });
                }}
                value={users.departement_id}
              >
                <option>Selectionne l'Entité </option>
                {departementsGroups.departements.map((dept) => {
                  return (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  );
                })}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                onChange={(e) => {
                  setUsers({
                    ...users,
                    group_id: e.target.value,
                    departement_id: null,
                  });
                }}
                value={users.group_id}
              >
                <option>Selectionné le Service</option>
                {departementsGroups.departements.map((e) => {
                  return e.groups.map((gp) => {
                    return (
                      <option key={gp.id} value={gp.id}>
                        {gp.name}
                      </option>
                    );
                  });
                })}
              </select>
            </td>
            <td className="py-3 px-6">
              <button
                onClick={async () => {
                  await UpdateUserApi(id, userData.token, users)
                    .then((res) => {
                      if (res[0]) {
                        Swal.fire({
                          icon: "error",
                          title: "Error!",
                          text: `Server returned an error: ${res[0].status} - ${
                            res[0].statusText || "Unknown Error"
                          }`, // Display specific error message
                        });
                        return;
                      }
                      Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "User added successfully!",
                      });
                    })
                    .catch((err) => {});
                }}
                className="bg-green-100 text-green-600 font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                Enregistré
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
