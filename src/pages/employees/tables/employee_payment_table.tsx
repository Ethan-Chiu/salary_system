import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table_update";
import { api } from "~/utils/api";

const columns = [
	"emp_no",
	"base_salary",
	"food_allowance",
	"supervisor_allowance",
	"occupational_allowance",
	"subsidy_allowance",
	"professional_cert_allowance",
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
		header: key,
	};
});

export function EmployeePaymentTable({ index, globalFilter, period_id }: any) {
	const { isLoading, isError, data, error } =
		api.employeePayment.getCurrentEmployeePayment.useQuery({ period_id });

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return <DataTable columns={columns} data={data!} />;
}
