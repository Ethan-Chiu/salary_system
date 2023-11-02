import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

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
import {
	ArrowUpDown,
	ChevronDown,
	MoreHorizontal,
	Settings,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "~/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { type ReactElement, useRef, useState, useEffect, useMemo } from "react";
import { DATA, createDATA } from "./datatype";

export type SettingItem = {
	name: string;
	value: number | string;
};

export function createSettingItem(name: string, value: number|string) {
	let x: SettingItem = {name: name, value: value}
	return x
}

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
					Setting
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="pl-4 lowercase">{row.getValue("name")}</div>
		),
	},
	{
		accessorKey: "value",
		header: () => <div className="text-center">Value</div>,
		cell: ({ row }) => {
			var formatted = "";
			switch (typeof row.getValue("value")) {
				case "number":
					formatted = parseFloat(row.getValue("value")).toString();
					break;
				case "string":
					formatted = row.getValue("value");
					break;
			}
			return <div className="text-center font-medium">{formatted}</div>;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const setting = row.original;
			return <CompDropdown setting={setting} />;
		},
	},
];

export function ParameterTable({table_name, table_type, defaultData, index, onChildFunctionRun}: any){
	const [data, setData] = useState<SettingItem[]>(defaultData);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	useEffect(() => {
		console.log("here")
		setData(defaultData);

	  }, [defaultData]);


	const filter_key = "name";

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const onceCreated = () => {
		// Do something inside the child function
		setData(defaultData)
		console.log("Child function is called!");
	  };
	// Store the child function in a ref
	const childFunctionRef = useRef(onceCreated);

	useEffect(() => {
		childFunctionRef.current();
	}, []);

	return (
		<>
			<AccordionItem value={"item-" + index.toString()}>
				<AccordionTrigger>{table_name}</AccordionTrigger>
				<AccordionContent>
					{/* top bar */}
					<div className="flex items-center py-6">
						{/* search bar */}
						<Input
							placeholder="Filter setting..."
							value={
								(table
									.getColumn(filter_key)
									?.getFilterValue() as string) ?? ""
							}
							onChange={(event) =>
								table
									.getColumn(filter_key)
									?.setFilterValue(event.target.value)
							}
							className="max-w-sm"
						/>
						{/* select column to show */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="ml-auto">
									Columns{" "}
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column: any) =>
										column.getCanHide()
									)
									.map((column: any) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(
														!!value
													)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					{/* table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								{table
									.getHeaderGroups()
									.map((headerGroup: any) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map(
												(header: any) => {
													return (
														<TableHead
															key={header.id}
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header
																			.column
																			.columnDef
																			.header,
																		header.getContext()
																  )}
														</TableHead>
													);
												}
											)}
										</TableRow>
									))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row: any) => (
										<TableRow
											key={row.id}
											data-state={
												row.getIsSelected() &&
												"selected"
											}
										>
											{row
												.getVisibleCells()
												.map((cell: any) => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column
																.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					{/* buttons */}
					<div className="flex items-center justify-end space-x-2 py-4">
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									// setShowDialog(true);
									console.log("click Add button");
								}}
								disabled={false}
							>
								Add
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								Next
							</Button>
						</div>
						{/* {table_status[index]?<InsertDialog
							name={datas[index]!.table_name}
							type={datas[index]!.table_type}
							data={datas[index]!.table_content}
							showDialog={showDialog}
							onOpenChange={(open: boolean) => {
								setShowDialog(open);
							}}
						/>:<></>} */}
					</div>
				</AccordionContent>
			</AccordionItem>
		</>
	);
}

function CompDropdown({ setting }: { setting: SettingItem }) {
	const [showDialog, setShowDialog] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => {
							void (async () => {
								await navigator.clipboard.writeText(
									setting.value.toString()
								);
							})();
						}}
					>
						Copy Value
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							setShowDialog(true);
						}}
					>
						Modify
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<CompDialog
				setting={setting}
				showDialog={showDialog}
				onOpenChange={(open: boolean) => {
					setShowDialog(open);
				}}
			/>
		</>
	);
}




function CompDialog({
	setting,
	showDialog,
	onOpenChange,
}: {
	setting: SettingItem;
	showDialog: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	if(typeof(setting))	return <></>
	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Modify the value of {setting.name}
					</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="value" className="text-right">
							Value
						</Label>
						<Input
							ref={inputRef}
							id="value"
							defaultValue={setting.value.toString()}
							type={
								Number.isInteger(setting.value)
									? "number"
									: "value"
							}
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="submit"
							onClick={() => {
								const value = Number(inputRef.current?.value);
							}}
						>
							Save changes
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
