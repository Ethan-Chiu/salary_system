import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
	isString,
	isNumber,
	isDate,
} from "~/lib/utils/checkType";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import {
	c_CreateDateStr,
	c_UpdateDateStr,
	c_EndDateStr,
	c_StartDateStr,
} from "../constant";
import { BonusSetting } from "~/server/database/entity/SALARY/bonus_setting";
import { LoadingSpinner } from "~/components/loading";
import { formatDate } from "~/lib/utils/formatDate";
import { TABLE_BONUS_SETTING } from "~/pages/table_names";

export type RowItem = {
	name: string;
	value: number | string | Date;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columns = [
	columnHelper.accessor("name", {
		header: ({ column }) => {
			return (
				<div className="flex justify-center">
					<div className="pl-4 text-center font-medium">
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(
									column.getIsSorted() === "asc"
								)
							}
						>
							Parameter
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="flex justify-center">
				<div className="text-center font-medium">
					{row.getValue("name")}
				</div>
			</div>
		),
	}),
	columnHelper.accessor("value", {
		header: () => <div className="text-center">Value</div>,
		cell: ({ row }) => {
			const value = row.getValue("value");
			let formatted = "";
			if (isNumber(value))
				formatted = parseFloat(row.getValue("value")).toString();
			else if (isString(value)) formatted = row.getValue("value");
			else if (isDate(value)) {
				if (value) {
					formatted =
						(value as Date).toISOString().split("T")[0] ?? "";
				} else formatted = "";
			}
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">
						{formatted}
					</div>
				</div>
			);
		},
	}),
];

function bonusMapper(bonusData: BonusSetting): RowItem[] {
	return [
		{
			name: "固定比率",
			value: bonusData.fixed_multiplier,
		},
		{
			name: "獎金(發放)基準日",
			value: formatDate("day", bonusData.criterion_date),
		},
		{
			name: "獎金計算依據",
			value: bonusData.base_on,
		},
		{
			name: "類別",
			value: bonusData.type,
		},
		{
			name: c_CreateDateStr,
			value: formatDate("hour", bonusData.create_date),
		},
		{
			name: c_UpdateDateStr,
			value: formatDate("hour", bonusData.update_date),
		},
	];
}

export function BonusTable({ index, globalFilter, viewOnly }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBonusSetting.useQuery();
	const filterKey: RowItemKey = "name";

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
					columns={columns}
					data={bonusMapper(data)}
					filterColumnKey={filterKey}
					table_name={TABLE_BONUS_SETTING}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={columns}
					data={bonusMapper(data)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}
