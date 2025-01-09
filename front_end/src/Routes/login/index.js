import { useEffect, useState } from "react";
import { LoginApi } from "../../api/index";
import { User } from "../../data";
import { Store } from "react-data-stores";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = User.useStore();
  useEffect(() => {
    if (!userData.token) return;
  }, []); // Cette fonction est exécutée une seule fois après le premier rendu.
  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page.
    const [err, data] = await LoginApi(email, password);
    if (err) {
      setError(
        err?.response?.data?.message || "An error occurred during login"
      );
      setSuccess(null);
    } else {
      setSuccess("Login successful!");
      setError(null);
      console.log("User data:", data); // Traitez les données de l'utilisateur ici.
      localStorage.setItem("token", data.token);
      setUserData(data);
      Store.navigateTo("/");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Login
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
      )}
    </div>
  );
}
