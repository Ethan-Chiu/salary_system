import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Payset } from "~/server/database/entity/UMEDIA/payset";
import { api } from "~/utils/api";

const columns = Object.keys(new Payset()).map((key) => {
	return {
		accessorKey: key,
		header: key,
	};
});

export function PaysetTable({ period, emp_no_list, index, globalFilter }: any) {
	const { isLoading, isError, data, error } = api.function.getPaysetByEmpList.useQuery(
		{ period_id: period, emp_no_list: emp_no_list }
	);
	const filterKey = "emp_no";

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
