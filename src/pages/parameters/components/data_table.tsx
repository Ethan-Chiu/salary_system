import * as React from "react";
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
import { DataTableToolbar } from "./data_table_toolbar";
import { DataTablePagination } from "./data_table_pagination";
import { Separator } from "~/components/ui/separator";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { DataTableDataHeader } from "./data_table_data_header";
import { DataTableDataBody } from "./data_table_data_body";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	filterColumnKey: keyof TData;
	showTabs?: boolean;
	table_name?: string;
}

export function DataTable<TData>({
	columns,
	data,
	filterColumnKey,
	showTabs,
	table_name,
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
		<Tabs defaultValue="now" className="h-full w-full">
			<div className="flex h-full flex-col">
				{/* TODO: fix global filter*/}
				<DataTableToolbar
					table={table}
					globalFilter=""
					filterKey={filterColumnKey}
					showTabs={showTabs}
					table_name={table_name}
				/>
				<Separator />
				<TabsContent value="now" asChild>
					<div className="flex min-h-0 w-full flex-grow flex-col">
						{/* table header and body */}
						<div className="min-h-0 w-full flex-grow">
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
								<ScrollBar
									orientation="horizontal"
									hidden={true}
								/>
							</ScrollArea>
						</div>
						{/* table pagination */}
						<DataTablePagination
							table={table}
							setDataPerRow={setDataPerRow}
							className="bg-secondary"
						/>
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
