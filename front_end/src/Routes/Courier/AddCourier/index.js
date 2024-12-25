import { useState } from "react";

export default function () {
  const [options, setOptions] = useState([]);
  return (
    <div>
      <input placeholder="object" />
      //object:titel
      <select multiple={true} onChange={(e) => {}}></select>
      //assigne:SELECT
      <input />
      //etas:state
      <input placeholder="description" />
      //discription:instruction particulaier
      <input type="file" />
      //upload imgs:[1+:+&[
      <input type="date" />
      //deadline
      <input type="date" />
      //date arrive:created at =&gt;modifier back end
    </div>
  );
}
