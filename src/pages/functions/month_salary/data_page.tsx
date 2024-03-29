import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { HolidayTable } from "../tables/holiday_table";
import { OvertimeTable } from "../tables/overtime_table";
import { PaysetTable } from "../tables/payset_table";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";
import { progressBarLabels } from ".";

const TabOptions = ["請假", "加班", "工作天數", "其他1", "其他2"];
export function DataPage({
	period,
	selectedIndex,
	setSelectedIndex,
}: {
	period: number;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
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

	return (
		<>
			<div className="h-0 grow">
				<Tabs
					defaultValue={TabOptions[0]}
					className="flex h-full w-full flex-col"
				>
					<TabsList className={"grid w-full grid-cols-5"}>
						{TabOptions.map((option) => {
							return (
								<TabsTrigger value={option}>
									{option}
								</TabsTrigger>
							);
						})}
					</TabsList>
					<div className="mt-2 h-0 grow">
						{TabOptions.map((option) => {
							return (
								<TabsContent value={option} className="h-full">
									{period > 0 ? getTable(option) : <></>}
								</TabsContent>
							);
						})}
					</div>
				</Tabs>
			</div>
			<div className="mt-4 flex justify-between">
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
		</>
	);
}
