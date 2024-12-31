import { DataTableViewOptions } from "../../../components/data_table/toolbar/data_table_view_options";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import ParameterToolbarFunctionsProvider from "./function_sheet/parameter_functions_context";
import { useContext } from "react";
import dataTableContext from "./context/data_table_context";
import { DataTableFunctions as DataTableFunctionsSingle } from "./function_sheet/data_table_functions_single";
import { DataTableFunctions } from "./function_sheet/data_table_functions";
import { LoadingSpinner } from "~/components/loading";
import { TabsEnum } from "./context/tabs_enum";
import { CalendarToolbarFunctions } from "./calendar_view/components/calendar_toolbar_functions";
import { hasHistory } from "./data_table_tabs_config";
import { ToolbarFilter } from "~/components/data_table/toolbar/toolbar_filter";
import periodContext from "~/components/context/period_context";
import { useTranslation } from "react-i18next";
import { StatsPanel } from "~/components/data_table/toolbar/stats_panel";
import { DataTableToolbarWrapper } from "~/components/data_table/toolbar/data_table_toolbar_wrapper";

interface DataTableToolbarProps<TData> {
	filterColumnKey?: keyof TData;
	showTabs?: boolean;
}

export function DataTableToolbar<TData>({
	filterColumnKey,
	showTabs,
}: DataTableToolbarProps<TData>) {
	const { data, selectedTableType, selectedTable } =
		useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);
	const table = selectedTable?.table;
	const { t } = useTranslation(["common"]);

	if (!table) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	return (
		<DataTableToolbarWrapper>
			{/* search bar */}
			<div className="flex">
				<ToolbarFilter table={table} filterColumnKey={filterColumnKey} />
				<StatsPanel table={table} />
			</div>
			{/* tabs */}
			<div className="flex">
				{showTabs !== false && (
					<TabsList className="grid h-8 w-96 grid-cols-3">
						<TabsTrigger value={TabsEnum.Enum.current} className="h-6">
							{t("table.current")}
						</TabsTrigger>
						<TabsTrigger
							disabled={!hasHistory(selectedTableType)}
							value={TabsEnum.Enum.history}
							className="h-6"
						>
							{t("table.history")}
						</TabsTrigger>
						<TabsTrigger
							disabled={!hasHistory(selectedTableType)}
							value={TabsEnum.Enum.calendar}
							className="h-6"
						>
							{t("table.calendar")}
						</TabsTrigger>
					</TabsList>
				)}
			</div>
			<div className="flex">
				<DataTableViewOptions table={table} />
				<div className="w-24 ml-2">
					{selectedPeriod && (
						<ParameterToolbarFunctionsProvider
							selectedTableType={selectedTableType}
							period_id={selectedPeriod.period_id}
						>
							<div className="flex">
								{data && <DataTableFunctionsSingle />}
								<DataTableFunctions tableType={selectedTableType} />
							</div>
							{/* {selectedTab === TabsEnum.Enum.calendar && (
								<CalendarToolbarFunctions
									tableType={selectedTableType}
								/>
							)} */}
						</ParameterToolbarFunctionsProvider>
					)}
				</div>
			</div>
		</DataTableToolbarWrapper>
	);
}
