import { EmployeePaymentHistory } from "../../tables/employee_payment/employee_payment_history";
import { EmployeeTrustHistory } from "../../tables/employee_trust/employee_trust_history";
import { useEmployeeTableContext } from "../context/data_table_context_provider";

export function HistoryViewSelector() {
	const { selectedTableType } = useEmployeeTableContext();

	switch (selectedTableType) {
		case "TableEmployeePayment":
			return <EmployeePaymentHistory/>;
		case "TableEmployeeTrust":
			return <EmployeeTrustHistory/>;
	}
}
