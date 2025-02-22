import { useEffect, useState } from "react";
import { departements_group_store, events, loading, User } from "../../../data";
import { BASE_URL, getCourierById, UpdateCourier } from "../../../api";
import { useParams } from "react-router-dom";
import {
  GreenBox,
  ImgsWithCancelIcon,
  RedBox,
  roles,
  useQuery,
} from "../../../utils";
import { Store } from "react-data-stores";
import Swal from "sweetalert2";

/**
 * @type {Record<string,import("react").CSSProperties>}
 */
const styles = {
  container: {
    width: window.innerWidth,
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
    boxSizing: "border-box",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
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
    width: "100%",
    maxWidth: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
  },
};

export default function () {
  const [eventsStore, setEventsStore] = events.useStore();
  const id = useParams().id;
  const [formData, setFormData] = useState({
    id: undefined,
    title: "",
    description: "",
    expiditeur: "",
    deadline: "",
    state: "",
    critical: false,
    departements: [],
    created_at: "",
    groups: [],
    imgs: [],
    files: [],
  });
  const [userData, setUserData] = User.useStore();
  const [departementsGroup, setDepartementsGroup] =
    departements_group_store.useStore();
  const searchQuery = useQuery();
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  useEffect(() => {
    if (userData.data.role != roles.admin) {
      Store.navigateTo("/courrier/detail/" + id);
      return;
    }
    if (
      userData.data.role == roles.admin &&
      (userData.data.departement_id || userData.data.group_id)
    ) {
      Store.navigateTo("/courrier/validate/" + id);
      return;
    }
    const event = eventsStore.data.find((event) => event.id == id);

    if (!event) {
      if (!userData.token) return;
      getCourierById(id, userData.token).then((res) => {
        if (res[0]) return Store.navigateTo("/");

        res[1][0].deadline = res[1][0].deadline.split("T")[0];
        setFormData({
          id: id,
          title: res[1][0].title,
          description: res[1][0].description,
          expiditeur: res[1][0].expiditeur,
          deadline: res[1][0].deadline || "",
          state: res[1][0].state,
          critical: res[1][0].critical || "",
          created_at: res[1][0].created_at || "",
          departements: res[1][0].departements || [],
          imgs: res[1][0].imgs,
          groups: res[1][0].groups || [],
          files: [],
          is_validated: res[1][0].is_validated || 0,
          result_validation: res[1][0].result_validation || "no result",
        });
        setEventsStore({ data: [...eventsStore.data, res[1][0]] });
      });

      return;
    }
    setFormData({
      id: id,
      title: event.title,
      description: event.description,
      expiditeur: event.expiditeur,
      deadline: event.deadline || "",
      state: event.state,
      critical: event.critical || "",
      created_at: event.created_at || "",
      departements: event.departements || [],
      imgs: event.imgs,
      groups: event.groups || [],
      files: [],
      is_validated: event.is_validated || 0,
      result_validation: event.result_validation || "no result",
    });
  }, [userData]);

  return (
    <div style={styles.container}>
      <div style={styles.section}>
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
          <span style={{ display: "flex", gap: "5px" }}>
            <RedBox>Entité</RedBox>
            <GreenBox>groupes</GreenBox>
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
                  {depObj?.department_name}
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
                  {grpObj?.name}
                </GreenBox>
              );
            })}
          </div>
        </div>
        <label style={styles.label}>Entité</label>
        <select
          style={styles.select}
          onChange={(e) => {
            if (formData.departements.includes(+e.target.value)) return;
            formData.departements.push(+e.target.value);
            setFormData({ ...formData });
          }}
        >
          <option value="" hidden>
            selectioné un Entité
          </option>
          {departementsGroup.departements.map((dep) => (
            <option value={dep.department_id}>{dep.department_name}</option>
          ))}
        </select>

        <label style={styles.label}>Groupes</label>
        <select
          style={styles.select}
          onChange={(e) => {
            if (formData.groups.includes(+e.target.value)) return;
            formData.groups.push(+e.target.value);
            setFormData({ ...formData });
          }}
        >
          <option value="" hidden>
            selectioné un Groupe
          </option>
          {departementsGroup.departements
            .map((dep) => dep.groups)
            .flatMap((grps) =>
              grps.map((grp) => <option value={grp.id}>{grp.name}</option>)
            )}
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
        <label style={styles.label}>Courier result :</label>
        <textarea
          disabled
          style={{ ...styles.input, resize: "none" }}
          value={formData?.result_validation ?? "N/A"}
        ></textarea>
      </div>
      <div style={styles.section}>
        <label style={styles.label}>Expéditeur</label>
        <input
          style={styles.input}
          onChange={(e) => {
            setFormData({ ...formData, expiditeur: e.target.value });
          }}
          value={formData.expiditeur}
          placeholder="Expéditeur..."
        />
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
              {formData.files.length} Fichiers selected
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
            {formData.imgs.map((img) => (
              <ImgsWithCancelIcon
                src={BASE_URL.link + "/" + img}
                Xclick={() => {
                  formData.imgs = formData.imgs.filter(
                    (imgItem) => imgItem == img
                  );
                }}
                imgClick={() => window.open(BASE_URL.link + "/" + img)}
              />
            ))}
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
                      setFormData({ ...formData, state: "" });
                    }
                  }}
                />
                <label htmlFor={state} style={{ marginLeft: "10px" }}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}{" "}
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
            value={formData.created_at.split("T")[0]}
          />
        </div>{" "}
      </div>{" "}
      <input
        type="submit"
        value="Update"
        style={styles.submitButton}
        onClick={async () => {
          console.log(formData);
          setLoadingFlag({ loading: true });
          const formDataToSend = new FormData();
          formDataToSend.append("title", formData.title);
          formDataToSend.append("description", formData.description);
          formDataToSend.append("id", formData.id);
          formDataToSend.append("state", formData.state);
          formDataToSend.append("created_at", formData.created_at);
          formDataToSend.append("deadline", formData.deadline);
          formDataToSend.append("critical", formData.critical);
          formDataToSend.append("expiditeur", formData.expiditeur);
          formDataToSend.append("token", userData.token);

          formDataToSend.append(
            "deleted_imgs",
            JSON.stringify({
              imgs: eventsStore.data
                .find((event) => event.id == formData.id)
                .imgs.filter((img) => !formData.imgs.includes(img)),
            })
          );
          if (formData.files.length > 0)
            Array.from(formData.files).forEach((file) => {
              formDataToSend.append("files", file);
            });
          const result = await UpdateCourier(
            formDataToSend,
            formData.departements,
            formData.groups
          );
          if (result[0])
            return (
              Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to Update courier. Please try again.",
              }) && setLoadingFlag({ loading: false })
            );
          console.log("result", result);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Courier Update successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          const index = eventsStore.data.findIndex((e) => e.id == formData.id);
          if (index == -1) {
            eventsStore.data.push(formData);
            setEventsStore({ data: [...eventsStore.data] });
            setLoadingFlag({ loading: false });
            Store.navigateTo("/");
            return;
          }
          //*else
          eventsStore.data[index] = {
            ...formData,
            id: +formData.id,
            imgs: formData.imgs, //! na9shom les image jdad
            groups: formData.groups,
            is_courier: +!searchQuery("event"), // '!' means invert if event make it is courier false + for convert to number if false 0
          };
          setEventsStore({ data: [...eventsStore.data] });
          setLoadingFlag({ loading: false });
          Store.navigateTo("/");
        }}
      />
    </div>
  );
}
