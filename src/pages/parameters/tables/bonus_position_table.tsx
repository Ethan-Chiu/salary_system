import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BonusPosition } from "~/server/database/entity/SALARY/bonus_position";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";

export type RowItem = {
	position: number;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_position_columns = [
	columnHelper.accessor("position", {
		header: ({ column }) => {
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
							position
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("position")}</div>
		),
	}),
	columnHelper.accessor("multiplier", {
		header: () => <div className="text-center">Multiplier</div>,
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{`${row.original.multiplier}`}</div>
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
			position: d.position,
			multiplier: d.multiplier,
		};
	});
}

interface BonusPositionTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusPositionTable({ viewOnly }: BonusPositionTableProps) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBonusPosition.useQuery();
	const filterKey: RowItemKey = "position";

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
					data={bonusPositionMapper(data)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_position_columns}
					data={bonusPositionMapper(data)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}
