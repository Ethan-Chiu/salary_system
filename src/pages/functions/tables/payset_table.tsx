import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Payset } from "~/server/database/entity/UMEDIA/payset";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { PaysetFE } from "~/server/api/types/payset_type";

const columns = (t: I18nType) => Object.keys(PaysetFE.shape).map((key) => {
	return {
		accessorKey: key,
		header: ({ column }: any) => {
			const { t } = useTranslation(["common"]);
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(
									column.getIsSorted() === "asc"
								)
							}
						>
							{t(`table.${key}`)}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
	};
});

interface PaysetTableProps {
	period: number;
	emp_no_list: string[];
}

export function PaysetTable({ period, emp_no_list }: PaysetTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getPaysetByEmpNoList.useQuery({
			period_id: period,
			emp_no_list: emp_no_list,
		});

	const { t } = useTranslation(['common']);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		const filteredData = data.filter((d: any) =>
			["work_day",
				"li_day"]
				.some(key => d[key] > 0)
		);
		return <DataTable columns={columns(t)} data={filteredData} />;
	}
	return <div />;
}
