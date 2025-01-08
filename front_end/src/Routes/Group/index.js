import { Route, Routes } from "react-router-dom";
import AddGroup from "./AddGroup";
import ShowGroup from "./ShowGroup";
import UpdateGroup from "./UpdateGroup";




export default function () {
  return (
       <Routes>
          <Route index element={<ShowGroup/>} />
          <Route path="add" element={<AddGroup />} />
         <Route path="update/:id" element={<UpdateGroup/>} />
        </Routes>
  );
}