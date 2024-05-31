import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { isString, isNumber, isDateType } from "~/lib/utils/check_type";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_CreateDateStr, c_UpdateDateStr } from "../constant";
import { type BonusSetting } from "~/server/database/entity/SALARY/bonus_setting";
import { LoadingSpinner } from "~/components/loading";
import { formatDate } from "~/lib/utils/format_date";
import { EmptyTable } from "./empty_table";
import { type TableComponentProps } from "../tables_view";
import { Translate } from "~/lib/utils/translation";

export type RowItem = {
	name: string;
	value: number | string | Date;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_columns = [
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
							{Translate("Parameter")}
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
		header: () => <div className="text-center">{Translate("Value")}</div>,
		cell: ({ row }) => {
			const value = row.getValue("value");
			let formatted = "";
			if (isNumber(value))
				formatted = parseFloat(row.getValue("value")).toString();
			else if (isString(value)) formatted = row.getValue("value");
			else if (isDateType(value)) {
				if (value) {
					formatted = value.toISOString().split("T")[0] ?? "";
				} else formatted = "";
			}
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{formatted}</div>
				</div>
			);
		},
	}),
];

export function bonusMapper(bonusData: BonusSetting[]): RowItem[] {
	const data = bonusData[0]!;
	return [
		{
			name: "固定比率",
			value: data.fixed_multiplier,
		},
		{
			name: "獎金(發放)基準日",
			value: formatDate("day", data.criterion_date),
		},
		{
			name: "獎金計算依據",
			value: data.base_on,
		},
		{
			name: "類別",
			value: data.type,
		},
		{
			name: c_CreateDateStr,
			value: formatDate("hour", data.create_date),
		},
		{
			name: c_UpdateDateStr,
			value: formatDate("hour", data.update_date),
		},
	];
}

interface BonusTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusTable({ viewOnly }: BonusTableProps) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBonusSetting.useQuery();
	const filterKey: RowItemKey = "name";

	if (isLoading) {
		const LoaderUI = (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		);
		// TODO: Loading element with toast
		return LoaderUI;
	}

	if (isError) {
		// return <span>Error: {error.message}</span>; // TODO: Error element with toast
		const err_msg = error.message;
		const emptyError = true;
		return emptyError ? <EmptyTable err_msg={err_msg} selectedTableType="TableBonusSetting"  /> : <></>;
	}

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={bonus_columns}
					data={bonusMapper([data])}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_columns}
					data={bonusMapper([data])}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}

// export function EmptyTable({ err_msg }: { err_msg: string }) {
// 	const selectedTableType = "TableBonusSetting";
// 	const [alertOpen, setAlertOpen] = useState(true);
// 	return (
// 		<>
// 			<div className="flex grow items-center justify-center">
// 				<div className="text-center">
// 					<p>{err_msg}</p>
// 					<Button
// 						variant={"ghost"}
// 						onClick={() => setAlertOpen(true)}
// 					>
// 						Create
// 					</Button>
// 				</div>
// 				<EmptyCreate
// 					formSchema={getSchema(selectedTableType)}
// 					onClose={() => undefined}
// 					selectedTableType={selectedTableType}
// 					err_msg={err_msg}
// 					alertOpen={alertOpen}
// 					setAlertOpen={setAlertOpen}
// 				/>
// 			</div>
// 		</>
// 	);
// }
