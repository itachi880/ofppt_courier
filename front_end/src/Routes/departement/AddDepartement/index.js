import { useEffect, useState } from "react";
import { departements_store, User } from "../../../data";
import { AddDepartment } from "../../../api";
import { GreenBox, RedBox } from "../../../utils";

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
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

export default function AddDepartmentComponent() {
  const [formData, setFormData] = useState({
    name: "",
    parent_departement_id: "",
    created_at: "",
    updated_at: "",
  });

  const [userData, setUserData] = User.useStore();
  const [departements, setDepartements] = departements_store.useStore();

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div style={styles.container}>
      <label style={styles.label}>Department Name</label>
      <input
        style={styles.input}
        placeholder="Enter Department Name"
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
        }}
        value={formData.name}
      />

      <label style={styles.label}>Parent Department</label>
      <select
        style={styles.select}
        onChange={(e) => {
          setFormData({ ...formData, parent_departement_id: e.target.value });
        }}
        value={formData.parent_departement_id}
      >
        <option value="" hidden>
          Select Parent Department
        </option>
        {departements.map((dep) => (
          <option key={dep.id} value={dep.id}>
            {dep.name}
          </option>
        ))}
      </select>

      <label style={styles.label}>Created At</label>
      <input
        style={styles.input}
        type="date"
        onChange={(e) => {
          setFormData({ ...formData, created_at: e.target.value });
        }}
        value={formData.created_at}
      />

      <label style={styles.label}>Updated At</label>
      <input
        style={styles.input}
        type="date"
        onChange={(e) => {
          setFormData({ ...formData, updated_at: e.target.value });
        }}
        value={formData.updated_at}
      />

      <input
        type="submit"
        value="Add Department"
        style={styles.submitButton}
        onClick={() => {
          const departmentData = {
            name: formData.name,
            parent_departement_id: formData.parent_departement_id,
            created_at: formData.created_at,
            updated_at: formData.updated_at,
            token: userData.token,
          };

          AddDepartment(departmentData)
            .then((res) => {
              console.log("Department added successfully:", res);
            })
            .catch((err) => {
              console.error("Failed to add department:", err);
            });
        }}
      />
    </div>
  );
}
/**
 * mazal makamlax add departement
 */