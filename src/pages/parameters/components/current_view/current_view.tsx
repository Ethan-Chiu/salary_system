import React, { useContext, useEffect, useState } from "react";
import dataTableContext from "../context/data_table_context";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";
import {
	ColumnDef,
	Table,
} from "@tanstack/react-table";
import {
	withDataTableStandardState,
} from "~/components/data_table/default/data_table_standard_state";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
}
export default function CurrentView<TData>({
	columns,
	data,
}: DataTableProps<TData>) {
	return withDataTableStandardState({
		columns: columns,
		data,
		props: {},
		WrappedComponent: CurrentViewContent,
	});
}

function CurrentViewContent<TData>({ table }: { table: Table<TData> }) {
	const [dataPerRow, setDataPerRow] = useState(1);

	return (
		<>
			{/* table header and body */}
			<div className="h-0 w-full flex-grow">
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
