import { useEffect, useState } from "react";
import { User } from "../../../data";
import { AddDepartment } from "../../../api";

export default function AddDepartmentComponent() {
  const [formData, setFormData] = useState({
    name: "",
    token: "",
  });

  const [userData, setUserData] = User.useStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 w-full max-w-md bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Add Department
        </h2>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Department Name
        </label>
        <input
          type="text"
          placeholder="Enter Department Name"
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
          value={formData.name}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <button
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
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Department
        </button>
      </div>
    </div>
  );
}
