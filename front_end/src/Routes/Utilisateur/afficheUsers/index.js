import { useEffect } from "react";
import { User, usersStore } from "../../../data";
import { GetUsersApi } from "../../../api";
import { roles } from "../../../utils";
import { Store } from "react-data-stores";
import { useNavigate } from "react-router-dom";

export function AfficheUsers() {
  const [users, setUsers] = usersStore.useStore();
  const [userData, setUserData] = User.useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userData.token) return;
    if (userData.data.role != roles.admin) Store.navigateTo("/");
    console.log("start demond");
    console.log(users);
    GetUsersApi(userData.token).then((res) => {
      if (res[0]) return console.log(res[0]);
      setUsers({ data: res[1] });
    });
  }, []);
  return (
    <div className="overflow-x-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Liste des Utilisateurs
      </h2>
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
          {users.data.length > 0 ? (
            users.data.map((user) => {
              return (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6" onClick={()=>{ console.log(user.id);  navigate(`/utilisateur/detailUsers/${user.id}`); }}>{user.last_name || ""}</td>
                  <td className="py-3 px-6" onClick={()=>{console.log(user.id);navigate(`/utilisateur/detailUsers/${user.id}`)}}>{user.first_name || ""}</td>
                  <td className="py-3 px-6" onClick={()=>{console.log(user.id);navigate(`/utilisateur/detailUsers/${user.id}`)}} >{user.email}</td>
                  <td className="py-3 px-6" onClick={()=>{console.log(user.id);navigate(`/utilisateur/detailUsers/${user.id}`)}}>{user.role || "uknown"}</td>
                  {/* <td className="py-3 px-6">{user.id || "uknown"}</td> */}
                </tr>
              );
            })
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
