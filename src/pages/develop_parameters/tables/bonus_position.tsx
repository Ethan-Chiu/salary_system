import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
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
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { type ReactElement, useRef, useState, useEffect, useMemo } from "react";

import { DATA, createDATA } from "./datatype";
import { once } from "events";
import { now } from "sequelize/types/utils";
import { string } from "zod";


export type BonusPositionRow = {
	id: number | null;
	position: string;
	multiplier: number;
};

export function createBonusPositionRow(
	id: number | null,
	position: string,
	multiplier: number,
) {
	let x: BonusPositionRow = {
		id: id,
		position: position,
		multiplier: multiplier,
	};
	return x;
}

export function BonusPositionTable({
	table_name,
	table_type,
	defaultData,
	index,
	createFunction,
	updateFunction,
	deleteFunction,
}: any) {

	const columns: ColumnDef<BonusPositionRow>[] = [
		{
			accessorKey: "position",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Position
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				return (
					<div className="pl-4 lowercase">{`${row.original.position}`}</div>
				);
			},
		},
		{
			accessorKey: "multiplier",
			header: () => <div className="text-center">Multiplier</div>,
			cell: ({ row }) => {
				return (
					<div className="text-center font-medium">{`${row.original.multiplier}`}</div>
				);
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const setting = row.original;
				return <CompDropdown setting={setting} deleteFunction={deleteFunction} updateFunction={updateFunction}/>;
			},
		},
	];


	const [data, setData] = useState<BonusPositionRow[]>(defaultData);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});

	const [showDialog, setShowDialog] = useState(false);

	useEffect(() => {
		setData(defaultData);
	}, [defaultData]);

	const filter_key = "position";

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
		setData(defaultData);
	};
	// Store the child function in a ref
	const childFunctionRef = useRef(onceCreated);

	return (
		<>
			<AccordionItem value={"item-" + index.toString()}>
				<AccordionTrigger>{table_name}</AccordionTrigger>
				<AccordionContent>
					{/* top bar */}
					<div className="flex items-center py-6">
						{/* search bar */}
						&nbsp;
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
									setShowDialog(true);
									// console.log("click Add button");
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
						{
							<InsertDialog
								name={table_name}
								type={table_type}
								data={data}
								showDialog={showDialog}
								createFunction={createFunction}
								onOpenChange={(open: boolean) => {
									setShowDialog(open);
								}}
							/>
						}
					</div>
				</AccordionContent>
			</AccordionItem>
		</>
	);
}

function CompDropdown({ setting, deleteFunction, updateFunction }: { setting: BonusPositionRow, deleteFunction: (d: any)=>void, updateFunction: (d: any)=>void}) {
	const [showModifyDialog, setShowModifyDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							setShowModifyDialog(true);
						}}
					>
						Modify
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							setShowDeleteDialog(true);
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ModifyDialog
				setting={setting}
				showDialog={showModifyDialog}
				updateFunction={updateFunction}
				onOpenChange={(open: boolean) => {
					setShowModifyDialog(open);
				}}
			/>

			<DeleteDialog
				showDialog={showDeleteDialog}
				setting={setting}
				message="Are you sure you want to proceed?"
				title="Confirmation"
				deleteFunction={deleteFunction}
				onOpenChange={(open: boolean) => {
					setShowDeleteDialog(open);
				}}
			/>
		</>
	);
}

function ModifyDialog({
	setting,
	showDialog,
	updateFunction,
	onOpenChange,
}: {
	setting: BonusPositionRow;
	showDialog: boolean;
	updateFunction: (d: any) => void;
	onOpenChange: (open: boolean) => void;
}) {

	const { toast } = useToast();
	const [updatedSetting, setUpdatedSetting] = useState(setting);
	const handleInputChange = (key: any, value: any) => {
		setUpdatedSetting((prevSetting: any) => ({
			...prevSetting,
			[key]: value,
		}));
	};

	// {Object.entries(setting).map(([key, value]) => {console.log("%s %s  %s", key, typeof value, typeof value)})}

	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Modify</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						{Object.entries(setting).map(([key, value]) => {
							if (key == "id")	return <></>;
							return (
								<>
									<Label
										htmlFor="value"
										className="text-right"
									>
										{key}
									</Label>
									
									{
										<Input
											id={key}
											disabled={(key=="bank_code")?true:false}
											defaultValue={(value as string)!}
											type={(typeof value === "string")?"value":"number"}
											className="col-span-3"
											onChange={(e) =>
												handleInputChange(
													key,
													e.target.value
												)
											}
										/>
									}
								</>
							);
						})}
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="submit"
							onClick={() => {
								toast({
									title: "Succesfully Modify Bank Setting",
									description: (new Date()).toISOString().split('T')[0],
									action: (
									<ToastAction altText="Goto schedule to undo" onClick={() => {
										console.log("undo update (set bank setting to previous setting)")
										updateFunction(setting);
									}}>Undo</ToastAction>
									),
								})
								
								console.log("update bank setting")
								updateFunction(
									{
										id: updatedSetting.id,
										position: updatedSetting.position,
										multiplier: updatedSetting.multiplier,
									}
								)
							
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

function DeleteDialog({
	title,
	message,
	setting,
	showDialog,
	deleteFunction,
	onOpenChange,
}: {
	title: string;
	message: string;
	setting: BonusPositionRow;
	showDialog: boolean;
	deleteFunction: (d: any) => void;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">{message}</div>
				<DialogFooter>
					<DialogClose>
						<Button
							onClick={() => {
								console.log("no delete");
							}}
						>
							No
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							variant={"destructive"}
							onClick={() => {
								console.log("delete data with id %s", setting.id!)
								deleteFunction({id: setting.id!});
							}}
						>
							Yes
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function InsertDialog({
	name,
	type,
	data,
	showDialog,
	createFunction,
	onOpenChange,
}: {
	name: string;
	type: string;
	data: any;
	showDialog: boolean;
	createFunction: (d: any)=>void;
	onOpenChange: (open: boolean) => void;
}) {
	let rows = ["部門", "倍率"];
	const lookup = (key: string) => {return rows.findIndex(obj => obj===key)};
	const inputRef = rows.map(() => {
		return useRef<HTMLInputElement>(null);
	});

	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent
				className={"max-h-screen overflow-y-scroll lg:max-w-screen-lg"}
			>
				<DialogHeader>
					<DialogTitle>Add Data to [{name}]</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						{rows.map((parameter: any, index: number) => {
							return (
								<>
									<Label
										htmlFor="value"
										className="text-right"
									>
										{parameter}
									</Label>
									<Input
										ref={inputRef[index]}
										id={"value" + index.toString()}
										type={(parameter === "部門")?"value":"number"}
										className="col-span-3"
									/>
								</>
							);
						})}
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="submit"
							onClick={() => {
								createFunction(
									{
										department: inputRef[lookup("部門")]?.current?.value ?? "", 
										multiplier: inputRef[lookup("倍率")]?.current?.valueAsNumber ?? 0,
									}
								)
							}}
						>
							Confirm
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
