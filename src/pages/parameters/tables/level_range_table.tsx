import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { LevelRange } from "~/server/database/entity/SALARY/level_range";

export type RowItem = {
	type: string;
	level_start: number;
	level_end: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const level_range_columns = [
	columnHelper.accessor("type", {
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
							Type
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{`${row.original.type}`}</div>
		),
	}),
	columnHelper.accessor("level_start", {
		header: () => <div className="text-center">level_start</div>,
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium">{`${row.original.level_start}`}</div>
			);
		},
	}),
	columnHelper.accessor("level_end", {
		header: () => <div className="text-center">level_end</div>,
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium">{`${row.original.level_end}`}</div>
			);
		},
	}),
];

export function levelRangeMapper(levelRangeData: LevelRange[]): RowItem[] {
	return levelRangeData.map((d) => {
		return {
			type: d.type,
			level_start: d.level_start,
			level_end: d.level_end,
		};
	});
}

export function LevelRangeTable({
	index,
	globalFilter,
	period_id,
	viewOnly,
}: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentLevelRange.useQuery();
	const filterKey: RowItemKey = "type";

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
					columns={level_range_columns}
					data={levelRangeMapper(data)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={level_range_columns}
					data={levelRangeMapper(data)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
