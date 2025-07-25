import axios from "axios";

// Base API instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change to your backend URL
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
