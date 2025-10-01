import { useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContextBase";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlockApp = () => {
    setIsUnlocked(true);
  };

  const lockApp = () => {
    setIsUnlocked(false);
  };

  const value = useMemo(() => ({ isUnlocked, unlockApp, lockApp }), [isUnlocked]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
