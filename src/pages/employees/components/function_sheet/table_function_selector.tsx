import { EmployeePaymentFunctionMenu } from "../../tables/employee_payment/employee_payment_functions";
import { EmployeeTrustFunctionMenu } from "../../tables/employee_trust/employee_trust_functions";
import { useEmployeeTableContext } from "../context/data_table_context_provider";


export function TableFunctionMenuSelector() {
	const { selectedTableType } = useEmployeeTableContext();

	switch (selectedTableType) {
		case "TableEmployeePayment":
			return <EmployeePaymentFunctionMenu />;
		case "TableEmployeeTrust":
			return <EmployeeTrustFunctionMenu />;
	}
}
