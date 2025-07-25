import { createContext } from "react";

// Creates a context for authentication
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});
