import { type PropsWithChildren } from "react";
import { type EmployeeTableEnum } from "../../employee_tables";
import { useEmployeeTableContext } from "./data_table_context_provider";
import { LoadingSpinner } from "~/components/loading";


export function TabMountGuard({ children, tableType }: PropsWithChildren<{tableType: EmployeeTableEnum}>) {
  const { selectedTableType } = useEmployeeTableContext();

  if (selectedTableType !== tableType) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
