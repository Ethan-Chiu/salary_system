import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";

const columns = [
	"emp_no",
	"emp_name",
	"position_level",
	"position_type",
	"ginsurance_type",
	"department",
	"work_type",
	"work_status",
	"accessible",
	"sex_type",
	"dependents",
	"healthcare_dependents",
	"registration_date",
	"quit_date",
	"licens_id",
	"nbanknumber",
	"month_pay",
].map((key) => {
	return {
		accessorKey: key,
		header: key,
	};
});

export function EmployeeDataTable({ index, globalFilter, period_id }: any) {
	const { isLoading, isError, data, error } =
		api.employeeData.getAllEmployeeData.useQuery({ period_id });

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return <DataTable columns={columns} data={data!} />;
}
