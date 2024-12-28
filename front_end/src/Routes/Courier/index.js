import { Route, Routes } from "react-router-dom";
import AddCourier from "./AddCourier";
import UpdateCourrier from "./UpdateCourrier";
import ShowCourier from "./ShowCourier";

export default function () {
  return (
    <Routes>
      <Route index element={<ShowCourier />} />
      <Route path="add" element={<AddCourier />} />
      <Route path="update/:id" element={<UpdateCourrier />} />
    </Routes>
  );
}
/**
 * routes path /
 * rout home
 */
/**
 *  ajoute d'un courrier nom check  pour que la base de donne
 */

// const AddCourier = ({ onAdd }) => {
//   // Initial state
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     deadline: "",
//     critical: false,
//   });

//   const [error, setError] = useState("");

//   // Handle form changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!formData.title || !formData.description || !formData.deadline) {
//       setError("Veuillez remplir tous les champs obligatoires.");
//       return;
//     }

//     setError("");

//     // Call API or handle the form submission logic
//     if (onAdd) {
//       onAdd(formData); // Prop callback to handle the data
//     }

//     // Reset form after submission
//     setFormData({
//       title: "",
//       description: "",
//       deadline: "",
//       critical: false,
//     });
//   };

//   return (
//     <div style={{ maxWidth: "500px", margin: "auto" }}>
//       <h2>Ajouter un Courrier</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="title">Titre *</label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Entrez le titre"
//             maxLength="255"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="description">Description *</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Entrez la description"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="deadline">Date limite *</label>
//           <input
//             type="datetime-local"
//             id="deadline"
//             name="deadline"
//             value={formData.deadline}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="critical">Critique</label>
//           <input
//             type="checkbox"
//             id="critical"
//             name="critical"
//             checked={formData.critical}
//             onChange={handleChange}
//           />
//         </div>

//         <button type="submit">Ajouter</button>
//       </form>
//     </div>
//   );
// };

// export default AddCourier;
