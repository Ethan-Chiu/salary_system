import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Payset } from "~/server/database/entity/UMEDIA/payset";
import { api } from "~/utils/api";
import { useTranslation } from "react-i18next";

const columns = Object.keys(new Payset()).map((key) => {
	const { t } = useTranslation(['common']);
	return {
		accessorKey: key,
		header: t(`table.${key}`),
	};
});

interface PaysetTableProps {
	period: number;
	emp_no_list: string[];
}

export function PaysetTable({ period, emp_no_list }: PaysetTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getPaysetByEmpList.useQuery({
			period_id: period,
			emp_no_list: emp_no_list,
		});

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return <DataTable columns={columns} data={data} />;
}
