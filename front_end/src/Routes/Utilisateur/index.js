import { Route, Routes } from "react-router-dom";
import { AddUsers } from "./add";
import { AfficheUsers } from "./afficheUsers";
import { DetailUsers } from "./detailUsers";
import { UpdateUsers } from "./updateUsers";



export default function () {
  return (
       <Routes>
          {/* <Route index element={<AddUsers />} /> */}
          <Route path="add" element={<AddUsers />} />
          <Route path="afficheUsers" element={<AfficheUsers/>}/>
          <Route path="detailUsers/:id" element={<DetailUsers/>}/>
          <Route path="updateUsers/:id" element={<UpdateUsers/>}/>
        </Routes>
  );
}