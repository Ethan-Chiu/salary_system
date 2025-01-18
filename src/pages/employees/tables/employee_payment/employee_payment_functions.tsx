import { DataTableFunctions } from "../../components/function_sheet/data_table_functions";
import { usePaymentFunctionContext } from "./employee_payment_provider";

export function EmployeePaymentFunctions() {
	const { open, setOpen, mode } = usePaymentFunctionContext();

	return (
		<DataTableFunctions
			openSheet={open}
			setOpenSheet={setOpen}
			mode={mode}
			tableType={"TableEmployeePayment"}
		/>
	);
}
