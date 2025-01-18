import { EmployeePaymentFunctions } from "../../tables/employee_payment/employee_payment_functions";
import { EmployeeTrustFunctions } from "../../tables/employee_trust/employee_trust_functions";
import { useEmployeeTableContext } from "../context/data_table_context_provider";


export function TableFunctionSelector() {
	const { selectedTableType } = useEmployeeTableContext();

	switch (selectedTableType) {
		case "TableEmployeePayment":
			return <EmployeePaymentFunctions />;
		case "TableEmployeeTrust":
			return <EmployeeTrustFunctions />;
	}
}
