import React, { useContext, useEffect, useState } from "react";
import dataTableContext from "../context/data_table_context";
import {
	type ColumnDef,
	Table as TableType
} from "@tanstack/react-table";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { withDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
}
export default function CurrentView<TData>({
	columns,
	data,
}: DataTableProps<TData>) {
	const CurrentViewContentWithTable = withDataTableStandardState<TData, {}>(columns, data, CurrentViewContent);
	return <CurrentViewContentWithTable />
}



function CurrentViewContent<TData>({ table }: {table: TableType<TData>}) {
	const { setSelectedTable } = useContext(dataTableContext);

	const [dataPerRow, setDataPerRow] = useState(1);

	useEffect(() => {
		setSelectedTable({ table: table, key: Math.random().toString() });
	}, [table.getState().columnVisibility, table, setSelectedTable]);

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