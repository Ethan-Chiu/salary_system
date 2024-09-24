import { useContext, useState } from "react";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";
import { type ColumnDef, type Table } from "@tanstack/react-table";
import { WithDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import dataTableContext from "../context/data_table_context";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
}

export function CurrentView<TData>({
	columns,
	data,
}: DataTableProps<TData>) {
	const { setSelectedTable } = useContext(dataTableContext);

	return WithDataTableStandardState({
		columns: columns,
		data,
		props: {},
		WrappedComponent: CurrentViewContent,
		onUpdate: (table) => {
			setSelectedTable({ table: table });
		},
	});
}

function CurrentViewContent<TData>({ table }: { table: Table<TData> }) {
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
