import { type ColumnDef, type Table } from "@tanstack/react-table";
import { useContext, useState } from "react";
import dataTableContext from "../context/data_table_context";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { WithDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	filterColumnKey: keyof TData;
	showTabs?: boolean;
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
	const { setSelectedTable } = useContext(dataTableContext);

	return WithDataTableStandardState({
		columns: columns,
		data,
		props: {},
		WrappedComponent: HistoryViewContent,
		onUpdate: (table) => {
			setSelectedTable({ table: table, key: Math.random().toString() });
		},
	});
}

function HistoryViewContent<TData>({ table }: { table: Table<TData> }) {
	const [dataPerRow, setDataPerRow] = useState(1);

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-0 w-full flex-grow flex-col">
				{/* table header and body */}
				<div className="h-0 w-full flex-grow">
					<DataTableStandardBody
						table={table}
						dataPerRow={dataPerRow}
					/>
				</div>
				{/* table pagination */}
				<DataTablePagination
					table={table}
					setDataPerRow={setDataPerRow}
					className="bg-secondary"
				/>
			</div>
		</div>
	);
}
