import RoleOutlet from "./RoleOutlet";

export default function ManagerAreaOutlet() {
  return <RoleOutlet allowedRoles={["CEO", "ADMIN", "MANAGER"]} />;
}
