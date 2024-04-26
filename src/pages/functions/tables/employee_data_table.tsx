import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";

const columns = [
	"emp_no",
	"emp_name",
	"position",
	"position_type",
	"ginsurance_type",
	"u_dep",
	"work_type",
	"work_status",
	"accessible",
	"sex_type",
	"dependents",
	"healthcare",
	"registration_date",
	"quit_date",
	"licens_id",
	"nbanknumber",
].map((key) => {
	return {
		accessorKey: key,
		header: key,
	};
});

interface EmployeeDataTableProps {
	func: any;
}

export function EmployeeDataTable({ func }: EmployeeDataTableProps) {
	const { isLoading, isError, data, error } =
		api.sync.getPaidEmployees.useQuery({ func });

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return <DataTable columns={columns} data={data} />;
}
