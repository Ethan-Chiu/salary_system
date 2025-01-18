import { useTrustFunctionContext } from "./employee_trust_provider";
import { DataTableFunctions } from "../../components/function_sheet/data_table_functions";
import { FunctionMenu } from "~/components/table_functions/function_menu/function_menu";

export function EmployeeTrustFunctionMenu() {
  return (
    <FunctionMenu>

    </FunctionMenu>
  )
}

export function EmployeeTrustFunctions() {
	const { open, setOpen, mode } = useTrustFunctionContext();

	return (
		<DataTableFunctions
			openSheet={open}
			setOpenSheet={setOpen}
			mode={mode}
      tableType={"TableEmployeeTrust"}
		/>
	);
}
