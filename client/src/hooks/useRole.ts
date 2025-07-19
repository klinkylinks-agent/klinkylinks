import { useAuth } from "./useAuth";

export function useRole() {
  const { user } = useAuth();
  
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSuperAdmin = user?.role === "super_admin";
  const isUser = user?.role === "user" || !user?.role;
  
  return {
    user,
    isAdmin,
    isSuperAdmin,
    isUser,
    role: user?.role || "user",
  };
}