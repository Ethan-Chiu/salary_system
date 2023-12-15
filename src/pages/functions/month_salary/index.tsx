import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
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
import { Button } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useState } from "react";

const TabOptions = ["請假", "加班", "工作天數", "Max", "劉承亞"];

const MonthSalary: NextPageWithLayout = () => {
	const getPeriod = api.function.getPeriod.useQuery();
	const [period, setPeriod] = useState(-1);

	const getHoliday = api.function.getHoliday.useQuery({ period_id: period });
	const getOvertime = api.function.getOvertime.useQuery({
		period_id: period,
	});
	const getPayset = api.function.getPayset.useQuery({ period_id: period });

	function getTable(table_name: string) {
		switch (table_name) {
			case "請假":
				const holidayTable = getHoliday.data;
				console.log(holidayTable);
				return createTable(table_name, holidayTable);
			case "加班":
				const overtimeTable = getOvertime.data;
				console.log(overtimeTable);
				return createTable(table_name, overtimeTable);
			case "工作天數":
				const paysetTable = getPayset.data;
				console.log(paysetTable);
				return createTable(table_name, paysetTable);
			default:
				return <p>No implement</p>;
		}
	}

	function createTable(table_name: string, datas: any) {
		if (table_name === "請假" && !getHoliday.isFetched) return <></>;
		if (table_name === "加班" && !getOvertime.isFetched) return <></>;
		if (table_name === "工作天數" && !getPayset.isFetched) return <></>;
		if (datas.length === 0)
			return (
				<Table>
					{/* <TableCaption>{table_name}</TableCaption> */}
					<TableHeader></TableHeader>
					<TableBody>
						<TableRow>
							<TableCell
								colSpan={1}
								className="h-24 text-center"
							>
								No results.
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			);
		return (
			<Table>
				{/* <TableCaption>{table_name}</TableCaption> */}
				<TableHeader>
					<TableRow>
						{Object.keys(datas[0]).map((key) => {
							return key === "period_id" ? (
								<TableHead className="w-[100%]">
									{key}
								</TableHead>
							) : (
								<TableHead>{key}</TableHead>
							);
						})}
					</TableRow>
				</TableHeader>
				<TableBody>
					{datas.map((data: any, index: number) => (
						// TableCell className = "font-medium" | "text-right"
						<TableRow key={"tablerow" + index.toString()}>
							<TableCell className="font-medium">
								{data.period_id}
							</TableCell>
							{Object.keys(data)
								.filter((key) => key !== "period_id")
								.map((key: any) => {
									return (
										<TableCell>
											{data[key] ?? "null"}
										</TableCell>
									);
								})}
						</TableRow>
					))}
				</TableBody>
				{/* <TableFooter>
					<TableRow>
						<TableCell colSpan={3}>Total</TableCell>
						<TableCell className="text-right">$2,500.00</TableCell>
					</TableRow>
				</TableFooter> */}
			</Table>
		);
	}

	if (getPeriod.isFetched)
		return (
			<>
				<Header title="functions" showOptions className="mb-4" />
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
				<Tabs defaultValue={TabOptions[0]} className="w-[100%]">
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
				<Header title="parameters" showOptions />
				<div style={loaderStyle}>
					<FadeLoader color="#000000" />
				</div>
			</>
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

const loaderStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	height: "70vh",
};
