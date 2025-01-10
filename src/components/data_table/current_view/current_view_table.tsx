import { useState } from "react";
import { DataTablePagination } from "../data_table_pagination";
import { DataTableStandardBody } from "../default/data_table_standard_body";
import { type Table } from "@tanstack/react-table";

export function CurrentViewTable<TData>({ table }: { table: Table<TData> }) {
	const [dataPerRow, setDataPerRow] = useState(1);

	return (
		<>
			{/* table header and body */}
			<div className="h-0 flex-grow">
				<DataTableStandardBody table={table} dataPerRow={dataPerRow} />
			</div>
			{/* table pagination */}
			<DataTablePagination
				table={table}
				setDataPerRow={setDataPerRow}
				className="bg-secondary"
			/>
		</>
	);
}
