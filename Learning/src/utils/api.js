import axios from "axios";

// Use local proxy in development, and production URL in production
const isDevelopment = import.meta.env.DEV;
const defaultBase = isDevelopment
  ? 'http://localhost:5000' // Your local proxy server
  : 'https://gemini-backend-1-gq8i.onrender.com'; // Your production backend

const API = axios.create({
  baseURL: defaultBase,
  headers: {
    'Content-Type': 'application/json',
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
