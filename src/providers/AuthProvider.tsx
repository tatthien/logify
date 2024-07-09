import { User } from "@supabase/supabase-js";
import { createContext } from "react";

export type AuthProviderContextValue = {
  user: User | null;
};

export const AuthProviderContext = createContext<AuthProviderContextValue>({
  user: null,
});

type AuthProviderProps = {
  children: React.ReactNode;
  value: AuthProviderContextValue;
};

export function AuthProvider({ value, children }: AuthProviderProps) {
  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}
