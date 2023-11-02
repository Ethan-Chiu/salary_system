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

import { DATA, createDATA } from "./tables/datatype";
import { BankTable, BankRow, createBankRow } from "./tables/bank_table";
import { ParameterTable, SettingItem, createSettingItem } from "./tables/parameter_table";

import { Translate } from "./translation";


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

function find_index(key: string) {
	for (var i = 0; i < initialData.length; i++) {
		if (key == initialData[i]!.table_name) return i;
	}
	return -1;
}

const PageParameters: NextPageWithLayout = () => {
	const [datas, setDatas] = useState(initialData)
	// const [table_status, setTableStatus] = useState(Array(datas.length).fill(false));
	// function changeTableStatus(index: number) { let tmp_status = table_status;tmp_status[index] = !tmp_status[index];setTableStatus(tmp_status); }

	const bankData = API_PARAMETERS.bankGetData.useQuery();
	const attendanceData = API_PARAMETERS.attendanceGetData.useQuery();
	const insuranceData = API_PARAMETERS.insuranceGetData.useQuery();
	const bankAddData = api.parameters.bankAddData.useMutation();

	function updateDatas(t_name: string, new_content: SettingItem[] | BankRow[]) {
		setDatas(
			prevDatas => {
			console.log(prevDatas)
			const updatedDatas = prevDatas.map(data => {
				if (data.table_name === t_name) {
					let content = [...(data.table_content)];
					new_content.map((c) => {
						content.push(c)
					})
					console.log(content)
					return createDATA(data.table_name, data.table_type, content);
				}
				return data;
			});
			console.log(updatedDatas)
			return updatedDatas;}
		);
	}

	if (attendanceData.isFetched && datas[find_index("請假加班")]?.table_content.length == 0) {
		console.log("Successful Fetched Attendance Data");
		let initialAttendanceData = Object.keys(attendanceData.data?.attendanceData[0]!).map((key) => { return { name: (Translate(key) as string),value: ((attendanceData.data?.attendanceData[0] as any)[key]==null?"NULL":(attendanceData.data?.attendanceData[0] as any)[key]) }; })
		updateDatas("請假加班",initialAttendanceData);
	}
	if (bankData.isFetched && datas[find_index("銀行")]?.table_content.length == 0) {
		console.log("Successful Fetched Bank Data");
		let initialBankData = (bankData.data?.bankData!).map((bank) => {return {id:	bank.id,bank_code: bank.bank_code,bank_name: bank.bank_name,org_code: bank.org_code,org_name: bank.org_name};})
		updateDatas("銀行", initialBankData)
	}
	if (insuranceData.isFetched && insuranceData.data?.insuranceDate[0]!=null) {
		console.log("Successful Fetched Insurance Data");
		let initialInsuranceData = Object.keys(insuranceData.data?.insuranceDate[0]!).map((key) => { return { name: key,value: ((insuranceData.data?.insuranceDate[0] as any)[key]==null?"NULL":(insuranceData.data?.insuranceDate[0] as any)[key]) }; })
		updateDatas("勞健保費率",initialInsuranceData);
	}

	return (
		<>
			{/* header */}
			<Header title="parameters" showOptions />
			<Accordion type="single" collapsible className="w-full">
				{
					datas.map((data) => {
						if(data.table_type == "typical") {
							const parameterTable = <ParameterTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type} 
									index={find_index(data.table_name)} 
								/>
							return parameterTable;
						}
						else if(data.table_type == "bank") {
							const bankTable = <BankTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type} 
									index={find_index(data.table_name)} 
								/>
							return bankTable;
						}
					})
				}
			</Accordion>
			
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