import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import { HistoryView } from "../../components/history_view/history_view";
import { useTranslation } from "react-i18next";
import { employee_payment_columns } from "./employee_payment_table";

export function EmployeePaymentHistory() {
	const { t } = useTranslation(["common"]);

  // TODO: use these  
	/* const { isPending, isError, data, error } = */
 /*    api.employeePayment.getAllEmployeePayment.useQuery() */

	/* if (isPending) { */
	/* 	return <LoadingSpinner />; // TODO: Loading element with toast */
	/* } */
	/**/
	/* if (isError) { */
	/* 	return <span>Error: {error.message}</span>; // TODO: Error element with toast */
	/* } */

	return (
		<HistoryView columns={employee_payment_columns({ t })} dataFunction={() => api.employeePayment.getAllEmployeePayment.useQuery()} />
	);
}
