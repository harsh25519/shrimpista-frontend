import axios from "axios";

export const api = axios.create({
  baseURL: "https://shrimpista.onrender.com",
  withCredentials: true, // REQUIRED: Tells browser to include HttpOnly cookies
});