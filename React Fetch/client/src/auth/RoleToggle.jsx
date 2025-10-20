import { useRole } from "./RoleContext.jsx";

export default function RoleToggle() {
  const { role, toggle } = useRole();
  return (
    <button
      onClick={toggle}
      className="rounded-md border px-3 py-2 text-sm"
      title="Alternar rol"
    >
      {role === "ADMIN" ? "Vista Admin" : "Vista Usuario"}
    </button>
  );
}