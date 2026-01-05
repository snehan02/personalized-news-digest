import axios from "axios";

const API = axios.create({
  baseURL: "https://personalized-news-digest-n2rsprbps-snehas-projects-bea0e590.vercel.app/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
