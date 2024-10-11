import { type SyncData } from "~/server/service/sync_service";
import { useTranslation } from "react-i18next";
import { PopoverMultiSelector } from "../popover_multi_selector";

interface SelectEmployeeProps {
	data: SyncData[];
	selectedKeys: Set<string>;
	setSelectedKeys: (key: Set<string>) => void;
}

export function SelectEmployee({
	data,
	selectedKeys,
	setSelectedKeys,
}: SelectEmployeeProps) {
	const { t } = useTranslation(["common"]);

	const foramttedData = data.map((d) => ({
		key: d.emp_no.ehr_value,
		value: `${d.emp_no.salary_value} ${d.name.salary_value} ${d.english_name.salary_value}`,
	}));

	return (
		<PopoverMultiSelector
			data={foramttedData}
			selectedKeys={selectedKeys}
			setSelectedKeys={setSelectedKeys}
			placeholder={t("synchronize.select_employee")}
			emptyPlaceholder={t("synchronize.select_employee")}
		/>
	);
}
