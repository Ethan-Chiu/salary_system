import * as React from "react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Separator } from "~/components/ui/separator";

import { DataTableToolbar } from "./data_table_toolbar_update";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";

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
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [dataPerRow, setDataPerRow] = React.useState(1);

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

	return (
		<>
			{/* TODO: fix global filter*/}
			<DataTableToolbar
				table={table}
				globalFilter=""
				filterKey={filterColumnKey}
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
