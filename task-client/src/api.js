import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5274/api/task",
});
