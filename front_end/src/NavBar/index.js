import { Store } from "react-data-stores";
import "./index.css";
import { User } from "../data";
import { useEffect } from "react";

export default () => {
  const [userData, setUserData] = User.useStore();
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  if (!userData.token || Object.keys(userData.data).length == 0) return null;
  return (
    <div className="navbar-holder fixed top-0 left-0 w-full bg-gray-800 shadow-md z-10">
      <nav className="flex items-center justify-between p-4 mx-auto max-w-7xl">
        {/* Profile Section (Left) */}
        <div className="flex items-center space-x-4">
          <img
            className="w-14 h-14 rounded-full border-2 border-indigo-500 shadow-md"
            src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
            alt="profile"
          />
          <span className="text-white text-lg font-semibold tracking-wide">
            {userData.data.first_name + " " + userData.data.last_name}
          </span>
        </div>

        {/* Navigation Buttons (Center) */}
        <div className="flex space-x-4">
          <button
            onClick={() => Store.navigateTo("/courrier")}
            className="bg-indigo-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-indigo-700 flex items-center space-x-2"
          >
            <i className="fa-solid fa-calendar-day"></i>
            <span>Show Events</span>
          </button>
          <button
            onClick={() => Store.navigateTo("/courrier/add")}
            className="bg-indigo-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-indigo-700 flex items-center space-x-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add Courier</span>
          </button>
          <button
            onClick={() => Store.navigateTo("/departement")}
            className="bg-indigo-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-indigo-700 flex items-center space-x-2"
          >
            <i className="fa-solid fa-building"></i>
            <span>Show Department</span>
          </button>
          <button
            onClick={() => Store.navigateTo("/departement/add")}
            className="bg-indigo-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-indigo-700 flex items-center space-x-2"
          >
            <i className="fa-solid fa-plus-circle"></i>
            <span>Add Department</span>
          </button>
          <button
            onClick={() => Store.navigateTo("/Group")}
            className="bg-indigo-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-indigo-700 flex items-center space-x-2"
          >
            <i className="fa-solid fa-users"></i>
            <span>Show Group</span>
          </button>
          <button
            onClick={() => Store.navigateTo("/Group/add")}
            className="bg-indigo-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-indigo-700 flex items-center space-x-2"
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>Add Group</span>
          </button>
        </div>

        {/* Logout Button (Right) */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setUserData({ token: undefined });
              localStorage.removeItem("token");
              Store.navigateTo("/login");
            }}
            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition duration-200 ease-in-out flex items-center justify-center"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-xl"></i>
          </button>
        </div>
      </nav>
    </div>
  );
};
