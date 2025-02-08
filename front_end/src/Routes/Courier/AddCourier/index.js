import { useEffect, useRef, useState } from "react";
import { departements_group_store, User, documentType } from "../../../data";
import { AddCourier } from "../../../api";
import { GreenBox, ImgsWithCancelIcon, RedBox, useQuery } from "../../../utils";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

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
    alignItems: "start",
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
    marginBottom: "16px",
    width: "100%",
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
export default function () {
  // const is_event = useSearchParams();
  // console.log(is_event);

  const today = new Date();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expiditeur: "",
    deadline: today.toISOString().split("T")[0],
    state: "",
    critical: false,
    departements: [],
    created_at: today.toISOString().split("T")[0],
    imgs: [],
    groups: [],
    type: useQuery()(documentType.event)
      ? documentType.event
      : documentType.courier,
    files: [],
  });
  const [userData, setUserData] = User.useStore();
  const [departementsGroup, setDepartementsGroup] =
    departements_group_store.useStore();

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div style={styles.container} className="container mx-auto pb-32">
      <div style={styles.section}>
        <label style={styles.label}>Object Titre</label>
        <input
          style={styles.input}
          placeholder="Object"
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
          }}
          value={formData.title}
        />
        <div style={{ margin: "10px 0" }}>
          <span style={{ display: "flex", gap: "5px" }}>
            <RedBox>departements</RedBox>
            <GreenBox>groups</GreenBox>
          </span>
          <hr style={{ margin: "5px 0" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0",
              gap: "5px",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {formData.departements.map((dep) => {
              const depObj = departementsGroup.departements.find(
                (departement) => departement.department_id == dep
              );
              return (
                <RedBox
                  onClick={() => {
                    formData.departements = formData.departements.filter(
                      (departement) => departement != dep
                    );
                    setFormData({
                      ...formData,
                    });
                  }}
                >
                  {depObj.department_name}
                </RedBox>
              );
            })}
            {formData.groups.map((grp) => {
              const grpObj = departementsGroup.groups.find(
                (group) => group.id == grp
              );
              return (
                <GreenBox
                  onClick={() => {
                    formData.groups = formData.groups.filter(
                      (group) => group != grp
                    );
                    setFormData({
                      ...formData,
                    });
                  }}
                >
                  {grpObj.name}
                </GreenBox>
              );
            })}
          </div>
        </div>
        <label style={styles.label}>Entité</label>
        <select
          style={styles.select}
          onChange={(e) => {
            console.log("selected dep", e.target.value);
            if (formData.departements.includes(+e.target.value)) return;
            formData.departements.push(+e.target.value);
            setFormData({ ...formData });
            e.target.nextElementSibling.nextElementSibling.value = "";
          }}
        >
          <option value="" hidden>
            Select entité
          </option>

          {departementsGroup.departements.map((dep) => (
            <option value={dep.department_id}>{dep.department_name}</option>
          ))}
        </select>

        <label style={styles.label}>Groups</label>
        <select
          style={styles.select}
          onChange={(e) => {
            if (formData.groups.includes(+e.target.value)) return;
            formData.groups.push(+e.target.value);
            setFormData({ ...formData });
          }}
        >
          <option value="" hidden>
            Select Group
          </option>
          {departementsGroup.departements
            .map((dep) => dep.groups)
            .flatMap((grps) =>
              grps.map((grp) => <option value={grp.id}>{grp.name}</option>)
            )}
        </select>

        <label style={styles.label}>Expiditeur</label>
        <input
          style={styles.input}
          onChange={(e) => {
            setFormData({ ...formData, expiditeur: e.target.value });
          }}
          value={formData.expiditeur}
          placeholder="Expiditeur"
        />
        <label style={styles.label}>Description</label>
        <input
          style={styles.input}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
          }}
          value={formData.description}
          placeholder="Description"
        />
      </div>
      <div style={styles.section}>
        <label style={styles.label}>Upload Fichiers</label>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            gap: "10px",
            margin: "10px 0px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#a3ffc688",
              border: "1px solid #a3ffc688",
              color: "#00b345",
              borderRadius: "20px",
              padding: "5px 10px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {formData.files.length} images selectionner
            <button
              style={{
                background: "#00b345",
                border: "1px solid #00b345",
                color: "white",
                fontSize: "18px",
                borderRadius: "50%",
                cursor: "pointer",
                aspectRatio: "1",
                width: "28px",
              }}
              onClick={() => {
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.multiple = true;
                fileInput.onchange = (e) => {
                  setFormData({ ...formData, files: e.target.files });
                };
                fileInput.click();
              }}
            >
              +
            </button>
          </div>
          {Array.from(formData.files).map((file, fileIndex) => {
            const src = URL.createObjectURL(file);
            return (
              <ImgsWithCancelIcon
                src={src}
                imgClick={() => {
                  const link = document.createElement("a");
                  link.href = src;
                  link.target = "_blank";
                  link.click();
                }}
                Xclick={() => {
                  const dataTransfer = new DataTransfer();
                  // Keep all files except the second one (index 1)
                  Array.from(formData.files).forEach((file, index) => {
                    if (index !== fileIndex) dataTransfer.items.add(file);
                  });
                  setFormData({ ...formData, files: dataTransfer.files });
                }}
              />
            );
          })}
        </div>
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
      </div>{" "}
      <input
        type="submit"
        value="Send"
        style={styles.submitButton}
        onClick={() => {
          const formDataToSend = new FormData();
          formDataToSend.append("token", userData.token);
          formDataToSend.append("titel", formData.title);
          formDataToSend.append("description", formData.description);
          formDataToSend.append("expiditeur", formData.expiditeur);
          formDataToSend.append("state", formData.state);
          formDataToSend.append("deadline", formData.deadline);
          formDataToSend.append("type", formData.type);
          formDataToSend.append("critical", formData.critical);
          formDataToSend.append("created_at", formData.created_at);
          if (formData.files) {
            Array.from(formData.files).forEach((file) => {
              formDataToSend.append("files", file);
            });
          }

          AddCourier(formDataToSend, formData.departements, formData.groups)
            .then((res) => {
              if (res[0])
                return Swal.fire({
                  icon: "error",
                  title: "Error!",
                  text: "Failed to add courier. Please try again.",
                });
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Courier added successfully!",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.href = "/";
              });
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to add courier. Please try again.",
              });
              console.error("Upload failed:", err);
            });
        }}
      />
    </div>
  );
}
