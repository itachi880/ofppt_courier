import { useEffect, useState } from "react";
import { departements_group_store, User } from "../../../data";
import { AddCourier } from "../../../api";
import { GreenBox, RedBox } from "../../../utils";
/**
 * @type {Record<string,import("react").CSSProperties>}
 */
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
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="p-8 w-full max-w-4xl bg-white rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Left Side */}
    <div>
      <label className="block mb-2 font-semibold text-gray-700">Object Title</label>
      <input
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Object"
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        value={formData.title}
      />

      <label className="block mb-2 font-semibold text-gray-700">Departements</label>
      <select
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          if (formData.departements.find((dep) => dep.id == e.target.value)) return;

          formData.departements.push({
            id: e.target.value,
            name: departementsGroup.departements.find((dep) => dep.id == e.target.value).name,
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
          <option key={dep.id} value={dep.id}>
            {dep.name}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-semibold text-gray-700">Groups</label>
      <select
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          const grpId = e.target.value;
          const dep =
            departementsGroup.departements.find((dep) =>
              dep.groups.find((grp) => grp.id == grpId)
            ) ??
            departementsGroup.departements.find(
              (dep) => dep.id == e.target.previousSibling.previousSibling.value
            );
          const depIndex = formData.departements.findIndex((e) => e.id == dep.id);
          if (depIndex === -1) return;
          if (e.target.value === "all") {
            formData.departements[depIndex].groups = "all";
          } else if (e.target.value === "none") {
            formData.departements[depIndex].groups = [];
          } else {
            if (!formData.departements[depIndex].groups.push)
              formData.departements[depIndex].groups = [];
            if (formData.departements[depIndex].groups.find((grp) => grp.id == grpId))
              return;
            formData.departements[depIndex].groups.push(
              dep.groups.find((grp) => grp.id == grpId)
            );
          }
          setFormData({ ...formData });
        }}
      >
        <option value="" hidden>
          Select Group
        </option>
        {departementsGroup.departements
          .filter((dep) => formData.departements.find((e) => e.id == dep.id))
          .map((deps) =>
            deps.groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)
          )}
        <option value="all">All</option>
        <option value="none">None</option>
      </select>

      <label className="block mb-2 font-semibold text-gray-700">Description</label>
      <input
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        value={formData.description}
        placeholder="Description"
      />
    </div>

    {/* Right Side */}
    <div>
      <label className="block mb-2 font-semibold text-gray-700">Upload Images</label>
      <input
        type="file"
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        multiple={true}
        onChange={(e) => setFormData({ ...formData, images: e.target.files })}
      />

      <label className="block mb-2 font-semibold text-gray-700">Deadline</label>
      <input
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="date"
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        value={formData.deadline}
      />

      <label className="block mb-2 font-semibold text-gray-700">State</label>
      <div className="mb-4">
        {["normal", "urgent", "tres urgent"].map((state) => (
          <div key={state} className="flex items-center space-x-2 mb-2">
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
            <label className="text-gray-700 capitalize">{state}</label>
          </div>
        ))}
      </div>

      <label className="block mb-2 font-semibold text-gray-700">Created At</label>
      <input
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="date"
        onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
        value={formData.created_at}
      />

      <button
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
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
          AddCourier(formDataToSend, formData.departements)
            .then((res) => console.log(res))
            .catch((err) => console.error("Upload failed:", err));
        }}
      >
        Send
      </button>
    </div>
  </div>
</div>

  

  );
}
