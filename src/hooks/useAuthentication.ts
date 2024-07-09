import { AuthProviderContext } from "@/providers/AuthProvider";
import { useContext } from "react";

export function useAuthentication() {
  const context = useContext(AuthProviderContext);
  if (!context) {
    throw new Error("useGetUser must be used within an AuthProvider");
  }

  return {
    user: context.user,
  };
}
