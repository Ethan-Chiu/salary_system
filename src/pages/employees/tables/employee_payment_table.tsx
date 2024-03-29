import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table_update";
import { api } from "~/utils/api";
import { useContext } from "react";
import periodContext from "~/components/context/period_context";

const columns = [
	"emp_no",
	"base_salary",
	"food_bonus",
	"supervisor_comp",
	"job_comp",
	"subsidy_comp",
	"professional_cert_comp",
	"labor_retirement_self",
	"l_i",
	"h_i",
	"labor_retirement",
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

    return (
        <DataTable columns={columns} data={data!} />
    );
}
