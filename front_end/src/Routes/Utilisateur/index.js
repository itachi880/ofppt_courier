import { Route, Routes } from "react-router-dom";
import { AddUsers } from "./add";
import { AfficheUsers } from "./afficheUsers";



export default function () {
  return (
       <Routes>
          {/* <Route index element={<AddUsers />} /> */}
          <Route path="add" element={<AddUsers />} />
          <Route path="afficheUsers" element={<AfficheUsers/>}/>
        </Routes>
  );
}