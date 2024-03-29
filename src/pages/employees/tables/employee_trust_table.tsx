import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table_update";
import { api } from "~/utils/api";

const columns = [
	"emp_no",
	"emp_trust_reserve",
	"org_trust_reserve",
	"emp_special_trust_incent",
	"org_special_trust_incent",
	"start_date",
	"end_date",
].map((key) => {
	return {
		accessorKey: key,
		header: key,
	};
});

export function EmployeeTrustTable({ period_id }: any) {
	const { isLoading, isError, data, error } =
		api.employeeTrust.getCurrentEmployeeTrust.useQuery({
			period_id: period_id,
		});

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<DataTable columns={columns} data={data} />
	);
}
