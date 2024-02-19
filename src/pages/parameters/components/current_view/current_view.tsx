import React, { useContext, useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import dataTableContext from "../context/data_table_context";
import { Table } from "~/components/ui/table";
import { DataTableDataHeader } from "~/components/data_table/data_table_data_header";
import { DataTableDataBody } from "~/components/data_table/data_table_data_body";
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
import { DataTablePagination } from "~/components/data_table/data_table_pagination";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
}
export default function CurrentView<TData>({
	columns,
	data,
}: DataTableProps<TData>) {
	const { selectedTab, setSelectedTab, selectedTable, setSelectedTable } =
		useContext(dataTableContext);

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
		setSelectedTable({ table: table, key: Math.random().toString() });
	}, [columnVisibility]);

	return (
		<>
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
		</>
	);
}
