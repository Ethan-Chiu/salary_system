// import { RootLayout } from "~/components/layout/root_layout";
// import { Header } from "~/components/header";
// import { Button } from "~/components/ui/button";
// import { Label } from "~/components/ui/label";

// import { api } from "~/utils/api";

// import {
// 	Accordion,
// 	AccordionContent,
// 	AccordionItem,
// 	AccordionTrigger,
// } from "~/components/ui/accordion";

// import {
// 	flexRender,
// 	getCoreRowModel,
// 	getFilteredRowModel,
// 	getPaginationRowModel,
// 	getSortedRowModel,
// 	useReactTable,
// } from "@tanstack/react-table";
// import type {
// 	ColumnDef,
// 	ColumnFiltersState,
// 	SortingState,
// 	VisibilityState,
// 	Row,
// } from "@tanstack/react-table";
// import { ArrowUpDown, ChevronDown, MoreHorizontal, Settings } from "lucide-react";
// import {
// 	DropdownMenu,
// 	DropdownMenuCheckboxItem,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuLabel,
// 	DropdownMenuSeparator,
// 	DropdownMenuTrigger,
// } from "~/components/ui/dropdown-menu";
// import { Input } from "~/components/ui/input";
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from "~/components/ui/table";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogFooter,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogClose,
// } from "~/components/ui/dialog";
// import { type NextPageWithLayout } from "../_app";
// import { PerpageLayout } from "~/components/layout/perpage_layout";
// import { type ReactElement, useRef, useState, useEffect } from "react";

// import {SettingItem} from "./structures"
// import { DATA } from "./datatype";
// import { columns } from "./parameter_table"

// const API_PARAMETERS = api.parameters;

// var datas: DATA[] = [
// 	{
// 		table_name: "請假加班",
// 		table_type: "typical",
// 		table_content: [],
// 	},
// 	{
// 		table_name: "銀行",
// 		table_type: "bank",
// 		table_content: [],
// 	},
//     {
// 		table_name: "請假加班",
// 		table_type: "typical",
// 		table_content: [],
// 	},
// ]
// function find_index(key: string) {
// 	for (var i = 0; i < datas.length; i++) {
// 		if (key == datas[i]!.table_name) return i;
// 	}
// 	return -1;
// }

// const PageParameters: NextPageWithLayout = () => {
// 	const [sorting, setSorting] = useState<SortingState>([]);
// 	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
// 	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
// 	const [rowSelection, setRowSelection] = useState({});
// 	const [table_status, setTableStatus] = useState(Array(datas.length).fill(false));
// 	function changeTableStatus(index: number) {
// 		let tmp_status = table_status;
// 		tmp_status[index] = !tmp_status[index];
// 		setTableStatus(tmp_status);
// 	}

// 	const bankData = API_PARAMETERS.bankGetData.useQuery();
// 	const attendanceData = API_PARAMETERS.attendanceGetData.useQuery();
// 	const insuranceData = API_PARAMETERS.insuranceGetData.useQuery();
// 	const bankAddData = api.parameters.bankAddData.useMutation()

// 	// for (var i = 0; i < table_names.length; i++) {if (datas.length < table_names.length) datas.push([]);}

// 	if (attendanceData.isFetched && !table_status[find_index("請假加班")]) {
// 		console.log("Successful Fetched Attendance Data");
// 		let index = find_index("請假加班");
// 		console.log(index);
// 		changeTableStatus(index);
// 		datas[index]!.table_content = [];
// 		// datas[index] = []
// 		Object.keys(attendanceData.data?.attendanceData[0]!).map((key) => {
// 			let newItem: SettingItem = {
// 				name: key,
// 				value: ((attendanceData.data?.attendanceData[0] as any)[key]==null?"NULL":(attendanceData.data?.attendanceData[0] as any)[key])
// 			};
// 			datas[index]?.table_content.push(newItem);
// 			// datas[index]?.push(newItem)
// 		});
// 	}
// 	if (bankData.isFetched && !table_status[find_index("銀行")]) {
// 		console.log("Successful Fetched Bank Data");
// 		let index = find_index("銀行");
// 		console.log(index);
// 		console.log(bankData.data?.bankData);
// 		changeTableStatus(index);
// 		datas[index]!.table_content = [];
// 		// datas[index] = []
// 		Object.keys(bankData.data?.bankData[0]!).map((key) => {
// 			let newItem: SettingItem = {
// 				name: key,
// 				value: ((bankData.data?.bankData[0] as any)[key]==null?"Null":(bankData.data?.bankData[0] as any)[key])
// 			};
// 			datas[index]?.table_content.push(newItem);
// 			// datas[index]?.push(newItem)
// 		});
// 	}

