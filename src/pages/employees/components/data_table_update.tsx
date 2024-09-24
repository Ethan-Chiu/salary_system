import { type ColumnDef } from "@tanstack/react-table";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent } from "~/components/ui/tabs";

import { DataTableToolbarUpdate } from "./data_table_toolbar_update";
import { useState } from "react";
import { EmpTabsEnum, type EmpTabsEnumType } from "./context/employee_tabs_enum";
import { CurrentView } from "./current_view/current_view";
import { HistoryView } from "./history_view/history_view";
import { type HistoryQueryFunctionType } from "~/components/data_table/history_data_type";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
  historyDataFunction: HistoryQueryFunctionType
	filterColumnKey?: keyof TData;
}

export function DataTableUpdate<TData>({
  columns,
  data,
  historyDataFunction,
	filterColumnKey,
}: DataTableProps<TData>) {

	const [selectedTab, setSelectedTab] = useState<EmpTabsEnumType>(
		EmpTabsEnum.Enum.current
	);


	return (
		<Tabs
			defaultValue={EmpTabsEnum.Enum.current}
			className="h-full w-full"
			onValueChange={(tab) => {
				setSelectedTab(EmpTabsEnum.parse(tab));
			}}
		>
			<div className="flex h-full w-full flex-col rounded-md border">
				<DataTableToolbarUpdate
					filterColumnKey={filterColumnKey}
				/>
				<Separator />
				<TabsContent value={EmpTabsEnum.Enum.current} asChild>
					<div className="flex h-0 w-full flex-grow flex-col">
            <CurrentView columns={columns} data={data} />
					</div>
				</TabsContent>
				<TabsContent value={EmpTabsEnum.Enum.history} asChild>
					<div className="flex h-0 w-full flex-grow flex-col">
            <HistoryView columns={columns} dataFunction={historyDataFunction} />
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
