import { useEffect, useRef, useState } from "react";
import {
  departements_group_store,
  loading,
  User,
  usersStore,
} from "../../../data";
import { GreenBox, RedBox } from "../../../utils";
import { AddUserApi } from "../../../api";
import Swal from "sweetalert2";
import { Store } from "react-data-stores";

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
export function AddUsers() {
  const [userData] = User.useStore();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    departement_id: 0,
    group_id: 0,
    token: userData.token,
    role: "user",
  });
  const [usersData, setUsersData] = usersStore.useStore();
  const [departementsGroup] = departements_group_store.useStore();
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  const handleSubmit = () => {
    setLoadingFlag({ loading: true });
    AddUserApi(formData)
      .then((response) => {
        if (response[0])
          return (
            setLoadingFlag({ loading: false }) &&
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: `Server returned an error: ${response.status} - ${
                response.statusText || "Unknown Error"
              }`, // Display specific error message
            })
          );
        // else
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User added successfully!",
        });
        setUsersData({
          data: [...usersData.data, { ...formData, id: response[1] }],
        });
        setLoadingFlag({ loading: false });
        Store.navigateTo("/utilisateur/afficheUsers");
      })
      .catch((error) => {
        console.error("API Error:", error); // Log the error object
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "An error occurred while communicating with the server.",
        });
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <label style={styles.label}>Nom:</label>
        <input
          style={styles.input}
          placeholder="Nom"
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          value={formData.nom}
          required
        />
        <label style={styles.label}>Prénom:</label>
        <input
          style={styles.input}
          placeholder="Prénom"
          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          value={formData.prenom}
          required
        />
        <label style={styles.label}>Email:</label>
        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          value={formData.email}
          required
        />
        <label style={styles.label}>Password:</label>
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          value={formData.password}
          required
        />
      </div>
      <div style={styles.section}>
        <label style={styles.label}>Département:</label>
        <select
          style={styles.select}
          onChange={(e) =>
            setFormData({ ...formData, departement_id: Number(e.target.value) })
          }
          value={formData.departement_id}
          required
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

        <label style={styles.label}>Groupe:</label>
        <select
          style={styles.select}
          onChange={(e) =>
            setFormData({ ...formData, group_id: Number(e.target.value) })
          }
          value={formData.group_id}
          required
        >
          <option value="" hidden>
            Sélectionner un groupe
          </option>
          {departementsGroup.departements
            .flatMap((dep) => dep.groups)
            .map((grp) => (
              <option key={grp.id} value={grp.id}>
                {grp.name}
              </option>
            ))}
        </select>

        <button
          type="submit"
          style={styles.submitButton}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
