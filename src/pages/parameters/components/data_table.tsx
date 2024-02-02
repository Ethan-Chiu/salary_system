import { ColumnDef } from "@tanstack/react-table";

import { Table } from "~/components/ui/table";
import { DataTableToolbar } from "./data_table_toolbar";
import { DataTablePagination } from "../../../components/data_table/data_table_pagination";
import { Separator } from "~/components/ui/separator";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { DataTableDataHeader } from "../../../components/data_table/data_table_data_header";
import { DataTableDataBody } from "../../../components/data_table/data_table_data_body";
import CalendarView from "./calendar_view/calendar_view";
import { useContext, useEffect, useState } from "react";
import dataTableContext from "./context/data_table_context";
import { TabsEnum } from "./context/tabs_enum";
import CompHistoryView from "./history_view/history_view";
import CurrentView from "./current_view/current_view";

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
	const { selectedTab, setSelectedTab, selectedTable } =
		useContext(dataTableContext);

	return (
		<Tabs
			defaultValue="now"
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
				<TabsContent value="now" asChild>
					<div className="flex min-h-0 w-full flex-grow flex-col">
						<CurrentView columns={columns} data={data} />
					</div>
				</TabsContent>
				<TabsContent value="history" asChild className="m-0">
					<div className="flex min-h-0 w-full flex-grow flex-col">
						<CompHistoryView />
					</div>
				</TabsContent>
				<TabsContent value="calendar" asChild className="m-0">
					<div className="flex min-h-0 w-full flex-grow flex-col">
						<CalendarView />
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
