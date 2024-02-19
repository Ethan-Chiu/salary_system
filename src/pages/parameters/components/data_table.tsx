import { ColumnDef } from "@tanstack/react-table";
import { DataTableToolbar } from "./data_table_toolbar";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import CalendarView from "./calendar_view/calendar_view";
import { useContext, useEffect, useState } from "react";
import dataTableContext from "./context/data_table_context";
import { TabsEnum } from "./context/tabs_enum";
import CompHistoryView from "./history_view/history_view";
import CurrentView from "./current_view/current_view";
import { hasHistory } from "./data_table_tabs_config";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	filterColumnKey: keyof TData;
	showTabs?: boolean;
}

export function DataTable<TData>({
	columns,
	data,
	filterColumnKey,
	showTabs,
}: DataTableProps<TData>) {
	const { selectedTab, setSelectedTab, selectedTable, selectedTableType } =
		useContext(dataTableContext);

	return (
		<Tabs
			defaultValue={
				selectedTab !== TabsEnum.Enum.current &&
				!hasHistory(selectedTableType)
					? TabsEnum.Enum.current
					: selectedTab
			}
			className="h-full w-full"
			onValueChange={(tab) => {
				setSelectedTab(TabsEnum.parse(tab));
			}}
		>
			<div className="flex h-full flex-col">
				<DataTableToolbar
					filterColumnKey={filterColumnKey}
					showTabs={showTabs}
				/>
				<Separator />
				<TabsContent value={TabsEnum.Enum.current} asChild>
					<div className="flex min-h-0 w-full flex-grow flex-col">
						<CurrentView columns={columns} data={data} />
					</div>
				</TabsContent>
				<TabsContent
					value={TabsEnum.Enum.history}
					asChild
					className="m-0"
				>
					<div className="flex min-h-0 w-full flex-grow flex-col">
						<CompHistoryView />
					</div>
				</TabsContent>
				<TabsContent
					value={TabsEnum.Enum.calendar}
					asChild
					className="m-0"
				>
					<div className="flex min-h-0 w-full flex-grow flex-col">
						<CalendarView />
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
