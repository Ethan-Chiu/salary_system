import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Holiday } from "~/server/database/entity/UMEDIA/holiday";
import { api } from "~/utils/api";
import { useTranslation } from "react-i18next";

const columns = Object.keys(new Holiday()).map((key) => {
	const { t } = useTranslation(['common']);
	return {
		accessorKey: key,
		header: t(`table.${key}`),
	};
});

interface HolidayTableProps {
	period: number;
	emp_no_list: string[];
}

export function HolidayTable({ period, emp_no_list }: HolidayTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getHolidayByEmpList.useQuery({
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
