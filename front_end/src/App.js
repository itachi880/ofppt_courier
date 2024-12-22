import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { MyCalendar } from "./utils";
import { GetEvents } from "./api";
import { events, User } from "./data";
import { LoginForm } from "./Routes/login";

function App() {
  const [userData, setUserData] = User.useStore();
  const [CalendarEvents, setCalenderEvents] = events.useStore();
  useEffect(() => {
    GetEvents(userData.token).then((res) => {
      console.log(res);
      if (res[0]) return console.error(res[0]);
      console.log(res[1].data.map((item) => ({ date: item.deadline.split("T")[0], note: item.description })));
      setCalenderEvents({ data: res[1].data.map((item) => ({ date: item.deadline.split("T")[0], note: item.description })) });
    });
  }, []);
  return (
    <div className="App">
      {/* <MyCalendar />
      <LoginForm /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />}>
            {/* <Route path="/calendrie" element={<MyCalendar />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
////    <MyCalendar data={data} />
/// <LoginForm />
