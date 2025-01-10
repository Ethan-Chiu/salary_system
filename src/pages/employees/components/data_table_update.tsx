import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { DataTableToolbarUpdate } from "./data_table_toolbar_update";
import { EmpTabsEnum } from "./context/employee_tabs_enum";
import { HistoryView } from "./history_view/history_view";
import { type HistoryDataType, type EmployeeHistoryQueryFunctionType } from "~/components/data_table/history_data_type";
import { type EmployeeHistoryViewCommonEmpInfo } from "./history_view/history_view";
import { useEmployeeTableContext } from "./context/data_table_context_provider";
import { CurrentViewSelector } from "./current_view/current_view_selector";

type DataRow = EmployeeHistoryViewCommonEmpInfo & HistoryDataType;

interface DataTableProps<TData extends DataRow> {
	columnNames?: Array<string>;
	historyDataFunction: EmployeeHistoryQueryFunctionType<TData>;
	filterColumnKey?: keyof TData;
}

export function DataTableUpdate<TData extends DataRow>({
	columnNames,
	historyDataFunction,
	filterColumnKey,
}: DataTableProps<TData>) {
	const { selectedTab, setSelectedTab } = useEmployeeTableContext();

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
            <CurrentViewSelector />
					</div>
				</TabsContent>
				<TabsContent value={EmpTabsEnum.Enum.history} asChild>
					<div className="flex h-0 w-full flex-grow flex-col">
						{/* <HistoryView */}
						{/* 	columns={columns} */}
						{/* 	dataFunction={historyDataFunction} */}
						{/* /> */}
					</div>
				</TabsContent>
				{/* <TabsContent value={EmpTabsEnum.Enum.calendar} asChild> */}
				{/* 	<div className="flex h-0 w-full flex-grow flex-col"> */}
						{/* <CalendarView */}
						{/* 	dataFunction={calendarDataFunction} /> */}
					{/* </div> */}
				{/* </TabsContent> */}
			</div>
		</Tabs>
	);
}
