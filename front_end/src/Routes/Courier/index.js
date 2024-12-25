import { Store } from "react-data-stores";
import { Route, Routes } from "react-router-dom";
import AddCourier from "./AddCourier";

export default function () {
  return (
    <Routes>
      <Route index element={<button onClick={() => Store.navigateTo("/courrier/add")}>hello /</button>} />
      <Route path="add" element={<AddCourier />} />
    </Routes>
  );
}
/**
 * routes path /
 * rout home
 */
