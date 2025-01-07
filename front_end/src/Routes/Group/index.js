import { Route, Routes } from "react-router-dom";
import AddGroup from "./AddGroup";



export default function () {
  return (
       <Routes>
          {/* <Route index element={<ShowGroup/>} /> */}
          <Route path="add" element={<AddGroup />} />
        </Routes>
  );
}