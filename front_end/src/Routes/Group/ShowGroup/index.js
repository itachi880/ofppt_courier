import { useEffect, useState } from "react";
import { getGroups,deleteGroupApi } from "../../../api"; // Assurez-vous que cette fonction existe dans vos APIs.
import { departements_group_store, User } from "../../../data";
import { useNavigate } from "react-router-dom";

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
    <div style={{ padding: "20px" }}>
      <h1>Groups</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Option</th>
            </tr>
          </thead>
          <tbody>
            {departementsGroups.groups.map((e) => (
              <tr key={e.id}> {/* Add a key to each row */}
                <td style={{ border: "1px solid black", padding: "8px" }}>{e.name}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  <button onClick={()=>{
                    handleDelete(e.id)
                  }} >Delete</button>
                  <button onClick={()=>{handleUpdate(e.id)}} >Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

