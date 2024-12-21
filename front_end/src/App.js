import { useEffect, useState } from "react";
import "./App.css";
import { MyCalendar } from "./utils";
import { GetEvents } from "./api";
import { User } from "./data";

function App() {
  const [userData, setUserData] = User.useStore();
  const [data, setData] = useState([]);
  useEffect(() => {
    GetEvents(userData.token).then((res) => {
      console.log(res);
      if (res[0]) return console.error(res[0]);
    });
  }, []);
  return (
    <div className="App">
      <MyCalendar data={data} />
    </div>
  );
}

export default App;
