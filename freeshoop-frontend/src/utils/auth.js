import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);

    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 <= Date.now();
  } catch (error) {
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  window.location.href = "/";
};
