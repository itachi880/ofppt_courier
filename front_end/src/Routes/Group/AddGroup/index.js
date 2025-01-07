import { useEffect, useState } from "react";
import { departements_group_store, User } from "../../../data/index";
import { AddGroupApi } from "../../../api";

/**
 * @type {Record<string,import("react").CSSProperties>}
 */
const styles = {
  container: {
    Width: "900px",
    position: "absolute",
    top: "30%",
    right: "30%",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  select: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  },
};

export default function AddGroup() {
  const [userData, setUserData] = User.useStore();
    const [departementsGroups, setDepartmentsGroups] = departements_group_store.useStore();
  const [formData, setFormData] = useState({
    name: "",
    token: userData.token,
    id:0
  });



  useEffect(() => {
    console.log(departementsGroups);
  }, [formData]);

  return (
    <div style={styles.container}>
      <label style={styles.label}>Group Name</label>
      <input
        style={styles.input}
        placeholder="Enter Department Name"
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
        }}
        value={formData.name}
      />
            <select onChange={(e)=>{
                 setFormData({ ...formData,  DepartementAssign: e.target.value});

                  // index=e.target.selectedIndex

            }} style={styles.select}>
              <option selected>Select Department</option>
        {departementsGroups.departements.map((e,i)=>{
            return <option key={i} value={e.department_id} onClick={()=>{
              setFormData({ ...formData,  id:e.department_id });
            }}>{e.department_name}</option>
        })}
   

      </select>
      {/* <ul>
          {departementsGroups.departements.map((e,i)=>{
            return <li key={i}>{e.department_id
}</li>
          })}
        </ul> */}
      {/* <select onChange={(e)=>{
                  setFormData({ ...formData,  DepartementAssign: e.target.value });
      }}>
        <option selected>Select Department</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>

      </select> */}
      {/* <button onClick={()=>{
          console.log(formData.token);
      }}
      >to</button> */}
   

      <input
        type="submit"
        value="Add group"
        style={styles.submitButton}
        onClick={() => {
          const departmentData = {
            name: formData.name,
            department_id:formData.DepartementAssign,
            token: formData.token,
  
          };

          AddGroupApi(departmentData)
            .then((res) => {
              console.log("Group added successfully:", res);
            })
            .catch((err) => {
              console.error("Failed to add department:", err);
            });
        }}
      />
    </div>
  );
}
