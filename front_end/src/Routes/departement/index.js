import { Route, Routes } from "react-router-dom";
import AddDepartment from "./AddDepartement/index";
import ShowDepartments from "./ShowDepartement/index";
import UpdateDepartment from './updateDepartement';


export default function () {
  return (
       <Routes>
          <Route index element={<ShowDepartments />} />
          <Route path="add" element={<AddDepartment />} />
          <Route path="update/:id" element={<UpdateDepartment />} />
    
    
        </Routes>
  );
}