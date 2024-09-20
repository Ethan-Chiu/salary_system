import { type Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "~/components/data_table/toolbar/data_table_view_options";
import BonusToolbarFunctionsProvider from "./function_sheet/bonus_functions_context";
import { DataTableFunctions } from "./function_sheet/data_table_functions";
import { useContext } from "react";
import dataTableContext from "./context/data_table_context";
import periodContext from "~/components/context/period_context";
import { ToolbarFilter } from "~/components/data_table/toolbar/toolbar_filter";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	bonusType: BonusTypeEnumType;
	filterColumnKey?: keyof TData;
}

export function DataTableToolbar<TData>({
	table,
	bonusType,
	filterColumnKey,
}: DataTableToolbarProps<TData>) {
	const { selectedTableType } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);

	return (
		<div className="flex flex-row items-center justify-between space-x-2 px-2 py-2">
			{/* search bar */}
			<ToolbarFilter table={table} filterColumnKey={filterColumnKey} />
			{/* tabs */}
			<div className="flex">
				<DataTableViewOptions table={table} />
				<div className="ml-2 w-12">
					{selectedPeriod && (
						<BonusToolbarFunctionsProvider
							selectedTableType={selectedTableType}
							period_id={selectedPeriod.period_id}
							bonus_type={bonusType}
						>
							<DataTableFunctions tableType={selectedTableType} bonusType={bonusType} />
						</BonusToolbarFunctionsProvider>
					)}
				</div>
			</div>
		</div>
	);
}
