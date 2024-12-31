import { useEffect, useState } from "react";
import { departements_group_store, User } from "../../../data";
import { AddCourier } from "../../../api";
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
export default function () {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    state: "",
    critical: false,
    departements: [
      // { id: 1, name: "departement 1", groups: [{ id: 1, name: "group 1" }] },
      // { id: 2, name: "departement 2", groups: [{ id: 2, name: "group 2" }] },
    ],
    created_at: "",
  });
  const [userData, setUserData] = User.useStore();
  const [departementsGroup, setDepartementsGroup] =
    departements_group_store.useStore();

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
        value={formData.title}
      />
      <div style={{ margin: "10px 0" }}>
        <RedBox>departements</RedBox>
        <GreenBox>groups</GreenBox>
        <hr />
        {formData.departements?.map((dep) => (
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
          >
            <RedBox>{dep?.name}</RedBox>
            {dep.groups == "all" ? (
              <GreenBox>all</GreenBox>
            ) : dep.groups == "none" ? (
              <GreenBox>none</GreenBox>
            ) : (
              dep.groups?.map((grp) => <GreenBox>{grp.name}</GreenBox>)
            )}
          </div>
        ))}
      </div>
      <label style={styles.label}>Departements</label>
      <select
        style={styles.select}
        onChange={(e) => {
          if (formData.departements.find((dep) => dep.id == e.target.value))
            return;

          formData.departements.push({
            id: e.target.value,
            name: departementsGroup.departements.find(
              (dep) => dep.id == e.target.value
            ).name,
            groups: [],
          });
          setFormData({ ...formData });
          e.target.nextSibling.nextSibling.value = "";
        }}
      >
        <option value="" hidden>
          Select Departement
        </option>

        {departementsGroup.departements.map((dep) => (
          <option value={dep.id}>{dep.name}</option>
        ))}
      </select>

      <label style={styles.label}>Groups</label>
      <select
        style={styles.select}
        onChange={(e) => {
          const grpId = e.target.value;
          const dep =
            departementsGroup.departements.find((dep) =>
              dep.groups.find((grp) => grp.id == grpId)
            ) ??
            departementsGroup.departements.find(
              (dep) => dep.id == e.target.previousSibling.previousSibling.value
            );
          const depIndex = formData.departements.findIndex(
            (e) => e.id == dep.id
          );
          if (depIndex == -1) return;
          if (e.target.value == "all") {
            formData.departements[depIndex].groups = "all";
          } else if (e.target.value == "none") {
            formData.departements[depIndex].groups = [];
          } else {
            if (!formData.departements[depIndex].groups.push)
              formData.departements[depIndex].groups = [];
            if (
              formData.departements[depIndex].groups.find(
                (grp) => grp.id == grpId
              )
            )
              return;
            formData.departements[depIndex].groups.push(
              dep.groups.find((grp) => grp.id == grpId)
            );
          }
          setFormData({ ...formData });
          console.log(formData);
        }}
      >
        <option value="" hidden>
          Select Group
        </option>
        {departementsGroup.departements
          .filter((dep) => formData.departements.find((e) => e.id == dep.id))
          .map((deps) =>
            deps.groups.map((group) => (
              <option value={group.id}>{group.name}</option>
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
      <label style={styles.label}>State</label>
      <div>
        {["normal", "urgent", "tres urgent"].map((state) => (
          <div key={state} style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              value={state}
              checked={formData.state === state}
              onChange={(e) => {
                if (e.target.checked) {
                  setFormData({ ...formData, state: e.target.value });
                } else {
                  setFormData({ ...formData, state: "" }); // Décocher réinitialise à vide
                }
              }}
            />
            <label htmlFor={state} style={{ marginLeft: "10px" }}>
              {state.charAt(0).toUpperCase() + state.slice(1)}{" "}
              {/* Capitalisation */}
            </label>
          </div>
        ))}
      </div>

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
          const formDataToSend = new FormData();
          formDataToSend.append("token", userData.token);
          formDataToSend.append("titel", formData.title);
          formDataToSend.append("description", formData.description);
          formDataToSend.append("state", formData.state);
          formDataToSend.append("deadline", formData.deadline);
          formDataToSend.append("critical", formData.critical);
          formDataToSend.append("created_at", formData.created_at);
          if (formData.images) {
            Array.from(formData.images).forEach((image) => {
              formDataToSend.append("files", image);
            });
          }
          console.log(formDataToSend);
          AddCourier(formDataToSend, formData.departements)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.error("Upload failed:", err);
            });
        }}
      />
    </div>
  );
}
