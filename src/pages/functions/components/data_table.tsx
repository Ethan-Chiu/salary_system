import * as React from "react";
import {
	type ColumnDef,
	type Table,
} from "@tanstack/react-table";

import { Separator } from "~/components/ui/separator";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardToolbar } from "~/components/data_table/default/data_table_standard_toolbar";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";
import { WithDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	filterColumnKey: keyof TData;
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
	filterColumnKey: keyof TData;
}) {
	const [dataPerRow, setDataPerRow] = React.useState(1);

	return (
		<>
			<DataTableStandardToolbar
				table={table}
				filterColumnKey={filterColumnKey}
			/>

			<Separator />

			<DataTableStandardBody table={table} dataPerRow={dataPerRow} />

			<DataTablePagination
				table={table}
				setDataPerRow={setDataPerRow}
				className="bg-secondary"
			/>
		</>
	);
}
