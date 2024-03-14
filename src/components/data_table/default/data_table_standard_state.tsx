import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	Table,
	VisibilityState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ComponentType, FC, useState } from "react";

type WithTableProps<TableT, P> = { table: TableT } & P;

export function withDataTableStandardState<TData, P>(
	columns: ColumnDef<TData, any>[],
	data: TData[],
	WrappedComponent: ComponentType<WithTableProps<Table<TData>, P>>
): FC<P> {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

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

	return function WithTableState(props: P) {
		return <WrappedComponent {...props} table={table} />;
	};
}
