import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { api } from "~/utils/api";
import { Separator } from "~/components/ui/separator";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
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
import { List } from "postcss/lib/list";
import { isNumber, isDate, isString } from "../utils/checkType";
import { toast } from "~/components/ui/use-toast";

export type SettingItem = {
	name: string;
	value: number | string | Date;
	setting?: (number | string)[];
};

export function createSettingItem(
	name: string,
	value: number | string | Date,
	setting?: (number | string)[]
) {
	if (setting) return { name: name, value: value, setting: setting };
	let x: SettingItem = { name: name, value: value };
	return x;
}

export function ParameterTable({
	table_name,
	table_type,
	defaultData,
	index,
	globalFilter,
	createFunction,
	updateFunction,
}: any) {	
	const [data, setData] = useState<SettingItem[]>(defaultData);
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
				<div className="pl-4 lowercase">{row.getValue("name")}</div>
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
				else if (isDate(value))
				{
					if(value)
					{	
						formatted = (value as Date).toISOString().split("T")[0] ?? "";
					}
					else	formatted = "";
				}
				return <div className="text-center font-medium">{formatted}</div>;
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const setting = row.original;
				return <CompDropdown ID={(data.find((x) => x.name === "id"))?.value as number} setting={setting} updateFunction={updateFunction}/>;
			},
		},
	];
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

	useEffect(() => {
		childFunctionRef.current();
	}, []);

	useMemo(() => {
		table
			.getColumn(filter_key)
			?.setFilterValue(globalFilter);
	}, [globalFilter])

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
							disabled = {globalFilter !== ""}
							placeholder="Filter setting..."
							value={
								(globalFilter === "") 
								? ((table.getColumn(filter_key)?.getFilterValue() as string) ?? "")
								: (globalFilter)
							}
							onChange={(event) => {
								console.log("changed");
								table
									.getColumn(filter_key)
									?.setFilterValue(event.target.value);
							}
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
								onClick={() => setShowDialog(true)}
								disabled={false}
							>
								Create
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
						<CreateAllDialog
							name={table_name}
							type={table_type}
							datas={data}
							showDialog={showDialog}
							onOpenChange={(open: boolean) => {
								setShowDialog(open);
							}}
						/>
					</div>
				</AccordionContent>
			</AccordionItem>
		</>
	);
}

function CompDropdown({ ID, setting, updateFunction }: { ID: number, setting: SettingItem, updateFunction: (d:any) => void }) {
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
						Create
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<CreateDialog
				ID = {ID}
				setting={setting}
				showDialog={showDialog}
				onOpenChange={(open: boolean) => {
					setShowDialog(open);
				}}
				updateFunction={updateFunction}
			/>
		</>
	);
}

function CreateDialog({
	ID,
	setting,
	showDialog,
	onOpenChange,
	schema,
	updateFunction,
}: {
	ID: number;
	setting: SettingItem;
	showDialog: boolean;
	onOpenChange: (open: boolean) => void;
	schema?: any;
	updateFunction: (d: any) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	if(!schema)
		schema = isDate(setting.value)?z.date():isString(setting.value)?z.string().max(10):z.number().min(0);
	const [isValid, setIsValid] = useState(schema.safeParse(setting.value).success);
	const updateIsValid = (x: string | number | Date) => {setIsValid(schema.safeParse(x).success);console.log("update")}
	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create the value</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="value" className="text-right">
							{setting.name}
						</Label>
						{setting.setting ? (
							<>
								<Select
									onValueChange={(v) => {
										setting.value = v;
									}}
								>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Select a value" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Type</SelectLabel>
											{setting.setting.map((option) => {
												return (
													<SelectItem
														value={
															typeof option ===
															"number"
																? option.toString()
																: option
														}
													>
														{option}
													</SelectItem>
												);
											})}
										</SelectGroup>
									</SelectContent>
								</Select>
							</>
						) : isNumber(setting.value) ? <Input
								ref={inputRef}
								id="value"
								defaultValue={setting.value.toString()}
								type={
									isNumber(setting.value)
										? "number"
										: "value"
								}
								className="col-span-3"
								onChange={() => updateIsValid(parseFloat(inputRef.current?.value??"0"))}
							/>:
						  isString(setting.value) ? (
							<Input
								ref={inputRef}
								id="value"
								defaultValue={setting.value as string}
								type={
									isNumber(setting.value)
										? "number"
										: "value"
								}
								className="col-span-3"
								onChange={() => {updateIsValid(inputRef.current?.value??'');}}
							/>
						) : (
							<Input
								ref={inputRef}
								id="value"
								defaultValue={
									(setting.value)?(setting.value as Date).toISOString().split("T")[0]:""
								}
								type={"date"}
								className="col-span-3"
							/>
						)}
					</div>
					
					{
						(!isValid)?
						<Label htmlFor="value" className="text-justify; text-red-500">The input value is invalid</Label>
						:<></>
					}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							disabled={!isValid}
							type="submit"
							onClick={() => {
								const value = setting.setting
								? setting.value
								: typeof setting.value === "string"
								? inputRef.current?.value
								: typeof setting.value === "number"
								? Number(inputRef.current?.value)
								: inputRef.current?.valueAsDate;

								let { ["value"]: x, ...rest } = setting;
								let newItem = { ...rest, ["value"]: value };
								// 待補
								console.log(ID)
								console.log(newItem);
								if(newItem.name !== "id")
									updateFunction({[setting.name]: value, id: ID});
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

function CreateAllDialog({
	name,
	type,
	datas,
	showDialog,
	onOpenChange,
}: {
	name: string;
	type: string;
	datas: SettingItem[];
	showDialog: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	let newValues = datas;
	const lookup = (name: string, l: SettingItem[]) => {
		return l.findIndex((obj) => obj.name === name);
	};
	const setNewValues = (
		toChangeIndex: number,
		value: string | number | Date
	) => {
		newValues =
			newValues.map((item: SettingItem, index: number) => {
				if (index === toChangeIndex) {
					return { ...item, ["value"]: value };
				}
				return item;
			}) ?? [];
	};

	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent
				className={"max-h-screen overflow-y-scroll lg:max-w-screen-lg"}
			>
				<DialogHeader>
					<DialogTitle className="text-center">
						Add Data to [{name}]
					</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-5 items-center gap-4 py-4">
					{datas
						.filter(x => x.name !== "id" && x.name !== "create_by" && x.name != "update_by")
						.map((data: any, index: number) => {
						return (
							<>
								<div className="col-span-1 text-center">
									<Label htmlFor="value"> {data.name} </Label>
								</div>

								{data.setting ? (
									<div className={"col-span-4"}>
										<Select
											onValueChange={(v) => {
												setNewValues(index, v);
											}}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select a value" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>
														Type
													</SelectLabel>
													{data.setting.map(
														(option: any) => {
															return (
																<SelectItem
																	value={
																		typeof option ===
																		"number"
																			? option.toString()
																			: option
																	}
																>
																	{option}
																</SelectItem>
															);
														}
													)}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								) : (
									<Input
										id={"value" + index.toString()}
										type={
											isDate(data.value)
												? "date"
												: isString(data.value)
												? "value"
												: "number"
										}
										className={"col-span-4"}
										// className="col-span-3"
										onChange={(e) => {
											setNewValues(index, e.target.value);
										}}
									/>
								)}
							</>
						);
					})}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="submit"
							onClick={() => {
								console.log(newValues);
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
