import { useEffect, useState } from "react";
import { GreenBox, ImgsWithCancelIcon, RedBox, roles } from "../../../utils";
import { departements_group_store, events, loading, User } from "../../../data";
import { Store } from "react-data-stores";
import { useParams } from "react-router-dom";
import { BASE_URL, getCourierById, validateCourier } from "../../../api";
import Swal from "sweetalert2";

/**
 * @type {Record<keyof styles,import("react").CSSProperties}
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
  const id = useParams().id || 53;
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
    is_validated: 0,
    imgs: [],
    validation_result: "",
  });
  const [userData, setUserData] = User.useStore();
  const [departementsGroup, setDepartementsGroup] =
    departements_group_store.useStore();
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  useEffect(() => {
    if (userData.data.role != roles.admin) {
      Store.navigateTo("/courrier/detail/" + id);
      return;
    }
    const event = eventsStore.data.find((event) => event.id == id);

    if (!event)
      return getCourierById(id, userData.token).then((res) => {
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
          is_validated: res[1][0].is_validated || 0,
          validation_result: "",
        });
        setEventsStore({ data: [...eventsStore.data, res[1][0]] });
      });
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
      is_validated: event.is_validated || 0,
      validation_result: event.validation_result || "",
    });
  }, []);
  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <label style={styles.label}>Object Title</label>
        <input
          style={styles.input}
          placeholder="Object"
          disabled
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
              return <RedBox>{depObj?.department_name}</RedBox>;
            })}
            {formData.groups.map((grp) => {
              const grpObj = departementsGroup.groups.find(
                (group) => group.id == grp
              );
              return <GreenBox>{grpObj?.name}</GreenBox>;
            })}
          </div>
        </div>

        <label style={styles.label}>Description</label>
        <input
          style={styles.input}
          disabled
          value={formData.description}
          placeholder="no description"
        />
        <label style={styles.label}>Validation</label>
        <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <label htmlFor="oui">Validé</label>
            <input
              type="radio"
              value={1}
              checked={formData.is_validated == 1}
              onClick={() => setFormData({ ...formData, is_validated: 1 })}
              name="is_validated"
              id="oui"
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <label htmlFor="pas">pas validé</label>
            <input
              type="radio"
              name="is_validated"
              checked={formData.is_validated == 0}
              onClick={() => setFormData({ ...formData, is_validated: 0 })}
              value={0}
              id="pas"
            />
          </div>
        </div>
        <label style={styles.label}>Validation result</label>
        <textarea
          value={formData.validation_result}
          onChange={(e) => {
            setFormData({ ...formData, validation_result: e.target.value });
          }}
          placeholder="Validation result..."
          style={{ ...styles.input, resize: "none" }}
        ></textarea>
      </div>
      <div style={styles.section}>
        <label style={styles.label}>Expéditeur</label>
        <input
          style={styles.input}
          disabled
          value={formData.expiditeur}
          placeholder="Uknown"
        />
        <div style={styles.section}>
          <label style={styles.label}>Uploaded Fichiers</label>
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
              {formData.imgs.length} Fichiers selectioné
            </div>
            {formData.imgs.map((img) => (
              <ImgsWithCancelIcon
                src={BASE_URL.link + "/" + img}
                imgClick={() => window.open(BASE_URL.link + "/" + img)}
              />
            ))}
          </div>
          <label style={styles.label}>Deadline</label>
          <input
            style={styles.input}
            type="date"
            disabled
            value={formData?.deadline}
          />
          <label style={styles?.label}>State</label>
          <div>
            {["normal", "urgent", "tres urgent"].map((state) => (
              <div key={state} style={{ marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  value={state}
                  checked={formData?.state === state}
                  disabled
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
            disabled
            value={formData.created_at.split("T")[0]}
          />
        </div>{" "}
      </div>
      <input
        type="submit"
        value="Validate"
        style={styles.submitButton}
        onClick={async () => {
          console.log(formData);
          setLoadingFlag({ loading: true });
          const result = await validateCourier(
            formData.id,
            userData.token,
            formData.is_validated,
            formData.validation_result
          );
          if (result[0])
            return (
              Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to Update courier. Please try again.",
              }) && setLoadingFlag({ loading: false })
            );
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Courier Update successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          setLoadingFlag({ loading: false });
        }}
      />
    </div>
  );
}
