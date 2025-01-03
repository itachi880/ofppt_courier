import { useEffect, useState } from "react";
import { getDepartements } from "../../../api"; // Assurez-vous que cette fonction existe dans vos APIs.
import { departements_group_store, User } from "../../../data";

export default function ShowDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = User.useStore();
  const [departementsGroups,setDepartmentsGroups]=departements_group_store.useStore()

  useEffect(() => {
    if (!userData.token) return;
    console.log(departementsGroups)
    getDepartements(userData.token)
      .then((response) => {
        if (response[0]) {
          console.log("Error fetching departments:", response[0]);
          return;
        }
        // console.log(response[1])
        // console.log(departments)
        setDepartments(response[1])
        // console.log(departments)
        setLoading(false);
      })
      .catch(() => setLoading(false)); 
  }, []); // Add userData.token as a dependency

  return (
    <div style={{ padding: "20px" }}>
      <h1>Departments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>created_at</th>
              <th style={{ border: "1px solid black", padding: "8px" }}> option</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((e)=>{
              return <tr> 
                <td>{e.department_name}</td>
                <td>{e. department_created_at}</td>
                <td><button onClick={()=>{}}>Delete</button></td>
              </tr>
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}