import axios from "axios";

// Base API instance (use gemini backend directly)
const defaultBase = 'https://gemini-backend-1-gq8i.onrender.com';

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
