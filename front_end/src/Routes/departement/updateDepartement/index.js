import { useState } from "react";
import { updateDepartment } from "../../../api"; // Assurez-vous que cette fonction existe dans vos APIs.
import { User } from "../../../data";

export default function UpdateDepartment({ department, onUpdate }) {
  const [name, setName] = useState(department.department_name);
  const [loading, setLoading] = useState(false);
  const [userData] = User.useStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateDepartment(userData.token, department.department_id, { name })
      .then(() => {
        onUpdate();
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h1>Update Department</h1>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
}
