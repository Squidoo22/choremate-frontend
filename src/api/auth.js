import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

export function register({ email, password, name }) {
  if (USE_MOCKS) return mock.register({ email, password, name });
  return client.post("/auth/register", { email, password, name });
}

export function login({ email, password }) {
  if (USE_MOCKS) return mock.login({ email, password });
  return client.post("/auth/login", { email, password });
}
