import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { HolidayTable } from "../tables/holiday_table";
import { OvertimeTable } from "../tables/overtime_table";
import { PaysetTable } from "../tables/payset_table";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { type FunctionsEnumType } from "~/server/api/types/functions_enum";
import { useTranslation } from "react-i18next";
import i18n from "~/lib/utils/i18n";

const TabOptions = () => [i18n.t("common.table_name.holiday"), i18n.t("common.table_name.overtime"), i18n.t("common.table_name.payset")];

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

  const { t } = useTranslation("common", { keyPrefix: "button" });

	function getTable(table_name: string) {
		const employee_data_list = api.sync.getPaidEmployees.useQuery({ func }).data
		const emp_no_list = employee_data_list!.map(emp => emp.emp_no)
		switch (table_name) {
			case TabOptions()[0]:
				return <HolidayTable period={period} emp_no_list={emp_no_list} />;
			case TabOptions()[1]:
				return <OvertimeTable period={period} emp_no_list={emp_no_list} />;
			case TabOptions()[2]:
				return <PaysetTable period={period} emp_no_list={emp_no_list} />;
			default:
				return <p>No implement</p>;
		}
	}

	return (
		<>
			<div className="h-0 grow">
				<Tabs
					defaultValue={TabOptions()[0]}
					className="flex h-full w-full flex-col"
				>
					<TabsList className={cn(`grid w-full grid-cols-${TabOptions.length}`)}>
						{TabOptions().map((option) => {
							return (
								<TabsTrigger key={option} value={option}>
									{option}
								</TabsTrigger>
							);
						})}
					</TabsList>
					<div className="mt-2 h-0 grow">
						{TabOptions().map((option) => {
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
					{t("previous_step")}
				</Button>
				<Button
					onClick={() => setSelectedIndex(selectedIndex + 1)}
				>
					{t("next_step")}
				</Button>
			</div>
		</>
	);
}
