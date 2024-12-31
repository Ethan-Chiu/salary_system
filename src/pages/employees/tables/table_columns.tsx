import { type EmployeeTableEnum } from "../employee_tables";
import { employeePaymentMapper } from "./employee_payment_table";
import { employeeTrustMapper } from "./employee_trust_table";

export function getTableMapper(selectedTableType: EmployeeTableEnum) {
	switch (selectedTableType) {
		case "TableEmployeePayment":
			return employeePaymentMapper;
		case "TableEmployeeTrust":
			return employeeTrustMapper;
	}
}
