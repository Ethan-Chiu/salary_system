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

const TabOptions = ["請假", "加班", "工作天數", "其他", "其他"];

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
				return getHoliday.isFetched ? (
					<></>
				) : (
					<></>
				);
			case "加班":
				return getOvertime.isFetched ? (
					<></>
				) : (
					<></>
				);
			case "工作天數":
				return getPayset.isFetched ? (
					<></>
				) : (
					<></>
				);
			default:
				return <p>No implement</p>;
		}
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
