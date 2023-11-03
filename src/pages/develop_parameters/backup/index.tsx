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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Settings } from "lucide-react";
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
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { type ReactElement, useRef, useState, useEffect, useMemo } from "react";

import { DATA, createDATA } from "./datatype";
import { SettingItem, columns1, columns2 } from "./parameter_table"
import { BankRow, bank_data_columns } from "./bank_table";

import {testInsertBankData} from "./backup/test"
import { render } from "react-dom";

const API_PARAMETERS = api.parameters;

const initialData: DATA[] = [
	{
		table_name: "請假加班",
		table_type: "typical",
		table_content: [],
	},
	{
		table_name: "銀行",
		table_type: "bank",
		table_content: [],
	},
    {
		table_name: "勞健保費率",
		table_type: "typical",
		table_content: [],
	},
]

let tables_content = [];

function find_index(key: string) {
	for (var i = 0; i < initialData.length; i++) {
		if (key == initialData[i]!.table_name) return i;
	}
	return -1;
}

const PageParameters: NextPageWithLayout = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	const [datas, setDatas] = useState(initialData)
	const [table_status, setTableStatus] = useState(Array(datas.length).fill(false));
	const [tableElements, setTableElements] = useState([<></>])

	const [run, setRun] = useState(false);

	function changeTableStatus(index: number) { let tmp_status = table_status;tmp_status[index] = !tmp_status[index];setTableStatus(tmp_status); }


	const bankData = API_PARAMETERS.bankGetData.useQuery();
	const attendanceData = API_PARAMETERS.attendanceGetData.useQuery();
	const insuranceData = API_PARAMETERS.insuranceGetData.useQuery();
	const bankAddData = api.parameters.bankAddData.useMutation();

	if (attendanceData.isFetched && datas[0]?.table_content.length == 0 && !table_status[find_index("請假加班")]) {
		setRun(true);
		console.log("Successful Fetched Attendance Data");
		let index = find_index("請假加班");
		console.log(index);
		changeTableStatus(index);
		datas[index]!.table_content = [];
		// datas[index] = []
		Object.keys(attendanceData.data?.attendanceData[0]!).map((key) => {
			let newItem: SettingItem = {
				name: key,
				value: ((attendanceData.data?.attendanceData[0] as any)[key]==null?"NULL":(attendanceData.data?.attendanceData[0] as any)[key])
			};
			if(datas[index]!.table_type === "typical") {
				(datas[index]!.table_content as SettingItem[]).push(newItem);
			}
		});
	}
	if (bankData.isFetched && !table_status[find_index("銀行")]) {
		console.log("Successful Fetched Bank Data");
		let index = find_index("銀行");
		console.log(index);
		console.log(bankData.data?.bankData);
		changeTableStatus(index);
		datas[index]!.table_content = [];
		// datas[index] = []
		bankData.data?.bankData?.map((bank) => {
			let newItem: BankRow = {
				id:	bank.id,
				bank_code: bank.bank_code,
				bank_name: bank.bank_name,
				org_code: bank.org_code,
				org_name: bank.org_name
			};
			if(datas[index]!.table_type === "bank") {
				(datas[index]!.table_content as BankRow[]).push(newItem);
			}
		})
	}
	if (insuranceData.isFetched && insuranceData.data?.insuranceDate[0]!=null && !table_status[find_index("勞健保費率")]) {
		console.log("Successful Fetched insurance Data");
		let index = find_index("勞健保費率");
		console.log(index);
		console.log(insuranceData.data?.insuranceDate[0]);
		changeTableStatus(index);
		datas[index]!.table_content = [];
		// datas[index] = []
		Object.keys(insuranceData.data?.insuranceDate[0]!).map((key) => {
			let newItem: SettingItem = {
				name: key,
				value: ((insuranceData.data?.insuranceDate[0] as any)[key]==null)?"NULL":((insuranceData.data?.insuranceDate[0] as any)[key])
			};
			if(datas[index]!.table_type === "typical") {
				(datas[index]!.table_content as SettingItem[]).push(newItem);
			}
			// datas[index]?.push(newItem)
		});
	}

	const tables = datas.map((dataItem, index) => {
		if(dataItem!.table_type == "typical") {
			const data = (datas[index]!.table_content as SettingItem[]);
			// const data = useMemo(() => {
			// 	return [...(datas[index]!.table_content as SettingItem[])];
			// }, [datas, table_status, sorting, columnFilters, columnVisibility, rowSelection]);

			let columns = columns1
			return useReactTable({
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
		}
		else if(dataItem!.table_type == "bank") {
			const data: BankRow[] = (datas[index]!.table_content as BankRow[]);
			let columns = bank_data_columns
			return useReactTable({
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
		}
	})

	tables_content =tables.map((table: any, index: number) => {
		const [showDialog, setShowDialog] = useState(false);
		let filter_key = (datas[index]!.table_type == "typical")?"name":"bank_name";
		return (<>
			<AccordionItem value={"item-" + index.toString()}>
				<AccordionTrigger>{datas[index]?.table_name}</AccordionTrigger>
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
											colSpan={(datas[index]!.table_type==="typical"?columns1:bank_data_columns).length}
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
								}}
								disabled={!table_status[index]}
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
						{table_status[index]?<InsertDialog
							name={datas[index]!.table_name}
							type={datas[index]!.table_type}
							data={datas[index]!.table_content}
							showDialog={showDialog}
							onOpenChange={(open: boolean) => {
								setShowDialog(open);
							}}
						/>:<></>}
					</div>
				</AccordionContent>
			</AccordionItem>
		</>);
	});


	return (
		<>
			{/* header */}
			<Header title="parameters" showOptions />
			<Accordion type="single" collapsible className="w-full">
				{tables_content}
			</Accordion>
			{(datas.length>0)?<p>{
				(datas[0]?.table_content as SettingItem[]).map((item) => {
					return <><p>{item.name}</p><br/><p>{item.value}</p></>
				})
			}</p>:<></>}
			<Button onClick={()=>{console.log(datas)}}>Console log "datas"</Button>

			<Button onClick={()=>{
				const updatedDatas = [...datas];
				const testItem: SettingItem = {
				  name: 'test',
				  value: 'test'
				};
				// Modify the new array
				(updatedDatas[0]!.table_content as SettingItem[]).push(testItem);
				// Update the state with the new array
				setDatas(() => {return updatedDatas});
				// setTableStatus(prevTableStatus => {
				// 	// Create a copy of the previous state using spread operator
				// 	const updatedTableStatus = [...prevTableStatus];
				// 	// Flip the boolean at the specified index
				// 	updatedTableStatus[0] = !updatedTableStatus[0];
				// 	// Return the updated state
				// 	return updatedTableStatus;
				// });
			}}> TEST </Button>
			{/* <Button disabled={bankAddData.isLoading} onClick={()=>bankAddData.mutate(testInsertBankData)}>Insert Bank Data</Button> */}
		</>
	);
};

PageParameters.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayout pageTitle="parameters">{page}</PerpageLayout>
		</RootLayout>
	);
};

