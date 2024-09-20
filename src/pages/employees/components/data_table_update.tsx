import { type Table, type ColumnDef } from "@tanstack/react-table";

import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent } from "~/components/ui/tabs";

import { DataTableToolbarUpdate } from "./data_table_toolbar_update";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";
import { WithDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { useState } from "react";
import { EmpTabsEnum, EmpTabsEnumType } from "./context/employee_tabs_enum";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	filterColumnKey?: keyof TData;
}

export function DataTable<TData>({
	columns,
	data,
	filterColumnKey,
}: DataTableProps<TData>) {
	return WithDataTableStandardState({
		columns: columns,
		data,
		props: { filterColumnKey },
		WrappedComponent: DataTableContent,
	});
}

function DataTableContent<TData>({
	table,
	filterColumnKey,
}: {
	table: Table<TData>;
	filterColumnKey?: keyof TData;
}) {
	const [dataPerRow, setDataPerRow] = useState(1);

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
					table={table}
					filterColumnKey={filterColumnKey}
				/>
				<Separator />
				<div className="h-0 flex-grow">
					<DataTableStandardBody
						table={table}
						dataPerRow={dataPerRow}
					/>
				</div>
				<DataTablePagination
					table={table}
					setDataPerRow={setDataPerRow}
					className="bg-secondary"
				/>
			</div>
		</Tabs>
	);
}
