import { type PopoverSelectorDataType } from "~/components/popover_selector";
import { type HistoryViewEmployeeCommonEmpInfo } from "./types";

export function buildEmployeeSelectOptions(data: HistoryViewEmployeeCommonEmpInfo[][]) {
	const employeeOpts: PopoverSelectorDataType[] = [];

	data.forEach((empDataList) => {
		const firstEmpData = empDataList[0];

		if (!firstEmpData) {
			return;
		}

		employeeOpts.push({
			key: firstEmpData.emp_no,
			value: `${firstEmpData.emp_no} ${firstEmpData.emp_name}`,
		});
	});

  return employeeOpts;
}
