import { useState } from "react";
import { UpdateCourier } from "../../../api";

export default function ({ id, token, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    critical: false,
    departements: [],
    groups: [],
    created_at: "",
  });

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
    label: {
      fontWeight: "bold",
      marginBottom: "5px",
      display: "block",
    },
  };
  function updateCourrier() {
    UpdateCourier(formData);
  }
  return (
    <div style={styles.container}>
      <label style={styles.label}>Object Title</label>
      <input style={styles.input} placeholder="Object" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

      <label style={styles.label}>Departements</label>
      <select
        style={styles.select}
        value=""
        onChange={(e) => {
          if (!formData.departements.includes(e.target.value) && e.target.value) {
            setFormData({
              ...formData,
              departements: [...formData.departements, e.target.value],
            });
          }
        }}
      >
        <option value="">Select Departement</option>
        <option value="HR">HR</option>
        <option value="Finance">Finance</option>
        <option value="IT">IT</option>
      </select>

      <label style={styles.label}>Groups</label>
      <select
        style={styles.select}
        value=""
        onChange={(e) => {
          if (!formData.groups.includes(e.target.value) && e.target.value) {
            setFormData({
              ...formData,
              groups: [...formData.groups, e.target.value],
            });
          }
        }}
      >
        <option value="">Select Group</option>
        <option value="id1">Group A</option>
        <option value="id2">Group B</option>
        <option value="id3">Group C</option>
        <option value="all">toutes</option>
        <option value="none">aucun</option>
      </select>

      <label style={styles.label}>Description</label>
      <input style={styles.input} placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

      <label style={styles.label}>Deadline</label>
      <input style={styles.input} type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />

      <label style={styles.label}>Created At</label>
      <input style={styles.input} type="date" value={formData.created_at} onChange={(e) => setFormData({ ...formData, created_at: e.target.value })} />

      <input type="submit" value="Update" style={styles.submitButton} onClick={updateCourrier} />
    </div>
  );
}
