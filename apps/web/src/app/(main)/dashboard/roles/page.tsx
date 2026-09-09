import { accessReviews } from "./_components/access-reviews-table/access-reviews-data";
import { permissionSets } from "./_components/permission-sets-table/permission-sets-data";
import { Roles } from "./_components/roles";
import { roles } from "./_components/roles-table/data";

export default function Page() {
  return <Roles roles={roles} permissionSets={permissionSets} accessReviews={accessReviews} />;
}
