import { Route, Routes } from "react-router-dom";
import AddGroup from "./AddGroup";
import ShowGroup from "./ShowGroup";
import UpdateGroup from "./UpdateGroup";
import { User } from "../../data";
import { usePreventAccess } from "../../utils";

export default function () {
  const [userData, setUserData] = User.useStore();
  usePreventAccess(userData);
  return (
    <Routes>
      <Route index element={<ShowGroup />} />
      <Route path="add" element={<AddGroup />} />
      <Route path="update/:id" element={<UpdateGroup />} />
    </Routes>
  );
}
