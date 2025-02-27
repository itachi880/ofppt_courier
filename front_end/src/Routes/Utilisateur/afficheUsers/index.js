import { useEffect } from "react";
import { loading, User, usersStore } from "../../../data";
import { GetUsersApi } from "../../../api";
import { roles } from "../../../utils";
import { Store } from "react-data-stores";
import { useNavigate } from "react-router-dom";

export function AfficheUsers() {
  const [users, setUsers] = usersStore.useStore();
  const [userData, setUserData] = User.useStore();
  const navigate = useNavigate();
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  useEffect(() => {
    if (!userData.token) return;
    if (userData.data.role != roles.admin) Store.navigateTo("/");
    setLoadingFlag({ loading: true });
    GetUsersApi(userData.token).then((res) => {
      setLoadingFlag({ loading: false });
      if (res[0]) return console.log(res[0]);
      setUsers({ data: res[1] });
    });
  }, []);
  return (
    <>
      <header className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg py-4 px-6 md:px-12">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-wide">
            Affiche utilisateurs
          </h1>
          <nav className="flex space-x-2 md:space-x-6"></nav>
        </div>
      </header>
      <div className="overflow-x-auto p-6">
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
                    <td
                      className="py-3 px-6"
                      onClick={() => {
                        navigate(`/utilisateur/detailUsers/${user.id}`);
                      }}
                    >
                      {user.last_name || ""}
                    </td>
                    <td
                      className="py-3 px-6"
                      onClick={() => {
                        navigate(`/utilisateur/detailUsers/${user.id}`);
                      }}
                    >
                      {user.first_name || ""}
                    </td>
                    <td
                      className="py-3 px-6"
                      onClick={() => {
                        navigate(`/utilisateur/detailUsers/${user.id}`);
                      }}
                    >
                      {user.email}
                    </td>
                    <td
                      className="py-3 px-6"
                      onClick={() => {
                        navigate(`/utilisateur/detailUsers/${user.id}`);
                      }}
                    >
                      {user.role || "uknown"}
                    </td>
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
    </>
  );
}
