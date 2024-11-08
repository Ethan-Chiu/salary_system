import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Overtime } from "~/server/database/entity/UMEDIA/overtime";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { PayTypeEnumType } from "~/server/api/types/pay_type_enum";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const columns = (t: I18nType) => Object.keys(new Overtime()).map((key) => {
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

interface OvertimeTableProps {
	period: number;
	emp_no_list: string[];
	pay_type: PayTypeEnumType;
}

export function OvertimeTable({ period, emp_no_list, pay_type }: OvertimeTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getOvertimeByEmpNoList.useQuery({
			period_id: period,
			emp_no_list: emp_no_list,
			pay_type: pay_type,
		});

	const { t } = useTranslation(['common']);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		return <DataTable columns={columns(t)} data={data} detailData={[1, 2, 3]}/>;
	}
	return <div />;
}
