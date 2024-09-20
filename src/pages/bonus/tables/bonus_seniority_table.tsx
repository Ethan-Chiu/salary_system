import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BonusSeniority } from "~/server/database/entity/SALARY/bonus_seniority";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../bonus_filter";
import { useTranslation } from "react-i18next";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
export type RowItem = {
	seniority: number;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_seniority_columns = [
	columnHelper.accessor("seniority", {
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
							{t("table.seniority")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium">{row.getValue("seniority")}</div>
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

export function bonusSeniorityMapper(
	bonusSeniorityData: BonusSeniority[]
): RowItem[] {
	return bonusSeniorityData.map((d) => {
		return {
			seniority: d.seniority,
			multiplier: d.multiplier,
		};
	});
}

interface BonusSeniorityTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusSeniorityTable({ period_id, bonus_type, viewOnly }: BonusSeniorityTableProps) {
	const { isLoading, isError, data, error } =
		api.bonus.getBonusSeniority.useQuery({ period_id, bonus_type });
	const filterKey: RowItemKey = "seniority";

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
					columns={bonus_seniority_columns}
					data={bonusSeniorityMapper(data!)}
					bonusType={bonus_type}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_seniority_columns}
					data={bonusSeniorityMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
