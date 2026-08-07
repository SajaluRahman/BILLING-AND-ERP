import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole, Permission } from "@/types";
import { ROLE_PERMISSIONS } from "@/lib/constants";
import { mockUsers } from "@/lib/mock-data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  companyId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  switchCompany: (companyId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      companyId: null,

      login: async (email: string, _password: string) => {
        const user = mockUsers.find((u) => u.email === email);
        if (user) {
          set({
            user,
            isAuthenticated: true,
            companyId: user.companyId,
          });
          return true;
        }
        return false;
      },

      loginAs: (role: UserRole) => {
        const user = mockUsers.find((u) => u.role === role) || {
          id: "demo-user",
          name: "Demo User",
          email: "demo@aquaflow.in",
          phone: "+91 9876543200",
          role,
          permissions: [],
          companyId: "comp-1",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({
          user,
          isAuthenticated: true,
          companyId: user.companyId,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          companyId: null,
        });
      },

      hasPermission: (permission: Permission) => {
        const { user } = get();
        if (!user) return false;
        const rolePerms = ROLE_PERMISSIONS[user.role] || [];
        if (rolePerms.includes("*")) return true;
        return rolePerms.includes(permission);
      },

      hasAnyPermission: (permissions: Permission[]) => {
        const { user } = get();
        if (!user) return false;
        const rolePerms = ROLE_PERMISSIONS[user.role] || [];
        if (rolePerms.includes("*")) return true;
        return permissions.some((p) => rolePerms.includes(p));
      },

      switchCompany: (companyId: string) => {
        set({ companyId });
      },
    }),
    {
      name: "aquaflow-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        companyId: state.companyId,
      }),
    }
  )
);
