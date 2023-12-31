import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "~/pages/parameters/components/data_table";
import { Payset } from "~/server/database/entity/UMEDIA/payset";
import { api } from "~/utils/api";

const columns = Object.keys(new Payset()).map((key) => {
	return {
		accessorKey: key,
		header: key,
	};
});

export function PaysetTable({ period, index, globalFilter }: any) {
	const { isLoading, isError, data, error } = api.function.getPayset.useQuery(
		{ period_id: period }
	);
	const filterKey = "emp_no";

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<DataTable columns={columns} data={data!} filterColumnKey={filterKey} />
	);
}
