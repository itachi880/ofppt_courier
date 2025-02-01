import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetUsersById } from "../../../api";
import { User, usersStore } from "../../../data";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
export function DetailUsers(){
    const [userData, setUserData] = User.useStore();
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        GetUsersById(userData.token,id).then((res) => {
            if (res[0]) return console.log(res[0]);
            console.log('res1',res[1]);
            setUsers([...users,res[1]]);

        });
    }, []);
    return(
        <div className="overflow-x-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
         Detail   Users:
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
            {users.length > 0 ? (
              users.map((user) => {
                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6" >{user.last_name || ""}</td>
                    <td className="py-3 px-6">{user.first_name || ""}</td>
                    <td className="py-3 px-6"  >{user.email}</td>
                    <td className="py-3 px-6" >{user.role || "uknown"}</td>
                    <td className="py-3 px-6" >{user.departement_id || "uknown"}</td>
                    <td className="py-3 px-6" >{user.group_id || "uknown"}</td>
                    <td className="py-3 px-6" ><button        className="text-blue-500 hover:text-blue-700"
                    aria-label="Update Department" onClick={()=>{console.log(id)}}><FaEdit/></button></td>
                    <td className="py-3 px-6" ><button   className="text-red-500 hover:text-red-700 mr-2"
                    aria-label="Delete Department"><FaTrashAlt /></button></td>
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
    )
}   