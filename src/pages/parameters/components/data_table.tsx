import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Table } from "~/components/ui/table";
import { DataTableToolbar } from "./data_table_toolbar";
import { DataTablePagination } from "./data_table_pagination";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { DataTableDataHeader } from "./data_table_data_header";
import { DataTableDataBody } from "./data_table_data_body";
import CalendarView from "./calendar_view/calendar_view";

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
		<Tabs defaultValue="now" className="h-full w-full">
			<div className="flex h-full flex-col">
				{/* TODO: fix global filter*/}
				<DataTableToolbar
					table={table}
					globalFilter=""
					filterKey={filterColumnKey}
				/>
				<Separator />
				<TabsContent value="now" asChild>
					<div className="flex min-h-0 w-full flex-grow flex-col">
						{/* table header and body */}
						<div className="min-h-0 w-full flex-grow">
							<ScrollArea className="h-full">
								<Table className="border-b-[1px]">
									<DataTableDataHeader table={table} />
									<DataTableDataBody table={table} />
								</Table>
							</ScrollArea>
						</div>
						{/* table pagination */}
						<DataTablePagination
							table={table}
							className="bg-secondary"
						/>
					</div>
				</TabsContent>
				<TabsContent value="calendar" asChild className="m-0">
					<div className="flex min-h-0 w-full flex-grow flex-col">
						<CalendarView />
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
