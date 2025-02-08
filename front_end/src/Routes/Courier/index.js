import { Route, Routes } from "react-router-dom";
import AddCourier from "./AddCourier";
import UpdateCourrier from "./UpdateCourrier";
import ShowCourier from "./ShowCourier";
import DetailCourier from "./DetailCourier/DetailCourier";

export default function () {
  return (
    <Routes>
      <Route index element={<ShowCourier />} />
      <Route path="add" element={<AddCourier />} />
      <Route path="update/:id" element={<UpdateCourrier />} />
      <Route path="detail/:id" element={<DetailCourier />} />
    </Routes>
  );
}
