import { useEffect } from "react";
import { isTokenExpired, logout } from "../utils/auth";

const AuthChecker = () => {
  debugger;
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");

      if (token && isTokenExpired(token)) {
        alert("Your session has expired. Please log in again.");
        logout();
      }
    };

    // Check immediately
    checkToken();

    // Check every 5 seconds
    const interval = setInterval(checkToken, 5000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default AuthChecker;
