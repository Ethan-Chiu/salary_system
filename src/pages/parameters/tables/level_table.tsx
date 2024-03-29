import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { LevelRange } from "~/server/database/entity/SALARY/level_range";
import { Level } from "~/server/database/entity/SALARY/level";

export type RowItem = {
    level: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const level_columns = [
	columnHelper.accessor("level", {
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
							level
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{`${row.original.level}`}</div>
		),
	}),
];

export function levelMapper(levelData: Level[]): RowItem[] {
	return levelData.map((d) => {
		return {
            level: d.level,
		};
	});
}

export function LevelTable({ index, globalFilter, period_id, viewOnly }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentLevel.useQuery();
	const filterKey: RowItemKey = "level";

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
					columns={level_columns}
					data={levelMapper(data)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={level_columns}
					data={levelMapper(data)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
