import { FunctionMenu } from "~/components/table_functions/function_menu/function_menu";
import { DataTableFunctions } from "../../components/function_sheet/data_table_functions";
import { usePaymentFunctionContext } from "./employee_payment_provider";
import { FunctionMenuOption } from "~/components/table_functions/function_menu/function_menu_option";

export function EmployeePaymentFunctionMenu() {
	const { setMode } = usePaymentFunctionContext();

  return (
    <FunctionMenu>
      <FunctionMenuOption.ExcelDownload onClick={() => setMode("excel_download")}/>
      <FunctionMenuOption.ExcelUpload onClick={() => setMode("excel_download")}/>
      <FunctionMenuOption.Initialize onClick={() => setMode("excel_download")}/>
      <FunctionMenuOption.AutoCalculate onClick={() => setMode("excel_download")}/>
    </FunctionMenu>
  )
}

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
