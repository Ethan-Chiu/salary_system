import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "~/components/ui/dialog";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement, useRef, useState, useEffect } from "react";
import { table } from "console";
import { ConnectionPoolClosedEvent } from "typeorm";
import { map } from "@trpc/server/observable";
import { AttendanceSetting } from "~/server/database/entity/attendance_setting";
import { rangeEnd } from "prettier.config.cjs";
import Parameters from "../test/table_modify_element";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";

export type SettingItem = {
	name: string;
	// type: "boolean" | "list" | "number" | "input"
	value: number | string;
	status: "pending" | "processing" | "success" | "failed";
};

let datas: SettingItem[][] = [];

// 基本設定、請假加班、勞健保費率
let table_names: String[] = ["請假加班", "銀行", "勞健保費率"];
function find_index(table_name: string) {
	for (var i = 0; i < table_names.length; i++) {
		if (table_name == table_names[i]) return i;
	}
	return -1;
}

export const columns: ColumnDef<SettingItem>[] = [
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
					const amount = parseFloat(row.getValue("value"));
					// Format the amount as a dollar amount
					// formatted = new Intl.NumberFormat("en-US", {
					// 	style: "currency",
					// 	currency: "USD",
					// }).format(amount);
					formatted = amount.toString();
					break;
				case "string":
					formatted = row.getValue("value");
			}
			return <div className="text-center font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "Last Modified",
		header: "Last Modified",
		cell: ({ row }: { row: Row<SettingItem> }) => (
			<div className="capitalize">{row.getValue("???")}</div>
		),
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

const waitFetch = (dbQuery: any) => {
	while(!dbQuery.isFetched){continue}
	return 0;
}

const API_PARAMETERS = api.parameters;

let testInsertBankData = {
	bank_code: "900",
	bank_name: "土地銀行",
	org_code: "001",
	org_name: "新竹",
	start_date: new Date(8.62e15),
	end_date: new Date(8.64e15),
}



const PageParameters: NextPageWithLayout = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [table_status, setTableStatus] = useState(Array(table_names.length).fill(false));
	function changeTableStatus(index: number) {
		let tmp_status = table_status;
		tmp_status[index] = !tmp_status[index];
		setTableStatus(tmp_status);
	}

	for (var i = 0; i < table_names.length; i++) {if (datas.length < table_names.length) datas.push([]);}

	const bankData = API_PARAMETERS.bankGetData.useQuery();
	const attendanceData = API_PARAMETERS.attendanceGetData.useQuery();
	const insuranceData = API_PARAMETERS.insuranceGetData.useQuery();

	const bankAddData = api.parameters.bankAddData.useMutation()


	waitFetch(attendanceData)
	if (attendanceData.isFetched && !table_status[find_index("請假加班")]) {
		console.log("Successful Fetched Attendance Data");
		let index = find_index("請假加班");
		console.log(index);
		changeTableStatus(index);
		datas[index] = [];
		Object.keys(attendanceData.data?.attendanceData[0]!).map((key) => {
			datas[index]?.push({
				name: key,
				value: (attendanceData.data?.attendanceData[0] as any)[key],
				status: "pending",
			});
		});
	}
	if (bankData.isFetched && !table_status[find_index("銀行")]) {
		console.log("Successful Fetched Bank Data");
		let index = find_index("銀行");
		console.log(index);
		console.log(bankData.data?.bankData);
		changeTableStatus(index);
		datas[index] = [];
		Object.keys(bankData.data?.bankData[0]!).map((key) => {
			datas[index]?.push({
				name: key,
				value: (bankData.data?.bankData[0] as any)[key],
				status: "pending",
			});
		});
	}

	if (insuranceData.isFetched && insuranceData.data?.insuranceDate!=null && !table_status[find_index("勞健保費率")]) {
		console.log("Successful Fetched insurance Data");
		let index = find_index("勞健保費率");
		console.log(index);
		console.log(insuranceData.data?.insuranceDate[0]);
		changeTableStatus(index);
		datas[index] = [];
		Object.keys(insuranceData.data?.insuranceDate[0]!).map((key) => {
			datas[index]?.push({
				name: key,
				value: (insuranceData.data?.insuranceDate[0] as any)[key],
				status: "pending",
			});
		});
	}

	let tables: any = [];
	datas.map((data) => {
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
		tables.push(table);
	});

	let tables_content: any = [];
	tables.map((table: any, index: number) => {
		tables_content.push(
			<AccordionItem value={"item-" + index.toString()}>
				<AccordionTrigger>{table_names[index]}</AccordionTrigger>
				<AccordionContent>
					{/* top bar */}
					<div className="flex items-center py-6">
						{/* search bar */}
						<Input
							placeholder="Filter setting..."
							value={
								(table
									.getColumn("name")
									?.getFilterValue() as string) ?? ""
							}
							onChange={(event) =>
								table
									.getColumn("name")
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
					</div>
				</AccordionContent>
			</AccordionItem>
		);
	});

	return (
		<>
			{/* header */}
			<Header title="parameters" showOptions />
			<Accordion type="single" collapsible className="w-full">
				{tables_content}
			</Accordion>


			<Button disabled={bankAddData.isLoading} onClick={()=>bankAddData.mutate(testInsertBankData)}></Button>
		</>
	);
};

PageParameters.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="parameters">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageParameters;

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
