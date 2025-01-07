import { type PopoverSelectorDataType } from "~/components/popover_selector";
import { type HistoryViewEmployeeCommonEmpInfo } from "./types";
import { type HistoryDataType } from "../history_data_type";
import { formatDate } from "~/lib/utils/format_date";

export function buildEmployeeSelectOptions(
	data: HistoryViewEmployeeCommonEmpInfo[][]
) {
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

export function buildDateSelectOptions(
	data: HistoryDataType[][],
	other: string
) {
	const dateOpts: PopoverSelectorDataType[] = [];

	data?.forEach((e) => {
		if (
			e[0]!.start_date &&
			!dateOpts.some(
				(opt) => opt.key === formatDate("day", e[0]!.start_date)
			)
		) {
			dateOpts.push({
				key: formatDate("day", e[0]?.start_date ?? null) ?? other,
				value: formatDate("day", e[0]?.start_date ?? null) ?? other,
			});
		}
	});

	return dateOpts;
}
