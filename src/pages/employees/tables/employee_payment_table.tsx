import { LoadingSpinner } from "~/components/loading";
import { DataTableUpdate } from "../components/data_table_update";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";

const columns = (t: I18nType) =>
	[
		"department",
		"emp_no",
		"emp_name",
		"position",
		"position_type",
		"base_salary",
		"food_allowance",
		"supervisor_allowance",
		"occupational_allowance",
		"subsidy_allowance",
		"long_service_allowance",
		"l_r_self",
		"l_i",
		"h_i",
		"l_r",
		"occupational_injury",
		"start_date",
		"end_date",
	].map((key) => {
		return {
			accessorKey: key,
			header: t(`table.${key}`),
		};
	});

export function EmployeePaymentTable({ period_id }: any) {
	const { isLoading, isFetched, isError, data, error } =
		api.employeePayment.getCurrentEmployeePayment.useQuery(
			{ period_id },
			{}
		);

	const { t } = useTranslation(["common"]);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		return (
			<>
				{isFetched ? (
					// TODO: figure out its type
					<DataTableUpdate
						columns={columns(t)}
						data={data}
						historyDataFunction={() =>
							api.employeePayment.getAllEmployeePayment.useQuery()
						}
						calendarDataFunction={() =>
							api.employeePayment.getAllEmployeePayment.useQuery()
						}
					/>
				) : (
					<LoadingSpinner />
				)}
			</>
		);
	}
	return <div />;
}
