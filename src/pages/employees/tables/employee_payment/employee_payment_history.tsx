import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import { HistoryView } from "../../components/history_view/history_view";
import { useTranslation } from "react-i18next";
import {
	employee_payment_columns,
	employeePaymentMapper,
} from "./employee_payment_table";

export function EmployeePaymentHistory() {
	const { t } = useTranslation(["common"]);

	const { isPending, isError, data, error } =
		api.employeePayment.getAllEmployeePayment.useQuery();

	if (isPending) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	const tableData = data.map((d) => employeePaymentMapper(d));
	return (
		<HistoryView
			columns={employee_payment_columns({ t })}
			data={tableData}
		/>
	);
}
