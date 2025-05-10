"use client";

import { useUserRole } from "@/src/contexts/UserRoleContext";
// import { useUserRole } from "@/contexts/UserRoleContext";
import { Button } from "./button";

export default function RoleSwitcher() {
  const { role, setRole } = useUserRole();

  return (
    <div className="flex gap-2">
      <Button
        variant={role === "founder" ? "default" : "outline"}
        onClick={() => setRole("founder")}
      >
        Founder
      </Button>
      <Button
        variant={role === "investor" ? "default" : "outline"}
        onClick={() => setRole("investor")}
      >
        Investor
      </Button>
    </div>
  );
}
