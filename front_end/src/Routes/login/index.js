import { useEffect, useState } from "react";
import { LoginApi } from "../../api/index";
import { loading, User } from "../../data";
import { Store } from "react-data-stores";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = User.useStore();
  const [showPass, setShowPass] = useState(true);
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  useEffect(() => {
    if (!userData.token) return;
  }, []); // Exécutée une seule fois après le premier rendu.

  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page.
    setLoadingFlag({ loading: true });
    const [err, data] = await LoginApi(email, password);
    setLoadingFlag({ loading: false });
    if (err) {
      setError(
        err?.response?.data?.message || "An error occurred during login"
      );
      setSuccess(null);
    } else {
      setSuccess("Login successful!");
      setError(null);
      localStorage.setItem("token", data.token);
      setUserData(data);
      Store.navigateTo("/");
    }
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
      </form>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
    </div>
  );
}
