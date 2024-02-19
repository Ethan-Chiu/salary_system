import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Table } from "~/components/ui/table";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useContext, useEffect, useState } from "react";
import dataTableContext from "../context/data_table_context";
import { DataTableDataHeader } from "~/components/data_table/data_table_data_header";
import { DataTableDataBody } from "~/components/data_table/data_table_data_body";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { randomUUID } from "crypto";

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
	const { setSelectedTable } = useContext(dataTableContext);

	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [dataPerRow, setDataPerRow] = useState(1);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	useEffect(() => {
		setSelectedTable({table: table, key: Math.random().toString()});
	}, [columnVisibility]);

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-0 w-full flex-grow flex-col">
				{/* table header and body */}
				<div className="h-0 w-full flex-grow">
					<ScrollArea className="scroll h-full">
						<Table className="border-b-[1px]">
							<DataTableDataHeader
								table={table}
								dataPerRow={dataPerRow}
							/>
							<DataTableDataBody
								table={table}
								dataPerRow={dataPerRow}
							/>
						</Table>
						<ScrollBar orientation="horizontal" hidden={true} />
					</ScrollArea>
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
