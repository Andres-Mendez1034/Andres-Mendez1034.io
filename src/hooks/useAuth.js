import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/* =========================================================
   CUSTOM HOOK
   (única forma correcta de consumir AuthContext)
========================================================= */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

/* =========================================================
   EXPORT DEFAULT (opcional compatibilidad)
========================================================= */
export default useAuth;