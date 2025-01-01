import { useEffect, useState } from "react";
import { GetDepartments } from "../../../api"; // Assurez-vous que cette fonction existe dans vos APIs.
import {  User } from "../../../data";

export default function ShowDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = User.useStore();

  useEffect(() => {
    // Appel API pour récupérer les départements
    if (!userData.token) return;
    GetDepartments(userData.token)
      .then((response) => {
        if (response[0]) {
          console.log("Error fetching departments:", response[0]);
          return;
        }
        setDepartments(response[1]?.data || []); 
      })
      .catch(() => setLoading(false)); 
      console.log(departments);
  }, []);

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
              <th style={{ border: "1px solid black", padding: "8px" }}> create at</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((e) => (
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>{e.name}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{e.create_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
   
  );
}
/**
 * mazzl makmlaaax 
 */