import { useEffect, useState } from "react";
import { departements_group_store, events } from "../../../data";
import { useParams } from "react-router-dom";
import { Store } from "react-data-stores";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "../../../api";
import { GreenBox, RedBox } from "../../../utils";

const DetailCourier = () => {
  const [eventsStore] = events.useStore();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departementsGroup] = departements_group_store.useStore();

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
          title: event.title || "Pas de titre",
          description: event.description || "Pas de description",
          expiditeur: event.expiditeur || "Non renseigné",
          deadline: event.deadline || "N/A",
          state: event.state || "Inconnu",
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

  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

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

      {formData ? (
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
              <div className="list-disc p-2 flex flex-wrap gap-1">
                {formData.departements.map((departement) =>
                  departementsGroup.departements.map((dep, i) => {
                    if (dep.department_id === departement) {
                      return <RedBox key={i}>{dep.department_name}</RedBox>;
                    }
                    return null;
                  })
                )}
              </div>
            ) : (
              <p className="text-gray-700">Aucun entité assigné.</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">Groupes :</h2>
            {formData.groups.length > 0 ? (
              <div className="list-disc p-2 flex flex-wrap gap-1">
                {formData.groups.map((groupId) =>
                  departementsGroup.groups.map((grp, i) => {
                    if (grp.id === groupId) {
                      return <GreenBox key={i}>{grp.name}</GreenBox>;
                    }
                    return null;
                  })
                )}
              </div>
            ) : (
              <p className="text-gray-700">Aucun groupe assigné.</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">Créé le :</h2>
            <p className="text-gray-700">
              {formData.created_at.split("T")[0] +
                " " +
                (formData.created_at.split("T")[1] ?? "").split(".")[0]}
            </p>
          </div>

          {formData.imgs.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <h2 className="text-lg font-semibold">Images :</h2>
              <div className="grid grid-cols-2 gap-4">
                {formData.imgs.map((img, index) => (
                  <img
                    key={index}
                    src={BASE_URL.link + "/" + img}
                    alt={`Image ${index + 1}`}
                    className="w-full h-auto rounded-xl shadow-md cursor-pointer"
                    onClick={() => openModal(BASE_URL.link + "/" + img)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-4">
          Aucun détail disponible pour ce courrier.
        </div>
      )}

      {showModal && selectedImage && (
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
