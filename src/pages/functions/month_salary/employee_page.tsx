import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";
import { EmployeeDataTable } from "../tables/employee_data_table";

interface EmployeePageProps {
	period: number;
	func: string;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

export function EmployeePage({
	func,
	selectedIndex,
	setSelectedIndex,
}: EmployeePageProps) {
	return (
		<>
			<EmployeeDataTable func={func} />
			<div className="mt-4 flex justify-between">
				<Button onClick={() => setSelectedIndex(selectedIndex - 1)}>
					{Translate("previous_step")}
				</Button>
				<Button onClick={() => setSelectedIndex(selectedIndex + 1)}>
					{Translate("next_step")}
				</Button>
			</div>
		</>
	);
}
