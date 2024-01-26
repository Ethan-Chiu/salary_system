import { DataTableViewOptions } from "../../../components/data_table/data_table_view_options";
import { Input } from "~/components/ui/input";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import ToolbarFunctionsProvider from "./function_sheet/functions_context";
import { useContext, useEffect, useState } from "react";
import dataTableContext from "./context/data_table_context";
import { DataTableFunctions } from "./function_sheet/data_table_functions";
import { LoadingSpinner } from "~/components/loading";

interface DataTableToolbarProps<TData> {
	filterColumnKey: keyof TData;
	showTabs?: boolean;
}

export function DataTableToolbar<TData>({
	filterColumnKey,
	showTabs,
}: DataTableToolbarProps<TData>) {
	const { selectedTab, selectedTableType, selectedTable } =
		useContext(dataTableContext);

	const [filterValue, setFilterValue] = useState("");

	useEffect(() => {
		if (selectedTable) {
			setFilterValue("");
			selectedTable
				.getColumn(filterColumnKey.toString())
				?.setFilterValue("");
		}
	}, [selectedTab, selectedTable]);

	if (!selectedTable) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	return (
		<div className="flex flex-row items-center justify-between space-x-2 px-2 py-2">
			{/* search bar */}
			<Input
				placeholder="Filter setting..."
				value={filterValue}
				onChange={(event) => {
					selectedTable!
						.getColumn(filterColumnKey.toString())
						?.setFilterValue(event.target.value);
					setFilterValue(event.target.value);
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
			{/* <DataTableViewOptions /> */}
			{/* Toolbar functions */}
			<ToolbarFunctionsProvider selectedTableType={selectedTableType}>
				<DataTableFunctions tableType={selectedTableType} />
			</ToolbarFunctionsProvider>
		</div>
	);
}
