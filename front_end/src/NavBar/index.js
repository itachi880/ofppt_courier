import { Store } from "react-data-stores";
import "./index.css";
import { User } from "../data";
import { useEffect } from "react";

export default () => {
  const [userData, setUserData] = User.useStore();
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  if (!userData.token) return null;
  return (
    <div className="navbar-holder">
      <nav className="navbar">
        <div className="profile">
          <img src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1" alt="profile" />
          <span>
            first+last names
            <i
              className="fa-solid fa-arrow-right-from-bracket logout"
              onClick={() => {
                setUserData({ token: undefined });
                localStorage.removeItem("token");
                Store.navigateTo("/login");
              }}
            ></i>
          </span>
        </div>
        <div className="options">
          <button onClick={() => Store.navigateTo("/courrier")}>show events</button>
          <button onClick={() => Store.navigateTo("/courrier/add")}>AddCourier</button>
          <button onClick={() => Store.navigateTo("/forume/add")}>AddForum</button>
        </div>
      </nav>
    </div>
  );
};
