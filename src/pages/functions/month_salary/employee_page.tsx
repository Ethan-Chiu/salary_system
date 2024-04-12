import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";
import { EmployeeDataTable } from "../tables/employee_data_table";

export function EmployeePage({
	period,
	func,
	selectedIndex,
	setSelectedIndex,
}: {
	period: number;
	func: string;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
	return <>
		<EmployeeDataTable func={func} />
		<div className="mt-4 flex justify-between">
			<Button
				onClick={() => setSelectedIndex(selectedIndex - 1)}
			>
				{Translate("previous_step")}
			</Button>
			<Button
				onClick={() => setSelectedIndex(selectedIndex + 1)}
			>
				{Translate("next_step")}
			</Button>
		</div>
	</>;
}
