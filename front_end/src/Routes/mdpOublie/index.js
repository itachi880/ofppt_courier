import { useRef } from "react";
import { GetForgetPassLinkAPI } from "../../api";
export function ReseteMDP() {
  const email = useRef();
  return (
    <div className="grid place-items-center h-screen bg-gray-100">
      <div className="bg-white p-5 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            console.log(await GetForgetPassLinkAPI(email.current.value));
          }}
        >
          <input
            type="email"
            placeholder="Email"
            ref={email}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
