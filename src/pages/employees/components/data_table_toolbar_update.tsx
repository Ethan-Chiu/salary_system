import { DataTableViewOptions } from "~/components/data_table/toolbar/data_table_view_options";
import EmployeeToolbarFunctionsProvider from "./function_sheet/employee_functions_context";
import { DataTableFunctions } from "./function_sheet/data_table_functions";
import { useContext } from "react";
import dataTableContext from "./context/data_table_context";
import periodContext from "~/components/context/period_context";
import { ToolbarFilter } from "~/components/data_table/toolbar/toolbar_filter";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmpTabsEnum } from "./context/employee_tabs_enum";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "~/components/loading";

interface DataTableToolbarProps<TData> {
	filterColumnKey?: keyof TData;
}

export function DataTableToolbarUpdate<TData>({
	filterColumnKey,
}: DataTableToolbarProps<TData>) {
	const { selectedTableType, selectedTable } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);

  const { t } = useTranslation(["common"]);

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
      <TabsList className="grid h-8 w-96 grid-cols-2">
        <TabsTrigger value={EmpTabsEnum.Enum.current} className="h-6">
          {t("table.current")}
        </TabsTrigger>
        <TabsTrigger
          value={EmpTabsEnum.Enum.history}
          className="h-6"
        >
          {t("table.history")}
        </TabsTrigger>
      </TabsList>
			{/* functions */}
			<div className="flex">
				<DataTableViewOptions table={table} />
				<div className="ml-2 w-12">
					{selectedPeriod && (
						<EmployeeToolbarFunctionsProvider
							tableType={selectedTableType}
							period_id={selectedPeriod.period_id}
						>
							<DataTableFunctions tableType={selectedTableType} />
						</EmployeeToolbarFunctionsProvider>
					)}
				</div>
			</div>
		</div>
	);
}
