import React, { useEffect, useState } from "react";
import { departements_group_store, events } from "../../../data";
import { useParams } from "react-router-dom";
import { Store } from "react-data-stores";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "../../../api";

const DetailCourier = () => {
  const [eventsStore] = events.useStore();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departementsGroup] = departements_group_store.useStore();

  // Modal state to track image popup
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = eventsStore?.data?.find(
          (event) => event.id === parseInt(id)
        );
        if (!event) {
          Store.navigateTo("/");
          return;
        }
        setFormData({
          id: event.id,
          title: event.title,
          description: event.description,
          expiditeur: event.expiditeur,
          deadline: event.deadline || "N/A",
          state: event.state,
          critical: event.critical || false,
          created_at: event.created_at || "N/A",
          departements: event.departements || [],
          imgs: event.imgs || [],
          groups: event.groups || [],
          files: event.files || [],
        });
      } catch (err) {
        setError("Échec du chargement des détails de l'événement.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, eventsStore]);

  // Function to open modal with selected image
  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md pb-16">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Détails du Courrier
      </h1>

      <div className="grid gap-4">
        <div className="bg-gray-50 p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Titre :</h2>
          <p className="text-gray-700">{formData.title}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Description :</h2>
          <p className="text-gray-700">{formData.description}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Expéditeur :</h2>
          <p className="text-gray-700">{formData.expiditeur}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">Date Limite :</h2>
            <p className="text-gray-700">{formData.deadline}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">Statut :</h2>
            <p className="text-gray-700">{formData.state}</p>
          </div>
        </div>

       

        <div className="bg-gray-50 p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Entité :</h2>
          {formData.departements.length > 0 ? (
            <ul className="list-disc pl-6">
              {formData.departements.map((departement) =>
                departementsGroup.departements.map((dep, i) => {
                  if (dep.department_id === departement) {
                    return <li key={i}>{dep.department_name}</li>;
                  }
                  return null;
                })
              )}
            </ul>
          ) : (
            <p className="text-gray-700">Aucun entité assigné.</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Groupes :</h2>
          {formData.groups.length > 0 ? (
            <ul className="list-disc pl-6">
              {formData.groups.map((groupId) =>
                departementsGroup.groups.map((grp, i) => {
                  if (grp.id === groupId) {
                    return <li key={i}>{grp.name}</li>;
                  }
                  return null;
                })
              )}
            </ul>
          ) : (
            <p className="text-gray-700">Aucun groupe assigné.</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Créé le :</h2>
          <p className="text-gray-700">{formData.created_at}</p>
        </div>

        {formData.imgs.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">Images :</h2>
            <div className="grid grid-cols-2 gap-4">
              {formData.imgs.map((img, index) => (
                <img
                  key={index}
                  src={BASE_URL + "/" + img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto rounded-xl shadow-md cursor-pointer"
                  onClick={() => openModal(BASE_URL + "/" + img)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for image */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeModal} className="modal-close-btn">
              ✖
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailCourier;
