import API from "./axios";

export const getTasks = () => API.get("/tasks");

export const createTask = (data: any) =>
  API.post("/tasks", data);

export const deleteTask = (id: string) =>
  API.delete(`/tasks/${id}`);