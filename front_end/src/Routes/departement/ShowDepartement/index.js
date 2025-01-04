import { useEffect, useState } from "react";
import { getDepartements, DeleteDepartment } from "../../../api"; // Assurez-vous que cette fonction existe dans vos APIs.
import { departements_group_store, User } from "../../../data";
// import UpdateDepartment from "../updateDepartement/index" 

export default function ShowDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = User.useStore();
  const [departementsGroups, setDepartmentsGroups] = departements_group_store.useStore();

  useEffect(() => {
    if (!userData.token) return;
    console.log(departementsGroups);
    getDepartements(userData.token)
      .then((response) => {
        if (response[0]) {
          console.log("Error fetching departments:", response[0]);
          return;
        }
        setDepartments(response[1]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    DeleteDepartment(userData.token, id).then(() => {
      setDepartments(departments.filter((dept) => dept.id != id));
    });
  };

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
              <th style={{ border: "1px solid black", padding: "8px" }}>Created At</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Option</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((e) => (
              <tr key={e.id}> {/* Add a key to each row */}
                <td style={{ border: "1px solid black", padding: "8px" }}>{e.department_name}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{e.department_created_at}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  <button onClick={() => handleDelete(e.department_id)}>Delete</button>
                  <button>update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}