// 	if (insuranceData.isFetched && insuranceData.data?.insuranceDate[0]!=null && !table_status[find_index("勞健保費率")]) {
// 		console.log("Successful Fetched insurance Data");
// 		let index = find_index("勞健保費率");
// 		console.log(index);
// 		console.log(insuranceData.data?.insuranceDate[0]);
// 		changeTableStatus(index);
// 		datas[index]!.table_content = [];
// 		// datas[index] = []
// 		Object.keys(insuranceData.data?.insuranceDate[0]!).map((key) => {
// 			let newItem: SettingItem = {
// 				name: key,
// 				value: ((insuranceData.data?.insuranceDate[0] as any)[key]==null)?"NULL":((insuranceData.data?.insuranceDate[0] as any)[key])
// 			};
// 			datas[index]!.table_content.push(newItem)
// 			// datas[index]?.push(newItem)
// 		});
// 	}

// 	let tables: any = [];
// 	for(var i = 0 ; i < datas.length ; i ++) {
// 		let data = datas[i]!.table_content!;
// 		const table = useReactTable({
// 			data,
// 			columns,
// 			onSortingChange: setSorting,
// 			onColumnFiltersChange: setColumnFilters,
// 			getCoreRowModel: getCoreRowModel(),
// 			getPaginationRowModel: getPaginationRowModel(),
// 			getSortedRowModel: getSortedRowModel(),
// 			getFilteredRowModel: getFilteredRowModel(),
// 			onColumnVisibilityChange: setColumnVisibility,
// 			onRowSelectionChange: setRowSelection,
// 			state: {
// 				sorting,
// 				columnFilters,
// 				columnVisibility,
// 				rowSelection,
// 			},
// 		});
// 		tables.push(table);
// 	};

// 	let tables_content: any = [];
// 	tables.map((table: any, index: number) => {
// 		const [showDialog, setShowDialog] = useState(false);
// 		tables_content.push(
// 			<AccordionItem value={"item-" + index.toString()}>
// 				<AccordionTrigger>{datas[index]?.table_name}</AccordionTrigger>
// 				<AccordionContent>
// 					{/* top bar */}
// 					<div className="flex items-center py-6">
// 						{/* search bar */}
// 						<Input
// 							placeholder="Filter setting..."
// 							value={
// 								(table
// 									.getColumn("name")
// 									?.getFilterValue() as string) ?? ""
// 							}
// 							onChange={(event) =>
// 								table
// 									.getColumn("name")
// 									?.setFilterValue(event.target.value)
// 							}
// 							className="max-w-sm"
// 						/>
// 						{/* select column to show */}
// 						<DropdownMenu>
// 							<DropdownMenuTrigger asChild>
// 								<Button variant="outline" className="ml-auto">
// 									Columns{" "}
// 									<ChevronDown className="ml-2 h-4 w-4" />
// 								</Button>
// 							</DropdownMenuTrigger>
// 							<DropdownMenuContent align="end">
// 								{table
// 									.getAllColumns()
// 									.filter((column: any) =>
// 										column.getCanHide()
// 									)
// 									.map((column: any) => {
// 										return (
// 											<DropdownMenuCheckboxItem
// 												key={column.id}
// 												className="capitalize"
// 												checked={column.getIsVisible()}
// 												onCheckedChange={(value) =>
// 													column.toggleVisibility(
// 														!!value
// 													)
// 												}
// 											>
// 												{column.id}
// 											</DropdownMenuCheckboxItem>
// 										);
// 									})}
// 							</DropdownMenuContent>
// 						</DropdownMenu>
// 					</div>
// 					{/* table */}
// 					<div className="rounded-md border">
// 						<Table>
// 							<TableHeader>
// 								{table
// 									.getHeaderGroups()
// 									.map((headerGroup: any) => (
// 										<TableRow key={headerGroup.id}>
// 											{headerGroup.headers.map(
// 												(header: any) => {
// 													return (
// 														<TableHead
// 															key={header.id}
// 														>
// 															{header.isPlaceholder
// 																? null
// 																: flexRender(
// 																		header
// 																			.column
// 																			.columnDef
// 																			.header,
// 																		header.getContext()
// 																  )}
// 														</TableHead>
// 													);
// 												}
// 											)}
// 										</TableRow>
// 									))}
// 							</TableHeader>
// 							<TableBody>
// 								{table.getRowModel().rows?.length ? (
// 									table.getRowModel().rows.map((row: any) => (
// 										<TableRow
// 											key={row.id}
// 											data-state={
// 												row.getIsSelected() &&
// 												"selected"
// 											}
// 										>
// 											{row
// 												.getVisibleCells()
// 												.map((cell: any) => (
// 													<TableCell key={cell.id}>
// 														{flexRender(
// 															cell.column
// 																.columnDef.cell,
// 															cell.getContext()
// 														)}
// 													</TableCell>
// 												))}
// 										</TableRow>
// 									))
// 								) : (
// 									<TableRow>
// 										<TableCell
// 											colSpan={columns.length}
// 											className="h-24 text-center"
// 										>
// 											No results.
// 										</TableCell>
// 									</TableRow>
// 								)}
// 							</TableBody>
// 						</Table>
// 					</div>
// 					{/* buttons */}
// 					<div className="flex items-center justify-end space-x-2 py-4">
// 						<div className="space-x-2">
// 							<Button
// 								variant="outline"
// 								size="sm"
// 								onClick={() => {
// 									setShowDialog(true);
// 								}}
// 								disabled={!table_status[index]}
// 							>
// 								Add
// 							</Button>
// 							<Button
// 								variant="outline"
// 								size="sm"
// 								onClick={() => table.previousPage()}
// 								disabled={!table.getCanPreviousPage()}
// 							>
// 								Previous
// 							</Button>
// 							<Button
// 								variant="outline"
// 								size="sm"
// 								onClick={() => table.nextPage()}
// 								disabled={!table.getCanNextPage()}
// 							>
// 								Next
// 							</Button>
// 						</div>
// 						{table_status[index]?<InsertDialog
// 							name={""}
// 							data={datas[index]!.table_content}
// 							showDialog={showDialog}
// 							onOpenChange={(open: boolean) => {
// 								setShowDialog(open);
// 							}}
// 						/>:<></>}
// 					</div>
// 				</AccordionContent>
// 			</AccordionItem>
// 		);
// 		console.log(tables_content)
// 	});

