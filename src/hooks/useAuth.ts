import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextBase";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    if (import.meta.env.MODE !== "production") {
      console.warn(
        "useAuth must be used within an AuthProvider. Returning default value."
      );
    }
    // Return a safe fallback to avoid crash
    return {
      isUnlocked: false,
      unlockApp: () => {},
    };
  }
  return context;
};
