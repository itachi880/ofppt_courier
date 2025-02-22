import { useState } from "react";
import { User, departements_group_store, loading } from "../../../data";
import { AddDepartment } from "../../../api";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function AddDepartmentComponent() {
  const [formData, setFormData] = useState({
    name: "",
    token: "",
  });
  const [DepartementsGroupStore, setDepartementsGroupStore] =
    departements_group_store.useStore();

  const [userData, setUserData] = User.useStore();
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 w-full max-w-md bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Ajouter une Entité
        </h2>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Nom de l'Entité
        </label>
        <input
          type="text"
          placeholder="Nom de l'Entité"
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
          value={formData.name}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <button
          onClick={() => {
            setLoadingFlag({ loading: true });
            const departmentData = {
              name: formData.name,
              token: userData.token,
            };

            AddDepartment(departmentData).then((res) => {
              if (res[0]) return setLoadingFlag({ loading: false });
              setDepartementsGroupStore({
                departements: [
                  ...DepartementsGroupStore.departements,
                  {
                    department_name: departmentData.name,
                    groups: [],
                    department_id: res[1].data,
                  },
                ],
              });
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: "L'entité a été ajoutée avec succès.",
              });
              setLoadingFlag({ loading: false });
            });
          }}
          className="w-full py-3 bg-green-100 text-green-600 font-semibold rounded-md "
          // hover:bg-green-500  focus:outline-none focus:ring-2 focus:ring-blue-500
              //  className="bg-green-100 text-green-600 font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Ajouter Entite
        </button>
      </div>
    </div>
  );
}
