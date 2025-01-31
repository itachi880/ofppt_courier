import { useEffect, useRef, useState } from "react";
import { departements_group_store, User } from "../../../data";
import { GreenBox, RedBox } from "../../../utils";
import { AddUserApi } from "../../../api";
/**
 * @type {Record<string,import("react").CSSProperties>}
 */
const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
  fileInput: {
    margin: "10px 0",
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
  hr: {
    border: "none",
    borderBottom: "1px solid #ddd",
    margin: "20px 0",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  },
  section: {
    width: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
  },
};
export  function AddUsers () {
  const [userData, setUserData] = User.useStore();
  const [formData, setFormData] = useState({
    nom:"",
    prenom:"",
    email:"",
    password:"",
    departement_id: 0,
    group_id: 0,
    token:userData.token
  });
// const [dept,setDept]=useState({ departements:[],groups: []})
  const [departementsGroup, setDepartementsGroup] =
    departements_group_store.useStore();
  // const [password,setPassword]=useState("");
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <div style={styles.container} >
      <div style={styles.section}>
        <label style={styles.label}> nom:</label>
        <input
          style={styles.input}
          placeholder="nom"
          onChange={(e) => {
            setFormData({ ...formData, nom: e.target.value });
          }}
          value={formData.nom}
        />
           <label style={styles.label}> Prenom:</label>
        <input
          style={styles.input}
          placeholder="prenom"
          onChange={(e) => {
            setFormData({ ...formData, prenom: e.target.value });
          }}
          value={formData.prenom}
        />
           <label style={styles.label}> Email:</label>
        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
          }}
          value={formData.email}
        />
        <label style={styles.label}> Password:</label>
        <input
          style={styles.input}
          placeholder="Password"
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
          }}
          value={formData.password}
     
        />
      </div>
      <div style={styles.section}>
      <label style={styles.label}>Départements</label>
<select
  style={styles.select}
  onChange={(e) => {
    setFormData({ 
      ...formData, 
      departement_id: Number(e.target.value),
      // group_id: null,
    });
  }}
  // disabled={formData.group_id !== null}
>
  <option value="" hidden>
    Sélectionner une entité
  </option>
  {departementsGroup.departements.map((dep) => (
    <option key={dep.department_id} value={dep.department_id}>
      {dep.department_name}
    </option>
  ))}
</select>

<label style={styles.label}>Groupes</label>
<select
  style={styles.select}
  onChange={(e) => {
    setFormData({ 
      ...formData, 
      group_id: Number(e.target.value) ,
      // departement_id: null,
       // ✅ Convertir en Number
    });
  }}
  // disabled={formData.departement_id !== null} 
>
  <option value="" hidden>
    Sélectionner un groupe
  </option>
  {departementsGroup.departements
    .map((dep) => dep.groups)
    .flatMap((grps) =>
      grps.map((grp) => (
        <option key={grp.id} value={grp.id}>
          {grp.name}
        </option>
      ))
    )}
</select>
        <input type="submit" value="Submit" style={styles.submitButton}
        onClick={()=>{
          console.log('data',formData);
       
          AddUserApi(formData).then((response) => {
            console.log(response);
          }).catch((err) => {
            console.log(err);
          }); 
        }}
         />
      </div>
    
      </div>
  );
}
