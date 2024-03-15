import { type Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "~/components/data_table/toolbar/data_table_view_options";
import { Input } from "~/components/ui/input";
import EmployeeToolbarFunctionsProvider from "./function_sheet/employee_functions_context";
import { DataTableFunctions } from "./function_sheet/data_table_functions";
import { useContext } from "react";
import dataTableContext from "./context/data_table_context";
import periodContext from "~/components/context/period_context";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	globalFilter: string;
	filterKey: keyof TData;
	showTabs?: boolean;
	table_name?: string;
}

export function DataTableToolbar<TData>({
	table,
	globalFilter,
	filterKey,
}: DataTableToolbarProps<TData>) {
	const { selectedTableType } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext)

	return (
		<div className="flex flex-row items-center justify-between space-x-2 px-2 py-2">
			{/* search bar */}
			<Input
				disabled={globalFilter !== ""} // TODO: fix
				placeholder="Filter setting..."
				value={
					globalFilter === ""
						? (table
							.getColumn(filterKey.toString())
							?.getFilterValue() as string) ?? ""
						: globalFilter
				}
				onChange={(event) => {
					table
						.getColumn(filterKey.toString())
						?.setFilterValue(event.target.value);
				}}
				className="h-8 max-w-sm"
			/>
			{/* tabs */}
			<div className="flex">
				<DataTableViewOptions table={table} />
				<div className="w-12 ml-2">
					{selectedPeriod &&
						<EmployeeToolbarFunctionsProvider tableType={selectedTableType} period_id={selectedPeriod.period_id}>
							<DataTableFunctions tableType={selectedTableType} />
						</EmployeeToolbarFunctionsProvider>
					}
				</div>
			</div>
		</div>
	);
}
