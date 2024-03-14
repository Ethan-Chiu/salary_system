import { DataTableViewOptions } from "../../../components/data_table/toolbar/data_table_view_options";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import ParameterToolbarFunctionsProvider from "./function_sheet/parameter_functions_context";
import { useContext } from "react";
import dataTableContext from "./context/data_table_context";
import { DataTableFunctions } from "./function_sheet/data_table_functions";
import { LoadingSpinner } from "~/components/loading";
import { TabsEnum } from "./context/tabs_enum";
import { CalendarToolbarFunctions } from "./calendar_view/components/calendar_toolbar_functions";
import { hasHistory } from "./data_table_tabs_config";
import { ToolbarFilter } from "~/components/data_table/toolbar/toolbar_filter";

interface DataTableToolbarProps<TData> {
	filterColumnKey?: keyof TData;
	showTabs?: boolean;
}

export function DataTableToolbar<TData>({
	filterColumnKey,
	showTabs,
}: DataTableToolbarProps<TData>) {
	const { selectedTab, selectedTableType, selectedTable } =
		useContext(dataTableContext);
	const table = selectedTable?.table;

	if (!table) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	return (
		<div className="flex flex-row items-center justify-between space-x-2 px-2 py-2">
			{/* search bar */}
			<ToolbarFilter table={table} filterColumnKey={filterColumnKey} />
			{/* tabs */}
			{showTabs !== false && (
				<TabsList className="grid h-8 w-96 grid-cols-3">
					<TabsTrigger value={TabsEnum.Enum.current} className="h-6">
						Current
					</TabsTrigger>
					<TabsTrigger
						disabled={!hasHistory(selectedTableType)}
						value={TabsEnum.Enum.history}
						className="h-6"
					>
						History
					</TabsTrigger>
					<TabsTrigger
						disabled={!hasHistory(selectedTableType)}
						value={TabsEnum.Enum.calendar}
						className="h-6"
					>
						Calendar
					</TabsTrigger>
				</TabsList>
			)}
			{/*  */}
			<DataTableViewOptions table={table} />
			{/* Toolbar functions */}
			<div className="w-12">
				<ParameterToolbarFunctionsProvider selectedTableType={selectedTableType}>
					{selectedTab === TabsEnum.Enum.current && (
						<DataTableFunctions tableType={selectedTableType} />
					)}
					{selectedTab === TabsEnum.Enum.calendar && (
						<CalendarToolbarFunctions
							tableType={selectedTableType}
						/>
					)}
				</ParameterToolbarFunctionsProvider>
			</div>
		</div>
	);
}
