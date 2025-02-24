import { useState } from "react";
import { resetPasswordAPI } from "../../api";
import { useSearchParams } from "react-router-dom";

export default function ResetPass() {
  const token = useSearchParams()[0].get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const res = await resetPasswordAPI(password, token);
    if (res[0]) return setMessage("Error resetting password");

    setMessage(res[1]);
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Reset Password
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p className="text-center text-sm mt-3 text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
