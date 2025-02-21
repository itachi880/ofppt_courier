import { Route, Routes } from "react-router-dom";
import AddCourier from "./AddCourier";
import UpdateCourrier from "./UpdateCourrier";
import ShowCourier from "./ShowCourier";
import DetailCourier from "./DetailCourier/DetailCourier";
import Archive from "./Archive/Archive";
import ValidateCourier from "./ValidateCourier";

export default function () {
  return (
    <Routes>
      <Route index element={<ShowCourier />} />
      <Route path="add" element={<AddCourier />} />
      <Route path="update/:id" element={<UpdateCourrier />} />
      <Route path="detail/:id" element={<DetailCourier />} />
      <Route path="validate/:id" element={<ValidateCourier />} />
      <Route path="Archive" element={<Archive />} />
    </Routes>
  );
}
