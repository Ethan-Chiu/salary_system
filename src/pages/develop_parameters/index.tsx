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

import { type NextPageWithLayout } from "../_app";
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { type ReactElement, useRef, useState, useEffect, useMemo } from "react";

import { DATA, createDATA } from "./tables/datatype";
import { BankTable, BankRow, createBankRow } from "./tables/bank_table";
import { ParameterTable, SettingItem, createSettingItem } from "./tables/parameter_table";

import { Translate } from "./translation";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";


const API_PARAMETERS = api.parameters;

let datas: DATA[] = [
	{
		table_name: "請假加班",
		table_type: "typical",
		table_content: [
			createSettingItem("test","test",["A","B","C","D","E"]),
			createSettingItem("test","test",["X","Y","Z"]),
			createSettingItem("test","test"),
			createSettingItem("test",123),
			createSettingItem("test",new Date())
		],
	},
	{
		table_name: "銀行",
		table_type: "bank",
		table_content: [],
	},
    // {
	// 	table_name: "勞健保費率",
	// 	table_type: "typical",
	// 	table_content: [],
	// },
]

function find_index(key: string) {
	for (var i = 0; i < datas.length; i++) {
		if (key == datas[i]!.table_name) return i;
	}
	return -1;
}

const PageParameters: NextPageWithLayout = () => {
	
	// const attendanceData = API_PARAMETERS.attendanceGetData.useQuery();
	// const insuranceData = API_PARAMETERS.insuranceGetData.useQuery();

	const getBankSetting = API_PARAMETERS.getBankSetting.useQuery();
	const updateBankSetting = api.parameters.updateBankSetting.useMutation({
		onSuccess: () => {getBankSetting.refetch();}
	});
	const createBankSetting = api.parameters.createBankSetting.useMutation({
		onSuccess: () => {getBankSetting.refetch();}
	});
	const deleteBankSetting = api.parameters.deleteBankSetting.useMutation({
		onSuccess: () => {getBankSetting.refetch();}
	});

	function updateDatas(t_name: string, new_content: SettingItem[] | BankRow[]) {
		
		const newDatas = datas.map(data => {
			if (data.table_name === t_name) {
				return createDATA(data.table_name, data.table_type, new_content);
			}
			return data;
		});
		datas = newDatas;
	}

	if (
		true
		// attendanceData.isFetched &&
		// getBankSetting.isFetched
		// insuranceData.isFetched
	) {

		// updateDatas("請假加班", Object.keys(attendanceData.data ?? {}).map((key) => { return { name: (Translate(key) as string),value: ((attendanceData.data as any)[key]==null?"NULL":(attendanceData.data as any)[key]) }; }));
		// console.log((getBankSetting.data ?? []).map((bank: any) => {return {id:	bank.id,bank_code: bank.bank_code,bank_name: bank.bank_name,org_code: bank.org_code,org_name: bank.org_name,start_date: new Date(bank.start_date), end_date: new Date(bank.end_date)};}))
		// updateDatas("銀行", (getBankSetting.data ?? []).map((bank: any) => {return {id:	bank.id,bank_code: bank.bank_code,bank_name: bank.bank_name,org_code: bank.org_code,org_name: bank.org_name,start_date:bank.start_date,end_date:bank.end_date};}))
		return HTMLElement();
	}
	else {
		return <div className="loader-container">
					<div className="spinner"></div>
				</div>
	}
	

	function HTMLElement() {
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
										updateBankSetting={(d: any) => {updateBankSetting.mutate(d)}}
										createBankSetting={(d: any) => {createBankSetting.mutate(d)}}
										deleteBankSetting={(d: any) => {deleteBankSetting.mutate(d)}}
									/>
								return bankTable;
							}
						})
					}
				</Accordion>
			</>
		)
	}
};

PageParameters.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="parameters">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageParameters;
















