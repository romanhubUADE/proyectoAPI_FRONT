//ADMIN Y USUARIO

import { useRole } from "../auth/RoleContext";

export default function RoleToggle({ className = "" }) {
  const { role, setRole } = useRole();
  const next = role === "ADMIN" ? "USER" : "ADMIN";
  return (
    <button
      onClick={() => setRole(next)}
      className={`px-3 py-2 rounded border border-primary text-primary hover:bg-primary/10 ${className}`}
      title="Alternar vista"
    >
      Vista: {role}
    </button>
  );
}