import { useTranslation } from "react-i18next";
import { PopoverMultiSelector } from "../popover_multi_selector";
import { type SyncDataAndStatus } from "./update_table";
import { Badge } from "../ui/badge";

interface SelectEmployeeProps {
	data: SyncDataAndStatus[];
	selectedKeys: Set<string>;
	setSelectedKeys: (key: Set<string>) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function SelectEmployee({
	data,
	selectedKeys,
	setSelectedKeys,
	open,
	setOpen,
}: SelectEmployeeProps) {
	const { t } = useTranslation(["common"]);

	const foramttedData = data.map((d) => {
		const changed = !d.name.salary_value || !d.english_name.salary_value
			return {
				key: d.emp_no,
				value: `${d.emp_no} ${
					d.name.salary_value ?? d.name.ehr_value
				} ${d.english_name.salary_value}`,
				option: (
					<div>{`${d.emp_no} ${
						d.name.ehr_value ?? d.name.ehr_value
					} ${d.english_name.ehr_value ?? d.name.ehr_value}`}{changed && <Badge variant="outline">{t("sync_page.new_department")}</Badge>}</div>
				),
			};
	});

	return (
		<PopoverMultiSelector
			data={foramttedData}
			selectedKeys={selectedKeys}
			setSelectedKeys={setSelectedKeys}
			open={open}
			setOpen={setOpen}
			placeholder={t("button.select")}
			emptyPlaceholder={t("button.select")}
		/>
	);
}
