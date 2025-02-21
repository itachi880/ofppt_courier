import { useRef } from "react";
import { UpdateDepartementApi } from "../../../api";
import { departements_group_store, loading, User } from "../../../data";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2";

export default function UpdateDepartment() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [userData, setUserData] = User.useStore();
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  const [departements, setDepartements] = departements_group_store.useStore();
  const in1 = useRef();

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px", // Increased gap
      padding: "30px", // Increased padding
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)", // Softer shadow
      backgroundColor: "#fff", // White background
      maxWidth: "450px", // Slightly wider
      margin: "50px auto", // Centered with top/bottom margin
      // Removed absolute positioning
    },
    title: {
      // Style for the title
      fontSize: "24px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "12px", // Increased padding
      borderRadius: "8px", // More rounded corners
      border: "1px solid #ccc",
      fontSize: "16px",
      outline: "none",
      transition: "border-color 0.3s",
      "&:focus": {
        borderColor: "#007bff", // Blue border on focus
        boxShadow: "0 0 5px rgba(0, 123, 255, 0.2)", // Subtle shadow on focus
      },
    },
    button: {
      padding: "12px 25px", // Increased padding
      borderRadius: "8px", // More rounded corners
      border: "none",
      backgroundColor: "#007BFF",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "500", // Slightly bolder
      cursor: "pointer",
      transition: "background-color 0.3s, transform 0.2s",
      "&:hover": {
        backgroundColor: "#0056b3", // Darker blue on hover
      },
    },
  };

  const handleUpdate = () => {
    setLoadingFlag({ loading: true });
    UpdateDepartementApi(userData.token, id, in1.current.value)
      .then((response) => {
        if (response[0]) {
          console.log("Error updating department:", response[0]);
          setLoadingFlag({ loading: false });
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to update department.",
          });
          return;
        }

        const index = departements.departements.findIndex(
          (e) => e.department_id == id
        );

        if (index < 0) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Department not found.",
          });
          return;
        }

        departements.departements[index].department_name = in1.current.value;
        setDepartements({ departements: [...departements.departements] });
        setLoadingFlag({ loading: false });

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Department updated successfully.",
        }).then(() => {
          navigate("/departement"); // Redirect after successful update
        });
      })
      .catch((error) => {
        console.error("Error updating department:", error);
        setLoadingFlag({ loading: false });
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "An error occurred during update.",
        });
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Update Entité </h2> {/* Added title */}
      <input style={styles.input} placeholder="Enter new name" ref={in1} />
      <button style={styles.button} onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
}
