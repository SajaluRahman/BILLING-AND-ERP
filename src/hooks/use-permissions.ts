"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Permission } from "@/types";

export function usePermissions() {
  const { hasPermission, hasAnyPermission, user } = useAuthStore();

  const can = (permission: Permission) => hasPermission(permission);
  const canAny = (permissions: Permission[]) => hasAnyPermission(permissions);
  const isRole = (role: string) => user?.role === role;
  const isAdmin = () =>
    user?.role === "super_admin" || user?.role === "company_owner";

  return { can, canAny, isRole, isAdmin, user };
}
