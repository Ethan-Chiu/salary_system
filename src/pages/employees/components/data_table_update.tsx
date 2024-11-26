import { type ColumnDef } from "@tanstack/react-table";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent } from "~/components/ui/tabs";

import { DataTableToolbarUpdate } from "./data_table_toolbar_update";
import { useContext } from "react";
import { EmpTabsEnum } from "./context/employee_tabs_enum";
import { CurrentView } from "./current_view/current_view";
import { HistoryView } from "./history_view/history_view";
import { HistoryDataType, type EmployeeCalenderQueryFunctionType, type EmployeeHistoryQueryFunctionType } from "~/components/data_table/history_data_type";
import { type EmployeeHistoryViewCommonEmpInfo } from "./history_view/history_view";
import dataTableContext from "./context/data_table_context";
import CalendarView from "./calendar_view/calendar_view";

type DataRow = EmployeeHistoryViewCommonEmpInfo & HistoryDataType;

interface DataTableProps<TData extends DataRow> {
	columns: ColumnDef<DataRow, any>[];
	columnNames?: Array<String>;
	data: TData[];
	historyDataFunction: EmployeeHistoryQueryFunctionType<TData>;
	calendarDataFunction: EmployeeCalenderQueryFunctionType<TData>;
	filterColumnKey?: keyof TData;
}

export function DataTableUpdate<TData extends DataRow>({
	columns,
	columnNames,
	data,
	historyDataFunction,
	calendarDataFunction,
	filterColumnKey,
}: DataTableProps<TData>) {
	const { selectedTab, setSelectedTab } = useContext(dataTableContext);

	return (
		<Tabs
			defaultValue={selectedTab}
			className="h-full w-full"
			onValueChange={(tab) => {
				setSelectedTab(EmpTabsEnum.parse(tab));
			}}
		>
			<div className="flex h-full w-full flex-col rounded-md border">
				<DataTableToolbarUpdate filterColumnKey={filterColumnKey} columns={columnNames} />
				<Separator />
				<TabsContent value={EmpTabsEnum.Enum.current} asChild>
					<div className="flex h-0 w-full flex-grow flex-col">
						<CurrentView columns={columns} data={data} />
					</div>
				</TabsContent>
				<TabsContent value={EmpTabsEnum.Enum.history} asChild>
					<div className="flex h-0 w-full flex-grow flex-col">
						<HistoryView
							columns={columns}
							dataFunction={historyDataFunction}
						/>
					</div>
				</TabsContent>
				<TabsContent value={EmpTabsEnum.Enum.calendar} asChild>
					<div className="flex h-0 w-full flex-grow flex-col">
						<CalendarView
							dataFunction={calendarDataFunction} />
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
