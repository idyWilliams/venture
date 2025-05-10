"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "founder" | "investor";

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(
  undefined
);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("founder");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserRoleContext.Provider
      value={{ role, setRole, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
}
