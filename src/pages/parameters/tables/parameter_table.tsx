import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	Row,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { type ReactElement, useRef, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
	isString,
	isNumber,
	isDate,
} from "~/pages/develop_parameters/utils/checkType";
import { Translate } from "~/pages/develop_parameters/utils/translation";
import { DataTable } from "../components/data_table";

export type SettingItem = {
	name: string;
	value: number | string | Date;
	setting?: (number | string)[];
};

export function ParameterTable({
	table_name,
	table_type,
	defaultData,
	index,
	globalFilter,
	createFunction,
	updateFunction,
}: any) {
	const router = useRouter();

	const [data, setData] = useState<SettingItem[]>(defaultData);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});

	const [showDialog, setShowDialog] = useState(false);

	const filter_key = "name";

	const columns: ColumnDef<SettingItem>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Parameter
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="pl-4 lowercase">
					{Translate(row.getValue("name"))}
				</div>
			),
		},
		{
			accessorKey: "value",
			header: () => <div className="text-center">Value</div>,
			cell: ({ row }) => {
				let value = row.getValue("value");
				var formatted = "";
				if (isNumber(value))
					formatted = parseFloat(row.getValue("value")).toString();
				else if (isString(value)) formatted = row.getValue("value");
				else if (isDate(value)) {
					if (value) {
						formatted =
							(value as Date).toISOString().split("T")[0] ?? "";
					} else formatted = "";
				}
				return (
					<div className="text-center font-medium">{formatted}</div>
				);
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const setting = row.original;
				return <></>;
			},
		},
	];

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);

	return (
		<>
			<AccordionItem value={"item-" + index.toString()}>
				<AccordionTrigger>{table_name}</AccordionTrigger>
				<AccordionContent>
					{/* table */}
					<DataTable columns={columns} data={[]}/>
					{/* buttons */}
					{/* <CompTablePagination /> */}
				</AccordionContent>
			</AccordionItem>
		</>
	);

	// TODO: move
	// function CompTablePagination() {
	// 	return (
	// 		<div className="flex items-center justify-end space-x-2 py-4">
	// 			<div className="space-x-2">
	// 				<Button variant="outline" size="sm" onClick={() => {}}>
	// 					Create
	// 				</Button>
	// 				<Button
	// 					variant="outline"
	// 					size="sm"
	// 					onClick={() => table.previousPage()}
	// 					disabled={!table.getCanPreviousPage()}
	// 				>
	// 					Previous
	// 				</Button>
	// 				<Button
	// 					variant="outline"
	// 					size="sm"
	// 					onClick={() => table.nextPage()}
	// 					disabled={!table.getCanNextPage()}
	// 				>
	// 					Next
	// 				</Button>
	// 			</div>
	// 		</div>
	// 	);
	// }
}
