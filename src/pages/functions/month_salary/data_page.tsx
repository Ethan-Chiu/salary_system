import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { HolidayTable } from "../tables/holiday_table";
import { OvertimeTable } from "../tables/overtime_table";
import { PaysetTable } from "../tables/payset_table";
import { BonusTable } from "../tables/bonus_table";
import { OtherTable } from "../tables/other_table";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { type FunctionsEnumType } from "~/server/api/types/functions_enum";
import { useTranslation } from "react-i18next";

const tabOptions = ["table_name.holiday", "table_name.overtime", "table_name.payset", "table_name.bonus", "table_name.other"];

export function DataPage({
	period,
	func,
	selectedIndex,
	setSelectedIndex,
}: {
	period: number;
	func: FunctionsEnumType;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {

  const { t } = useTranslation("common");

	function getTable(table_name: string) {
		const employee_data_list = api.sync.getPaidEmployees.useQuery({ func }).data
		const emp_no_list = employee_data_list!.map(emp => emp.emp_no)
		switch (table_name) {
			case tabOptions[0]:
				return <HolidayTable period={period} emp_no_list={emp_no_list} />;
			case tabOptions[1]:
				return <OvertimeTable period={period} emp_no_list={emp_no_list} />;
			case tabOptions[2]:
				return <PaysetTable period={period} emp_no_list={emp_no_list} />;
			case tabOptions[3]:
				return <BonusTable period={period} emp_no_list={emp_no_list} />;
			case tabOptions[4]:
				return <OtherTable period={period} emp_no_list={emp_no_list} />;
			default:
				return <p>No implement</p>;
		}
	}


	return (
		<>
			<div className="h-0 grow">
				<Tabs
					defaultValue={tabOptions[0]}
					className="flex h-full w-full flex-col"
				>
					<TabsList className={cn(`grid grid-cols-5`)}>
						{tabOptions.map((option) => {
							return (
								<TabsTrigger key={option} value={option}>
									{t(option)}
								</TabsTrigger>
							);
						})}
					</TabsList>
					<div className="mt-2 h-0 grow">
						{tabOptions.map((option) => {
							return (
								<TabsContent key={option} value={option} className="h-full">
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
				>
					{t("button.previous_step")}
				</Button>
				<Button
					onClick={() => setSelectedIndex(selectedIndex + 1)}
				>
					{t("button.next_step")}
				</Button>
			</div>
		</>
	);
}
