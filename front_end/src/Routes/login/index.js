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
  // Styles internes
  const styles = {
    container: {
      maxWidth: "480px",
      margin: "2rem auto",
      padding: "2.5rem",
      borderRadius: "16px",
      backgroundColor: "white",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    },
    title: {
      marginBottom: "1.5rem",
      color: "#1a1a1a",
      fontSize: "24px",
      fontWeight: "600",
    },
    inputGroup: {
      marginBottom: "1.25rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#404040",
      fontSize: "14px",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "0.875rem",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      backgroundColor: "#f8fafc",
      transition: "all 0.2s ease",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      ":focus": {
        borderColor: "#6366f1",
        boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
      },
    },
    button: {
      width: "100%",
      padding: "0.875rem",
      backgroundColor: "#6366f1",
      color: "white",
      fontWeight: "600",
      borderRadius: "8px",
      marginTop: "0.5rem",
      transition: "all 0.2s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      ":hover": {
        backgroundColor: "#4f46e5",
      },
      ":active": {
        transform: "scale(0.98)",
      },
    },
    error: {
      color: "#dc2626",
      marginTop: "1rem",
      padding: "0.75rem",
      backgroundColor: "#fef2f2",
      borderRadius: "8px",
      fontSize: "14px",
    },
    success: {
      color: "#16a34a",
      marginTop: "1rem",
      padding: "0.75rem",
      backgroundColor: "#f0fdf4",
      borderRadius: "8px",
      fontSize: "14px",
    },
  };

  return (
    <>
      <img
        src={require('../../assets/Logo_ofppt.png')}
        
        alt="enssup"
        style={{
          width: "100px",
          height: "100px",
          display: "block",
          margin: "0 auto",
        }}
      />
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
