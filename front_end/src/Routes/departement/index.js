import { Route, Routes } from "react-router-dom";
import AddDepartment from "./AddDepartement/index";
import ShowDepartments from "./ShowDepartement/index";
import UpdateDepartment from "./updateDepartement";
import { usePreventAccess } from "../../utils";
import { User } from "../../data";

export default function () {
  const [userData, setUserData] = User.useStore();
  usePreventAccess(userData);

  return (
    <Routes>
      <Route index element={<ShowDepartments />} />
      <Route path="add" element={<AddDepartment />} />
      <Route path="update/:id" element={<UpdateDepartment />} />
    </Routes>
  );
}
