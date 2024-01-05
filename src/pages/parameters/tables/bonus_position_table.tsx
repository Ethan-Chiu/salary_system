import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "../components/data_table";
import { c_CreateDateStr, c_EndDateStr, c_StartDateStr } from "../constant";
import { BonusPosition } from "~/server/database/entity/SALARY/bonus_position";
import { LoadingSpinner } from "~/components/loading";

export type RowItem = {
	position: number;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columns = [
	columnHelper.accessor("position", {
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Position
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="w-[400px] pl-4 lowercase">
				{row.getValue("position")}
			</div>
		),
	}),
	columnHelper.accessor("multiplier", {
		header: () => <div className="text-center">Multiplier</div>,
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="w-80 text-center font-medium">{`${row.original.multiplier}`}</div>
				</div>
			);
		},
	}),
];

function bonusPositionMapper(bonusPositionData: BonusPosition[]): RowItem[] {
	return bonusPositionData.map((d) => {
		return {
			position: d.position,
			multiplier: d.multiplier,
		};
	});
}

export function BonusPositionTable({ index, globalFilter }: any) {
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
		<DataTable
			columns={columns}
			data={bonusPositionMapper(data)}
			filterColumnKey={filterKey}
		/>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}
