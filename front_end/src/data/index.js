import { createStore } from "react-data-stores";
export const events = createStore({
  data: [],
});

/**
 * example of schema of data
 *  { date: "2024-12-12", note: "Réunion importante à 10h" },
    { date: "2024-12-13", note: "Déjeuner d'équipe à midi" },
    { date: "2024-12-15", note: "Présentation projet à 15h" },
 */
export const User = createStore({
  token: localStorage.getItem("token"),
  data: {},
});
