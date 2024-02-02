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
import { HolidayTable } from "../tables/holiday_table";
import { OvertimeTable } from "../tables/overtime_table";
import { PaysetTable } from "../tables/payset_table";
import { api } from "~/utils/api";
import { useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";
import { progressBarLabels } from ".";

const TabOptions = ["請假", "加班", "工作天數", "其他1", "其他2"];
export function DataPage({
	selectedIndex,
	setSelectedIndex,
}: {
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
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
				<div className="grow p-4">
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
										<SelectItem
											value={period_info.period_name}
										>
											{period_info.period_name}
										</SelectItem>
									);
								})}
							</SelectGroup>
						</SelectContent>
					</Select>

					<Tabs defaultValue={TabOptions[0]} className="mt-4 w-full">
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
				</div>
				<div className="flex justify-between">
					<Button
						onClick={() => setSelectedIndex(selectedIndex - 1)}
						disabled={selectedIndex === 0}
					>
						{Translate("previous_step")}
					</Button>
					<Button
						onClick={() => setSelectedIndex(selectedIndex + 1)}
						disabled={
							selectedIndex === progressBarLabels.length - 1
						}
					>
						{Translate("next_step")}
					</Button>
				</div>
			</>
		);
	else
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		);
}
