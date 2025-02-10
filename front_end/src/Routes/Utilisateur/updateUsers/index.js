import { useParams } from "react-router-dom";
import {  useEffect, useState } from "react";
import { User, usersStore,departements_group_store } from "../../../data";
import { useNavigate } from "react-router-dom";
import { GetUsersById,UpdateUserApi } from "../../../api";
import { roles } from "../../../utils";

export function UpdateUsers(){
    const {id}=useParams();
    const [users, setUsers] = useState({});
    useEffect(() => {
        GetUsersById(userData.token,id).then((res) => {
            if (res[0]) return console.log(res[0]);
            console.log('res1',res[1]);
            setUsers(res[1]);
   
        });
    }, []);
    useEffect(() => {
        console.log( 'table',users); 
      }, [users]);
    const [departementsGroups, setDepartmentsGroups] =
    departements_group_store.useStore();
    const [userData, setUserData] = User.useStore();
    return (
    <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                 Update   Users:
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
                      <th className="py-3 px-6 text-left">submit</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm font-light">
                  
                          <tr
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="py-3 px-6"  onClick={()=>{ }}><input value={users.last_name || ""} type="text" onChange={(e)=>{setUsers({...users,last_name:e.target.value})}}/></td>
                            <td className="py-3 px-6"><input value={users.first_name || ""} type="text"  onChange={(e)=>{setUsers({...users,first_name:e.target.value})}}/></td>
                            <td className="py-3 px-6"  ><input value={users.email} type="text" onChange={(e)=>{setUsers({...users,email:e.target.value})}}/></td>
                            <td className="py-3 px-6" >
                                <select onChange={(e)=>{setUsers({...users,role:e.target.value})}}>
                                <option>Selectionne le role</option>
                                {
                                    Object.values(roles).map((role)=>{
                                        return <option key={role} value={role}>{role}</option>
                                    })
                                }
                                </select></td>
                            <td className="py-3 px-6"> <select onChange={(e)=>{setUsers({...users,departement_id:e.target.value,group_id:null})}}>
                                <option>Selectionne le departement </option>
                                {
                                    departementsGroups.departements.map((dept)=>{
                                        return <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
                                    })

                                }
                                </select>
                                </td>
                            <td className="py-3 px-6"> 
                            <select onChange={(e)=>{setUsers({...users,group_id:e.target.value,departement_id:null})}}>
                                <option>Selectionne le group</option>
                                {
                                    departementsGroups.departements.map((e)=>{

                                       return  e.groups.map((gp)=>{return <option key={gp.id} value={gp.id} >{gp.name}</option>})
                                    })
                                }
                             </select>
                            </td>
        <td className="py-3 px-6">
  <button 
    onClick={() =>
        UpdateUserApi(id,userData.token,users).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        }) 
}


    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
  >
    Submit
  </button>
</td>
                          </tr>
                  </tbody>
                </table>
    </div>
    )
}