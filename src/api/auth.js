import client from "./client";

export function register({ email, password, name }) {
  return client.post("/auth/register", { email, password, name });
}

export function login({ email, password }) {
  return client.post("/auth/login", { email, password });
}
