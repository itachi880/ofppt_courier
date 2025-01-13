import { Route, Routes } from "react-router-dom";
import Home from "./ShowHome/index";

export default function () {
  return (
    <Routes>
      <Route index element={<Home />} />
    </Routes>
  );
}
