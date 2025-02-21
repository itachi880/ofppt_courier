import { useState } from "react";
import { getDepartements, getGroups, LoginApi } from "../../api/index";
import { departements_group_store, loading, User } from "../../data";
import { Store } from "react-data-stores";
import { useNavigate, useSearchParams } from "react-router-dom";
// import  logo from "../../../public/logo_ofppt.png";

export function LoginForm() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = User.useStore();
  const [showPass, setShowPass] = useState(true);
  const navigate = useNavigate();
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  const [departements_group, setDepartementsGroup] =
    departements_group_store.useStore();
  if (localStorage.getItem("token")) return null;
  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page.
    setLoadingFlag({ loading: true });
    const [err, data] = await LoginApi(email, password);
    setLoadingFlag({ loading: false });
    if (err) {
      setError(err?.response?.data || "An error occurred during login");
      setSuccess(null);
      return;
    }
    setLoadingFlag({ loading: true });

    const departementsRes = await getDepartements(data.token);
    if (departementsRes[0]) {
      setLoadingFlag({ loading: false });
      return console.log("Error getting departements", departementsRes[0]);
    }
    const groupsRes = await getGroups(data.token);
    if (groupsRes[0]) {
      setLoadingFlag({ loading: false });
      return console.log("Error getting groups", groupsRes[0]);
    }
    setDepartementsGroup({
      departements: departementsRes[1],
      groups: groupsRes[1],
    });
    setLoadingFlag({ loading: false });
    setUserData(data);
    localStorage.setItem("token", data.token);
    setSuccess("Login successful!");
    setError(null);
    Store.navigateTo(searchParams.get("path") || "/");
  };
  // Styles internes
  const styles = {
    container: {
      maxWidth: "400px",
      margin: "0 auto",
      padding: "20px",
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
    },
    title: {
      marginBottom: "20px",
      color: "#333",
    },
    inputGroup: {
      marginBottom: "15px",
      textAlign: "left",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginTop: "5px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      boxSizing: "border-box",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      fontWeight: "bold",
    },
    error: {
      color: "red",
      marginTop: "10px",
    },
    success: {
      color: "green",
      marginTop: "10px",
    },
  };

  return (
    <>
    <img src="../../../public/logo_ofppt.png" alt="enssup" style={{width: "100px", height: "100px", display: "block", margin: "0 auto"}}/>
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>
            Password:
          </label>
          <div style={styles.input}>
            <input
              type={showPass ? "password" : "text"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: "transparent",
                outline: "none",
                width: "92%",
              }}
              required
            />
            <i
              style={{ cursor: "pointer" }}
              className={"fa-solid fa-eye" + (showPass ? "-slash" : "")}
              onClick={() => setShowPass((prev) => !prev)}
            ></i>
          </div>
        </div>
        <input type="submit" style={styles.button} value={"Login"} />
        <br></br>
        <span
          onClick={() => {
            navigate("/resetPassword");
          }}
          className="text-blue-500 hover:underline mt-2 cursor-pointer transition duration-200 ease-in-out"
        >
          Mot de passe oublié ?
        </span>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
    </div>
    </>
  );
}
