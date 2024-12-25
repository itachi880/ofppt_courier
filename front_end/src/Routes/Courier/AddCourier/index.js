import { useEffect, useState } from "react";
import { departements_group_store } from "../../../data";

export default function () {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    critical: false,
    departements: [],
    groups: [],
    created_at: "",
  });
  const [departementsGroup, setDepartementsGroup] = departements_group_store.useStore();
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
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <div style={styles.container}>
      <label style={styles.label}>Object Title</label>
      <input
        style={styles.input}
        placeholder="Object"
        onChange={(e) => {
          setFormData({ ...formData, title: e.target.value });
        }}
      />

      <label style={styles.label}>Departements</label>
      <select
        style={styles.select}
        onChange={(e) => {
          if (formData.departements.includes(e.target.value)) return;
          formData.departements.push(e.target.value);
          setFormData({ ...formData });
        }}
      >
        <option value="" hidden>
          Select Departement
        </option>
        {departementsGroup.departements.map((dep) => (
          <option key={dep.id} value={dep.id}>
            {dep.name}
          </option>
        ))}
      </select>

      <label style={styles.label}>Groups</label>
      <select
        style={styles.select}
        onChange={(e) => {
          if (formData.groups.includes(e.target.value)) return;
          formData.groups.push(e.target.value);
          setFormData({ ...formData });
        }}
      >
        <option value="" hidden>
          Select Group
        </option>
        {departementsGroup.departements
          .filter((dep) => formData.departements.includes(dep.id + ""))
          .map((departements) =>
            departements.groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))
          )}
        <option value="all">toutes</option>
        <option value="none">aucun</option>
      </select>

      <label style={styles.label}>Description</label>
      <input
        style={styles.input}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
        }}
        value={formData.description}
        placeholder="Description"
      />

      <label style={styles.label}>Upload Images</label>
      <input
        type="file"
        style={styles.fileInput}
        multiple={true}
        onChange={(e) => {
          setFormData({ ...formData, images: e.target.files });
        }}
      />

      <label style={styles.label}>Deadline</label>
      <input
        style={styles.input}
        type="date"
        onChange={(e) => {
          setFormData({ ...formData, deadline: e.target.value });
        }}
        value={formData.deadline}
      />

      <label style={styles.label}>Created At</label>
      <input
        style={styles.input}
        type="date"
        onChange={(e) => {
          setFormData({ ...formData, created_at: e.target.value });
        }}
        value={formData.created_at}
      />

      <input
        type="submit"
        value="Send"
        style={styles.submitButton}
        onClick={() => {
          console.log(formData);
        }}
      />
    </div>
  );
}
