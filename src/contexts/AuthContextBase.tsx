import { createContext } from "react";

interface AuthContextType {
  isUnlocked: boolean;
  unlockApp: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
