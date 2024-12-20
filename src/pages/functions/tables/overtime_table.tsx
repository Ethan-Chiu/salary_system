import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { PayTypeEnumType } from "~/server/api/types/pay_type_enum";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { overtimeFE } from "~/server/api/types/overtime_type";

const columns = (t: I18nType) => Object.keys(overtimeFE.shape).map((key) => {
return {
	accessorKey: key,
	header: ({ column }: any) => {
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

interface OvertimeTableProps {
	period_id: number;
	emp_no_list: string[];
	pay_type: PayTypeEnumType;
}

export function OvertimeTable({
	period_id,
	emp_no_list,
	pay_type,
}: OvertimeTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getOvertimeByEmpNoList.useQuery({
			period_id: period_id,
			emp_no_list: emp_no_list,
			pay_type: pay_type,
		});

	const { t } = useTranslation(["common"]);

	if (isLoading) {
		return <LoadingSpinner />; // ~ TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // ~ TODO: Error element with toast
	}

	if (data) {
		const filteredData = data.filter((d: any) =>
			["hours_1",
				"hours_134",
				"hours_167",
				"hours_267",
				"hours_2",
				"hours_134_TAX",
				"hours_167_TAX",
				"hours_267_TAX",
				"hours_2_TAX"]
				.some(key => d[key] > 0)
		);
		return <DataTable columns={columns(t)} data={filteredData} detailData={[1, 2, 3]} />;
	}
	return <div />;
}
