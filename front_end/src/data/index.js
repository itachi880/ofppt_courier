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
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM0ODY5NzkwLCJleHAiOjE3MzQ5NTYxOTB9.hS0h-yxWlOw-d2Rr3_Gc0Rt2Zc2YsTgjNJtGxREL7Ik",
  data: {
    id: 1,
    email: "admin1@example.com",
    password: "7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7",
    role: "admin",
    departement_id: null,
    group_id: null,
    created_at: "2024-12-17T22:44:27.000Z",
    updated_at: "2024-12-17T22:44:27.000Z",
  },
});
