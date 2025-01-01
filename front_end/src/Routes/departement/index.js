import { Route, Routes } from "react-router-dom";
import AddDepartment from "./AddDepartement/index";
import ShowDepartments from "./ShowDepartement/index";

export default function () {
  return (
       <Routes>
          <Route index element={<ShowDepartments />} />
          <Route path="add" element={<AddDepartment />} />
        </Routes>
  );
}