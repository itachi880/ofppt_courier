import { useEffect, useState } from "react";
import { departements_group_store, User } from "../../../data/index";
import { AddGroupApi } from "../../../api";

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

export default function AddGroup() {
  const [userData, setUserData] = User.useStore();
    const [departementsGroups, setDepartmentsGroups] = departements_group_store.useStore();
  const [formData, setFormData] = useState({
    name: "",
    token: userData.token,
    id:0
  });



  useEffect(() => {
    console.log(departementsGroups);
  }, [formData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="p-6 w-full max-w-md bg-white shadow-md rounded-md">
    <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
    <input
      type="text"
      placeholder="Enter Group Name"
      onChange={(e) => {
        setFormData({ ...formData, name: e.target.value });
      }}
      value={formData.name}
      className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Department</label>
    <select
      onChange={(e) => {
        setFormData({ ...formData, DepartementAssign: e.target.value });
      }}
      className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option>Select Department</option>
      {departementsGroups.departements.map((e, i) => (
        <option
          key={i}
          value={e.department_id}
          onClick={() => {
            setFormData({ ...formData, id: e.department_id });
          }}
        >
          {e.department_name}
        </option>
      ))}
    </select>

    <input
      type="submit"
      value="Add Group"
      onClick={() => {
        const departmentData = {
          name: formData.name,
          department_id: formData.DepartementAssign,
          token: formData.token,
        };

        AddGroupApi(departmentData)
          .then((res) => {
            console.log("Group added successfully:", res);
          })
          .catch((err) => {
            console.error("Failed to add department:", err);
          });
      }}
      className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>

  );
}
