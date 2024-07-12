import { Button } from "~/components/ui/button";
import { EmployeeDataTable } from "../tables/employee_data_table";

import { useTranslation } from 'next-i18next'

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
	const { t } = useTranslation(['common'], { keyPrefix: "button" })

	return (
		<>
			<EmployeeDataTable func={func} />
			<div className="mt-4 flex justify-between">
				<Button onClick={() => setSelectedIndex(selectedIndex - 1)}>
					{t("previous_step")}
				</Button>
				<Button onClick={() => setSelectedIndex(selectedIndex + 1)}>
					{t("next_step")}
				</Button>
			</div>
		</>
	);
}
