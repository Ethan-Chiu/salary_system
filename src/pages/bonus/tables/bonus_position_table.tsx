import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BonusPosition } from "~/server/database/entity/SALARY/bonus_position";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { useTranslation } from "react-i18next";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
export type RowItem = {
	positionAndPositionType: string;
	position_multiplier: number;
	position_type_multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_position_columns = [
	columnHelper.accessor("positionAndPositionType", {
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
							{t("table.position") + t("table.position_type")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium">{row.getValue("positionAndPositionType")}</div>
		),
	}),
	columnHelper.accessor("position_multiplier", {
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
							{t("table.position_multiplier")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{`${row.original.position_multiplier}`}</div>
				</div>
			);
		},
	}),
	columnHelper.accessor("position_type_multiplier", {
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
							{t("table.position_type_multiplier")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{`${row.original.position_type_multiplier}`}</div>
				</div>
			);
		},
	}),
];

export function bonusPositionMapper(
	bonusPositionData: BonusPosition[]
): RowItem[] {
	return bonusPositionData.map((d) => {
		return {
			positionAndPositionType: d.position+d.position_type,
			position_multiplier: d.position_multiplier,
			position_type_multiplier: d.position_type_multiplier
		};
	});
}

interface BonusPositionTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusPositionTable({ period_id, bonus_type, viewOnly }: BonusPositionTableProps) {
	const { isLoading, isError, data, error } =
		api.bonus.getBonusPosition.useQuery({ period_id, bonus_type });
	const filterKey: RowItemKey = "positionAndPositionType";


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
					columns={bonus_position_columns}
					data={bonusPositionMapper(data!)}
					bonusType={bonus_type}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_position_columns}
					data={bonusPositionMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
