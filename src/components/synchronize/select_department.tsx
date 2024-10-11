import { type SyncData } from "~/server/service/sync_service";
import { useTranslation } from "react-i18next";
import { PopoverMultiSelector } from "../popover_multi_selector";

interface SelectDepartmentProps {
	data: SyncData[];
	selectedKeys: Set<string>;
	setSelectedKeys: (key: Set<string>) => void;
}

export function SelectDepartment({
	data,
	selectedKeys,
	setSelectedKeys,
}: SelectDepartmentProps) {
	const { t } = useTranslation(["common"]);

  const departments = new Set<string>();
  data.forEach(d => {
    departments.add(d.department.salary_value as string);
  });
  const departmentsOptions = Array.from(departments).map(d => ({
    key: d,
    value: d
  }));

	return (
		<PopoverMultiSelector
			data={departmentsOptions}
			selectedKeys={selectedKeys}
			setSelectedKeys={setSelectedKeys}
			placeholder={t("synchronize.select_employee")}
			emptyPlaceholder={t("synchronize.select_employee")}
		/>
	);
}