// 	return (
// 		<>
// 			{/* header */}
// 			<Header title="parameters" showOptions />
// 			<Accordion type="single" collapsible className="w-full">
// 				{tables_content}
// 			</Accordion>


// 			{/* <Button disabled={bankAddData.isLoading} onClick={()=>bankAddData.mutate(testInsertBankData)}>Insert Bank Data</Button> */}
// 		</>
// 	);
// };

// PageParameters.getLayout = function getLayout(page: ReactElement) {
// 	return (
// 		<RootLayout>
// 			<PerpageLayout pageTitle="parameters">{page}</PerpageLayout>
// 		</RootLayout>
// 	);
// };

// export default PageParameters;




// function InsertDialog({
// 	name,
// 	data,
// 	showDialog,
// 	onOpenChange,
// }: {
// 	name: string;
// 	data: any;
// 	showDialog: boolean;
// 	onOpenChange: (open: boolean) => void;
// }) {
// 	const inputRef = useRef<HTMLInputElement>(null);

// 	return (
// 		<Dialog open={showDialog} onOpenChange={onOpenChange} >
// 			<DialogContent className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}>
// 				<DialogHeader>
// 					<DialogTitle>
// 						Add Data to [Table] {name}
// 					</DialogTitle>
// 					<DialogDescription>{/* Description */}</DialogDescription>
// 				</DialogHeader>
// 				<div className="grid gap-4 py-4">
// 					<div className="grid grid-cols-4 items-center gap-4">
// 						{
// 							data.map((ob: any, index: number) => {
// 								return	<>
// 								 			<Label htmlFor="value" className="text-right">{ob.name}</Label>
// 								 			<Input
// 												ref={inputRef}
// 												id="value"
// 												defaultValue={ob.value}
// 												type={
// 													Number.isInteger(ob.value)?"number": "value"}
// 												className="col-span-3"
// 											/></> 
// 								})
// 						}
// 					</div>
// 				</div>
// 				<DialogFooter>
// 					<DialogClose asChild>
// 						<Button
// 							type="submit"
// 							onClick={() => {
// 								const value = Number(inputRef.current?.value);
// 							}}
// 						>
// 							Save changes
// 						</Button>
// 					</DialogClose>
// 				</DialogFooter>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
