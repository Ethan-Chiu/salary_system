import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BonusPositionType } from "~/server/database/entity/SALARY/bonus_position_type";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../bonus_filter";
import { useTranslation } from "react-i18next";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

export type RowItem = {
	position_type: string;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_position_type_columns = [
	columnHelper.accessor("position_type", {
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
							{t("table.position_type")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("position_type")}</div>
		),
	}),
	columnHelper.accessor("multiplier", {
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
							{t("table.multiplier")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
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

export function bonusPositionTypeMapper(
	bonusPositionTypeData: BonusPositionType[]
): RowItem[] {
	return bonusPositionTypeData.map((d) => {
		return {
			position_type: d.position_type,
			multiplier: d.multiplier,
		};
	});
}

interface BonusPositionTypeTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusPositionTypeTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusPositionTypeTableProps) {
	const { isLoading, isError, data, error } =
		api.bonus.getBonusPositionType.useQuery({ period_id, bonus_type });
	const filterKey: RowItemKey = "position_type";

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
					columns={bonus_position_type_columns}
					data={bonusPositionTypeMapper(data!)}
					bonusType={bonus_type}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_position_type_columns}
					data={bonusPositionTypeMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
