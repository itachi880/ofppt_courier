import { useEffect, useState } from "react";
import { departements_group_store, User } from "../../../data";
import { AddDepartment } from "../../../api";
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

export default function AddDepartmentComponent() {
  const [formData, setFormData] = useState({
    name: "",
    token: "",
  });

  const [userData, setUserData] = User.useStore();

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

      <input
        type="submit"
        value="Add Department"
        style={styles.submitButton}
        onClick={() => {
          const departmentData = {
            name: formData.name,
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
