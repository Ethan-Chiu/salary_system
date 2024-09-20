import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BonusWorkType } from "~/server/database/entity/SALARY/bonus_work_type";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { useTranslation } from "react-i18next";

export type RowItem = {
	work_type: string;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_work_type_columns = [
	columnHelper.accessor("work_type", {
		header: ({ column }) => {
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
							{t("table.work_type")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium">{row.getValue("work_type")}</div>
		),
	}),
	columnHelper.accessor("multiplier", {
		header: () => {
			const { t } = useTranslation(["common"]);
			return <div className="text-center font-medium">{t("table.multiplier")}</div>
		}, 
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{`${row.original.multiplier}`}</div>
				</div>
			);
		},
	}),
];

export function bonusWorkTypeMapper(
	bonusWorkTypeData: BonusWorkType[]
): RowItem[] {
	return bonusWorkTypeData.map((d) => {
		return {
			work_type: d.work_type,
			multiplier: d.multiplier,
		};
	});
}

interface BonusWorkTypeTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusWorkTypeTable({ viewOnly }: BonusWorkTypeTableProps) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBonusWorkType.useQuery();
	const filterKey: RowItemKey = "work_type";

	if (isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={bonus_work_type_columns}
					data={bonusWorkTypeMapper(data!)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_work_type_columns}
					data={bonusWorkTypeMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}