import { type TableEnum } from "../components/context/data_table_enum";
import { employeePaymentSchema } from "./configurations/employee_payment_schema";
import { employeeTrustSchema } from "./configurations/employee_trust_schema";

export function getSchema(table: TableEnum) {
	switch (table) {
		case "TableEmployeePayment":
			return employeePaymentSchema;
		case "TableEmployeeTrust":
			return employeeTrustSchema;
		default:
			throw Error("Table not found");
	}
}
