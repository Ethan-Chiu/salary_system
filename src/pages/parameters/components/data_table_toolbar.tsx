import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "../../../components/data_table/data_table_view_options";
import { Input } from "~/components/ui/input";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import ToolbarFunctionsProvider from "./function_sheet/functions_context";
import { useContext } from "react";
import dataTableContext from "./context/data_table_context";
import { DataTableFunctions } from "./function_sheet/data_table_functions";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	showTabs?: boolean;
}

export function DataTableToolbar<TData>({
	table,
	showTabs,
}: DataTableToolbarProps<TData>) {
	const { selectedTable, selectedTab, filterValue, setFilterValue } = useContext(dataTableContext);

	return (
		<div className="flex flex-row items-center justify-between space-x-2 px-2 py-2">
			{/* search bar */}
			<Input
				placeholder="Filter setting..."
				value={
					filterValue
					// (table
					// 	.getColumn(filterKey.toString())
					// 	?.getFilterValue() as string) ?? ""
				}
				onChange={(event) => {
					setFilterValue(event.target.value)
					// table
					// 	.getColumn(filterKey.toString())
					// 	?.setFilterValue(event.target.value);
				}}
				className="h-8 max-w-sm"
			/>
			{/* tabs */}
			{showTabs !== false && (
				<TabsList className="grid h-8 w-96 grid-cols-3">
					<TabsTrigger value="now" className="h-6">
						Now
					</TabsTrigger>
					<TabsTrigger value="history" className="h-6">
						History
					</TabsTrigger>
					<TabsTrigger value="calendar" className="h-6">
						Calendar
					</TabsTrigger>
				</TabsList>
			)}
			{/*  */}
			<DataTableViewOptions table={table} />
			{/* Toolbar functions */}
			<ToolbarFunctionsProvider selectedTable={selectedTable}>
				<DataTableFunctions tableType={selectedTable} />
			</ToolbarFunctionsProvider>
		</div>
	);
}
