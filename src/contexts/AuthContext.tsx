import { useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContextBase";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isPinSet] = useState(() => !!localStorage.getItem("app_pin_code"));
  const [isUnlocked, setIsUnlocked] = useState(!isPinSet);

  const unlockApp = () => {
    setIsUnlocked(true);
  };

  const value = useMemo(() => ({ isUnlocked, unlockApp }), [isUnlocked]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
