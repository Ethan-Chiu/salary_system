import { type ColumnDef } from "@tanstack/react-table";
import { type TFunction } from "i18next";
import { FunctionMode } from "../components/function_sheet/data_table_functions";
import { EmployeeTableEnum } from "../employee_tables";
import { employee_payment_columns, employeePaymentMapper } from "./employee_payment_table";
import { employee_trust_columns, employeeTrustMapper } from "./employee_trust_table";

export function getTableColumn(
	selectedTableType: EmployeeTableEnum,
	t: TFunction<[string], undefined>,
	period_id: number,
	open: boolean,
	setOpen: (open: boolean) => void,
	mode: FunctionMode,
	setMode: (mode: FunctionMode) => void
): ColumnDef<any, any>[] {
	switch (selectedTableType) {
		case "TableEmployeePayment":
			return employee_payment_columns({ t, period_id, open, setOpen, mode, setMode });
		case "TableEmployeeTrust":
			return employee_trust_columns({ t, period_id, open, setOpen, mode, setMode });
	}
}

export function getTableMapper(selectedTableType: EmployeeTableEnum) {
	switch (selectedTableType) {
		case "TableEmployeePayment":
			return employeePaymentMapper;
		case "TableEmployeeTrust":
			return employeeTrustMapper;
	}
}
