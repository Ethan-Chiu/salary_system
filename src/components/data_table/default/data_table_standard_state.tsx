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
import { ComponentType, useContext, useEffect, useState } from "react";
import dataTableContext from "~/pages/parameters/components/context/data_table_context";

type WithTableProps<TableT, P> = { table: TableT } & P;

interface DataTableStandardStateProps<TData, P> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	WrappedComponent: ComponentType<WithTableProps<Table<TData>, P>>;
	props: P;
}

export function withDataTableStandardState<TData, P>({
	columns,
	data,	
	WrappedComponent,
	props,
} : DataTableStandardStateProps<TData, P>) {
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

	const { setSelectedTable } = useContext(dataTableContext);

	useEffect(() => {
		setSelectedTable({ table: table, key: Math.random().toString() });
	}, [table.getState().columnVisibility, table, setSelectedTable]);


	return <WrappedComponent {...props} table={table} />;
}
