import { useTranslation } from "react-i18next";
import { PopoverMultiSelector } from "../popover_multi_selector";
import { Badge } from "../ui/badge";
import { type SyncDataAndStatus } from "./update_table";

interface SelectDepartmentProps {
	data: SyncDataAndStatus[];
	selectedKeys: Set<string>;
	setSelectedKeys: (key: Set<string>) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function SelectDepartment({
	data,
	selectedKeys,
	setSelectedKeys,
	open,
	setOpen,
}: SelectDepartmentProps) {
	const { t } = useTranslation(["common"]);

	const departments = new Set<string>();
	const changed_departments = new Set<string>();

	data.forEach((d) => {
		if (!d.department.salary_value) {
			changed_departments.add(d.department.ehr_value);
		}
		departments.add(d.department.salary_value ?? d.department.ehr_value);
	});

	const departmentsOptions = Array.from(departments).map((d) => {
		if (changed_departments.has(d)) {
			return {
				key: d,
				value: d,
				option: <div>{d}<Badge variant="outline">{t("sync_page.new_department")}</Badge></div>,
			};
		}

		return {
			key: d,
			value: d,
			option: <div>{d}</div>,
		};
	});

	return (
		<PopoverMultiSelector
			data={departmentsOptions}
			selectedKeys={selectedKeys}
			setSelectedKeys={setSelectedKeys}
			open={open}
			setOpen={setOpen}
			placeholder={t("button.select")}
			emptyPlaceholder={t("button.select")}
		/>
	);
}
