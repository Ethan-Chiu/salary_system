import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Overtime } from "~/server/database/entity/UMEDIA/overtime";
import { api } from "~/utils/api";
import i18n from "~/lib/utils/i18n";

const columns = () => Object.keys(new Overtime()).map((key) => {
	return {
		accessorKey: key,
		header: i18n.t(`common.table.${key}`),
	};
});

interface OvertimeTableProps {
	period: number;
	emp_no_list: string[];
}

export function OvertimeTable({ period, emp_no_list }: OvertimeTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getOvertimeByEmpList.useQuery({
			period_id: period,
			emp_no_list: emp_no_list,
		});

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return <DataTable columns={columns()} data={data} />;
}
