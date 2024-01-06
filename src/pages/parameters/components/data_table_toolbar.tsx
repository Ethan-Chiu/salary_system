import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "./data_table_view_options";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { LayoutGrid } from "lucide-react";
import { DataTableFunctions } from "./data_table_functions";
import FunctionsProvider from "./function_sheet/Contexts";

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
	showTabs,
	table_name,
}: DataTableToolbarProps<TData>) {
	return (
		<div className="flex flex-row items-center justify-between px-2 py-2 space-x-2">
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
			{(showTabs!==false) && <TabsList className="grid w-96 grid-cols-3 h-8">
				<TabsTrigger value="now" className="h-6">Now</TabsTrigger>
				<TabsTrigger value="history" className="h-6">History</TabsTrigger>
				<TabsTrigger value="month" className="h-6">Month</TabsTrigger>
			</TabsList>}
			{/*  */}
			<DataTableViewOptions table={table} />
			{table_name && <FunctionsProvider>
				<DataTableFunctions table_name={table_name}/>
			</FunctionsProvider>}
		</div>
	);
}
