import axios from "axios";

// Base API instance
const API = axios.create({
  baseURL: "https://gemini-backend-1-gq8i.onrender.com", // Updated backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token if stored
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

export default API;
