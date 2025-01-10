import { useEmployeeTableContext } from "../context/data_table_context_provider";
import { EmployeePaymentCurrentTable } from "../../tables/employee_payment/employee_payment_current";
import { EmployeeTrustCurrentTable } from "../../tables/employee_trust/employee_trust_current";

export function CurrentViewSelector() {
	const { selectedTableType } = useEmployeeTableContext();

	switch (selectedTableType) {
		case "TableEmployeePayment":
			return <EmployeePaymentCurrentTable />;
		case "TableEmployeeTrust":
			return <EmployeeTrustCurrentTable />;
	}
}
