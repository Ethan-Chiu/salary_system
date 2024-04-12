import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Overtime } from "~/server/database/entity/UMEDIA/overtime";
import { api } from "~/utils/api";

const columns = Object.keys(new Overtime()).map((key) => {
	return {
		accessorKey: key,
		header: key,
	};
});

export function OvertimeTable({ period, index, globalFilter }: any) {
	const { isLoading, isError, data, error } =
		api.function.getOvertime.useQuery({ period_id: period });
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
