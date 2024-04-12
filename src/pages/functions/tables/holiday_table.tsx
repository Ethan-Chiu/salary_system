import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Holiday } from "~/server/database/entity/UMEDIA/holiday";
import { api } from "~/utils/api";

const columns = Object.keys(new Holiday()).map((key) => {
	return {
		accessorKey: key,
		header: key,
	};
});

export function HolidayTable({ period, index, globalFilter }: any) {
	const { isLoading, isError, data, error } =
		api.function.getHoliday.useQuery({ period_id: period });
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
