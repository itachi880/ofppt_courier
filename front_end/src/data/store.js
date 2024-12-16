import { createStore } from "react-data-stores";
export const dataStore = createStore({
  data: [
    { date: "2024-12-12", note: "Réunion importante à 10h" },
    { date: "2024-12-13", note: "Déjeuner d'équipe à midi" },
    { date: "2024-12-15", note: "Présentation projet à 15h" },
  ],
});
