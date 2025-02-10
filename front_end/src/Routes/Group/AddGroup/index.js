import { useEffect, useState } from "react";
import { departements_group_store, loading, User } from "../../../data/index";
import { AddGroupApi } from "../../../api";
import Swal from "sweetalert2"; // Import SweetAlert2

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
  const [userData] = User.useStore();
  const [departementsGroups, setDepartementsGroup] =
    departements_group_store.useStore();
  const [formData, setFormData] = useState({
    name: "",
    token: userData.token,
    department_id: 0,
  });
  const [loadingFlag, setLoadingFlag] = loading.useStore();

  const handleSubmit = () => {
    const departmentData = {
      name: formData.name,
      department_id: formData.department_id,
      token: formData.token,
    };
    setLoadingFlag({ loading: true });
    AddGroupApi(departmentData)
      .then((res) => {
        if (res[0])
          return (
            setLoadingFlag({ loading: false }) &&
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Failed to add group. All input required.", // Improved error message
            })
          );

        const index = departementsGroups.departements.findIndex(
          (departement) =>
            departement.department_id == departmentData.department_id
        );
        if (index >= 0)
          departementsGroups.departements[index].groups.push({
            id: res[1],
            name: departmentData.name,
          });
        setDepartementsGroup({
          groups: [
            ...departementsGroups.groups,
            { name: departmentData.name, id: res[1] },
          ],
          departements: [...departementsGroups.departements],
        });
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Group added successfully!",
        });
        setLoadingFlag({ loading: false });
      })
      .catch((err) => {
        console.error("Failed to add group:", err);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to add group. Please check the form data and try again.", // Improved error message
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 w-full max-w-md bg-white shadow-md rounded-md">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Group Name
        </label>
        <input
          type="text"
          placeholder="Enter Group Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required // Add required attribute for validation
        />

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Assign Department
        </label>
        <select
          onChange={(e) =>
            setFormData({ ...formData, department_id: Number(e.target.value) })
          } // Corrected key
          value={formData.department_id} // Make it controlled
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required // Add required attribute
        >
          <option value="" hidden>
            Select Department
          </option>{" "}
          {/* Hidden placeholder option */}
          {departementsGroups.departements.map((e) => (
            <option key={e.department_id} value={e.department_id}>
              {" "}
              {/* Use department_id as key */}
              {e.department_name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          onClick={handleSubmit} // Call handleSubmit
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Group
        </button>
      </div>
    </div>
  );
}