export default PageParameters;




function InsertDialog({
	name,
	type,
	data,
	showDialog,
	onOpenChange,
}: {
	name: string;
	type: string;
	data: any;
	showDialog: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	if (type == "typical")
	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange} >
			<DialogContent className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}>
				<DialogHeader>
					<DialogTitle>
						Add Data to [{name}]
					</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						{
							data.map((ob: any, index: number) => {
								return	<>
								 			<Label htmlFor="value" className="text-right">{ob.name}</Label>
								 			<Input
												ref={inputRef}
												id="value"
												defaultValue={ob.value}
												type={
													Number.isInteger(ob.value)?"number": "value"}
												className="col-span-3"
											/></> 
								})
						}
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
	else if (type == "bank") {
	let tmp = ["銀行代碼","銀行名稱","公司代碼","公司名稱"];
	return (
			<Dialog open={showDialog} onOpenChange={onOpenChange} >
				<DialogContent className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}>
					<DialogHeader>
						<DialogTitle>
							Add Data to [{name}]
						</DialogTitle>
						<DialogDescription>{/* Description */}</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							{
								tmp.map((parameter: any, index: number) => {
									return	<>
											<Label htmlFor="value" className="text-right">{parameter}</Label>
											<Input
												ref={inputRef}
												id={"value"+index.toString()}
												type="value"
												className="col-span-3"
											/></> 
									})
							}
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
								Confirm
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}
}



// const [datas, setDatas] = useState(initialData)
// 	function updateDatas(t_name: string, new_content: SettingItem[] | BankRow[]) {
// 		setDatas(
// 			prevDatas => {
// 			console.log(prevDatas)
// 			const updatedDatas = prevDatas.map(data => {
// 				if (data.table_name === t_name) {
// 					console.log(new_content)
// 					return createDATA(data.table_name, data.table_type, new_content);
// 				}
// 				return data;
// 			});
// 			console.log(updatedDatas)
// 			return updatedDatas;}
// 		);
// 	}


// if (attendanceData.isFetched) {
	// 	console.log("Successful Fetched Attendance Data");
	// 	let initialAttendanceData = Object.keys(attendanceData.data?.attendanceData[0]!).map((key) => { return { name: (Translate(key) as string),value: ((attendanceData.data?.attendanceData[0] as any)[key]==null?"NULL":(attendanceData.data?.attendanceData[0] as any)[key]) }; })
	// 	updateDatas("請假加班",initialAttendanceData);
	// }
	// if (bankData.isFetched) {
	// 	console.log("Successful Fetched Bank Data");
	// 	let initialBankData = (bankData.data ?? []).map((bank) => {return {id:	bank.id,bank_code: bank.bank_code,bank_name: bank.bank_name,org_code: bank.org_code,org_name: bank.org_name};})
	// 	updateDatas("銀行", initialBankData)
	// }
	// if (insuranceData.isFetched) {
	// 	console.log("Successful Fetched Insurance Data");
	// 	let initialInsuranceData = Object.keys(insuranceData.data?.insuranceDate[0]!).map((key) => { return { name: key,value: ((insuranceData.data?.insuranceDate[0] as any)[key]==null?"NULL":(insuranceData.data?.insuranceDate[0] as any)[key]) }; })
	// 	updateDatas("勞健保費率",initialInsuranceData);
	// }


	{/* <Button onClick={()=>{console.log(datas)}}>Console log "datas"</Button>
				<Button onClick={()=>{
					let testBankItem: BankRow[] = [
						createBankRow(123,"bc","bn","oc","on"),
						createBankRow(123,"bc","bn","oc","on"),
						createBankRow(123,"bc","bn","oc","on"),
					]
					let testSettingItem: SettingItem[] = [createSettingItem("name", "value")]

					updateDatas("請假加班", testSettingItem)
					updateDatas("銀行", testBankItem)
					console.log("change datas")
				}}> Change datas </Button> */}

				{/* <Button disabled={bankAddData.isLoading} onClick={()=>bankAddData.mutate(testInsertBankData)}>Insert Bank Data</Button> */}