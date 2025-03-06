import ChartJs from "./chart";
import { getStatusAPI } from "../../api";
import { loading, User } from "../../data";
import { useEffect, useState } from "react";

export default function Chef_Dr() {
  const [userData, setUserData] = User.useStore();
  const [data, setData] = useState([]);
  const [Year, setYear] = useState(new Date().getFullYear()); // Utilisation de 'Year' comme nom de variable
  const [loadingFlag, setLoadingFlag] = loading.useStore();

  useEffect(() => {
    if (Year < 2000 || Year > new Date().getFullYear()) return;
    setLoadingFlag({ loading: true });
    getStatusAPI(userData.token, Year).then((e) => {
      if (e[0]) return setLoadingFlag({ loading: false });
      setData(e[1]);
      setLoadingFlag({ loading: false });
    });
  }, [Year, userData.token]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleYearSubmit = () => {
    setData([]);
  };

  return (
    <>
      <div
        className="Container"
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <input
          type="number"
          min="2000"
          max={new Date().getFullYear()}
          value={Year}
          onChange={handleYearChange}
          style={{
            border: "2px solid rgb(34 197 94)",
            width: "300px",
            borderRadius: "10px",
            padding: "10px",
            outline: "none",
          }}
        />
        <ChartJs datasets={data} />
      </div>
    </>
  );
}
