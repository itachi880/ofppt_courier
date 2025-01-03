import { Route, Routes } from "react-router-dom";
import AddCourier from "./AddCourier";
import UpdateCourrier from "./UpdateCourrier";
import ShowCourier from "./ShowCourier";

export default function () {
  return (
    <Routes>
      <Route index element={<ShowCourier />} />
      <Route path="add" element={<AddCourier />} />
      <Route path="update/:id" element={<UpdateCourrier />} />
    </Routes>
  );
}
