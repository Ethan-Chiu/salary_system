import * as React from "react";
import { type Table, type ColumnDef } from "@tanstack/react-table";

import { Separator } from "~/components/ui/separator";

import { DataTableToolbar } from "./data_table_toolbar_update";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";
import { WithDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";

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
	const [dataPerRow, setDataPerRow] = React.useState(1);

	return (
		<div className="flex h-full w-full flex-col rounded-md border">
			<DataTableToolbar table={table} filterKey={filterColumnKey} />
			<Separator />
			<div className="h-0 flex-grow">
				<DataTableStandardBody table={table} dataPerRow={dataPerRow} />
			</div>
			<DataTablePagination
				table={table}
				setDataPerRow={setDataPerRow}
				className="bg-secondary"
			/>
		</div>
	);
}
