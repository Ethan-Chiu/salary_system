import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { NextPageWithLayout } from "../../_app";
import { FadeLoader } from "react-spinners";
import { api } from "~/utils/api";
import {
	Select,
	SelectValue,
	SelectTrigger,
	SelectItem,
	SelectGroup,
	SelectContent,
	SelectLabel,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useState } from "react";
import { HolidayTable } from "../tables/holiday_table";
import { OvertimeTable } from "../tables/overtime_table";
import { PaysetTable } from "../tables/payset_table";
import { ProgressBar } from "~/components/functions/progress_bar";
import {
	CardFunction,
	CardFunctionIcon,
	CardFunctionData
} from "~/components/functions/card_function";
import { IconCoins } from "~/components/icons/svg_icons";
import { Button } from "~/components/ui/button";
import { Translate } from "~/pages/develop_parameters/utils/translation";

import ExcelJS from "exceljs"

import { motion } from "framer-motion";





const TabOptions = ["請假", "加班", "工作天數", "其他", "其他"];
const progressBarLabels = ["確認資料", "確認參數", "匯出報表"];

const MonthSalary: NextPageWithLayout = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const pageList = [<DataPage />, <ParameterPage />, <ExportPage />];
	return (
		<div className="flex min-h-full flex-col">
			<Header title="functions" showOptions className="mb-4" />
			<ProgressBar
				labels={progressBarLabels}
				selectedIndex={selectedIndex}
			/>
			<br />
			{pageList[selectedIndex]}
			<br />
			<div className="grow" />
			<div className="flex justify-between ">
				<Button
					onClick={() => setSelectedIndex(selectedIndex - 1)}
					disabled={selectedIndex === 0}
				>
					{Translate("previous_step")}
				</Button>
				<Button
					onClick={() => setSelectedIndex(selectedIndex + 1)}
					disabled={selectedIndex === progressBarLabels.length - 1}
				>
					{Translate("next_step")}
				</Button>
			</div>
		</div>
	);
};

MonthSalary.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="functions">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default MonthSalary;

function DataPage() {
	const getPeriod = api.function.getPeriod.useQuery();
	const [period, setPeriod] = useState(-1);

	function getTable(table_name: string) {
		switch (table_name) {
			case "請假":
				return <HolidayTable period={period} />;
			case "加班":
				return <OvertimeTable period={period} />;
			case "工作天數":
				return <PaysetTable period={period} />;
			default:
				return <p>No implement</p>;
		}
	}

	if (getPeriod.isFetched)
		return (
			<>
				<Select
					onValueChange={(chosen) =>
						setPeriod(
							getPeriod.data!.find(
								(item) => item.period_name === chosen
							)?.period_id || -1
						)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a period" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Period</SelectLabel>
							{getPeriod.data!.map((period_info) => {
								return (
									<SelectItem value={period_info.period_name}>
										{period_info.period_name}
									</SelectItem>
								);
							})}
						</SelectGroup>
					</SelectContent>
				</Select>
				<br />
				<Tabs defaultValue={TabOptions[0]} className="w-full">
					<TabsList className={"grid w-full grid-cols-5"}>
						{TabOptions.map((option) => {
							return (
								<TabsTrigger value={option}>
									{option}
								</TabsTrigger>
							);
						})}
					</TabsList>
					{TabOptions.map((option) => {
						return (
							<TabsContent value={option}>
								{period > 0 ? getTable(option) : <></>}
							</TabsContent>
						);
					})}
				</Tabs>
			</>
		);
	else
		return (
			<>
				<div style={loaderStyle}>
					<FadeLoader color="#000000" />
				</div>
			</>
		);
}

function ParameterPage() {
	return (
		<>
			<div style={loaderStyle}>
				<FadeLoader color="#000000" />
			</div>
		</>
	);
}

function ExportPage() {

	const getExcelA = api.function.getExcelA.useQuery();

	function splitKeys(datas: any) {
		let columns = Object.keys(datas[0]);
		let rows = datas.map((data: any, index: number) => {
			return Object.keys(data).map((key: string) => {
				return data[key];
			})
		})
		return [columns, rows];
	}


	const function_data: CardFunctionData[] = [
		{
			title: "Download Excel A",
			iconPath: "./icons/coins.svg",
			subscript: "下載 Excel A",
		}
	];


	const handleExportExcel = async (datas: any, filename: string) => {
		const workbook = new ExcelJS.Workbook();
		// const worksheet = workbook.addWorksheet('Sheet 1');
		// // Add data to the worksheet
		// worksheet.addRow(['Name', 'Age', 'Country']);
		// worksheet.addRow(['John Doe', 25, 'USA']);
		// worksheet.addRow(['Jane Smith', 30, 'Canada']);
		// worksheet.addRow(['Bob Johnson', 28, 'UK']);

		if(datas) {
			datas.map((sheet: any, index: number) => {
				console.log(sheet.data)
				const worksheet = workbook.addWorksheet(sheet.name);
				try {
					console.log(splitKeys(sheet.data));
					let [columns, rows] = splitKeys(sheet.data)
					worksheet.addRow(columns);
					rows.map((row: any, i: number) => {
						worksheet.addRow(row);
					})
					// const cell = worksheet.getCell('A1');
					// 	cell.fill = {
					// 	type: 'pattern',
					// 	pattern: 'solid',
					// 	fgColor: { argb: 'FFFF0000' } // 背景颜色为红色
					// };
				}
				catch {

				}
			})
		}

		// Save the workbook to a file
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	};
	return (
		<motion.div
			className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
			variants={container}
			initial="hidden"
			animate="visible"
		>
			{function_data.map((f_data: CardFunctionData) => (
				<motion.div
					key={f_data.title}
					variants={stagger}
					className="cursor-pointer"
					onClick={() => handleExportExcel(getExcelA.data, 'exported_data.xlsx')}
				>
					{getExcelA?<CardFunction
						title={f_data.title}
						iconPath={f_data.iconPath}
						subscript={f_data.subscript}
					>
						<CardFunctionIcon className="text-foreground">
							<IconCoins />
						</CardFunctionIcon>
					</CardFunction>:<></>}
					
				</motion.div>
			))}
		</motion.div>
	);
}

const loaderStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	height: "70vh",
};

const container = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

const stagger = {
	hidden: { opacity: 0, y: -100 },
	visible: { opacity: 1, y: 0 },
};
