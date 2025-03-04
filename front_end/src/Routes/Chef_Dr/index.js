import { useState, useEffect, useMemo } from "react";
import ChartJs from "./chart";
// import { events, fetchedDates, User } from "../../../data";
// import { GetEvents } from "../../../api";
// import { Store } from "react-data-stores";
// import { roles } from "../../../utils";
// import { useNavigate } from "react-router-dom";
export default function Chef_Dr() {
    return <div className="Container">
        <h1>Chef Dr</h1>   
        <ChartJs/>
    </div>
}