import { createStore } from "react-data-stores";
export const events = createStore({
  data: [],
  pagesIndexs: {},
});

export const User = createStore({
  token: localStorage.getItem("token") || undefined,
  data: {},
});
export const departements_group_store = createStore({
  departements: [
    {
      department_id: 1,
      department_name: "departement 1",
      groups: [
        {
          id: 1,
          name: "group 1",
        },
      ],
    },
  ],
  groups: [
    {
      id: 1,
      name: "group 1",
    },
  ],
});
export const usersStore = createStore({
  data: [
    {
      id: 0,
      first_name: "",
      last_name: "",
      departement: 0,
      group: 0,
      email: "",
      role: "",
    },
  ],
});
export const documentType = {
  courier: "courier",
  event: "event",
};
export const fetchedDates = [];
export const pageFromDb = [];
