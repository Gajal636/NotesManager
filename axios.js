import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend server
  withCredentials: true             // allow cookies (for JWT auth)
});

export default api;
