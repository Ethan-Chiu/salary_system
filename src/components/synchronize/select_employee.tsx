
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "~/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";

import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";
import { type SyncData } from "~/server/service/sync_service";
import { statusLabel, type SyncCheckStatusEnumType } from "./utils/sync_check_status";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";


export function SelectEmployee({
	data,
	checkStatus,
	selectedEmployee,
	setSelectedEmployee,
}: {
	data: SyncData[];
	checkStatus: Record<string, SyncCheckStatusEnumType>;
	selectedEmployee: string | null;
	setSelectedEmployee: (emp: string | null) => void;
}) {
	const [open, setOpen] = useState(false);

	const { t } = useTranslation(['common'])

	const selectFilter = (value: string, search: string) =>
		value.toUpperCase().includes(search) ||
		value.toLowerCase().includes(search)
			? 1
			: 0;

	const selectedEmployeeData = data.find(
		(emp) => emp.emp_no.ehr_value === selectedEmployee
	);

	const CompEntryDisplay = ({
		empNo,
		name,
		englishName,
	}: {
		empNo: string;
		name?: string;
		englishName?: string;
	}) => {
		const status = t(statusLabel(checkStatus[empNo] ?? "initial"));
		return (
			<>
				<b className="mr-1">{empNo}</b>
				<p className="mr-1">{`${name} ${englishName} ${status}`}</p>
			</>
		);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			{/* Selector */}
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between"
				>
					{selectedEmployee ? (
						<CompEntryDisplay
							empNo={selectedEmployee}
							name={selectedEmployeeData?.name.ehr_value}
							englishName={
								selectedEmployeeData?.english_name.ehr_value
							}
						/>
					) : (
						"Select an Employee..."
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<Label className="ml-4">
				{`${t("table.department")}： ${selectedEmployeeData?.department.ehr_value}`}
			</Label>
			{/* Popover */}
			<PopoverContent className="p-0">
				<Command filter={selectFilter}>
					<CommandInput placeholder={t("others.search_employee")} />
					<CommandEmpty>{t("others.no_employee_found")}</CommandEmpty>
					<CommandGroup>
						{data.map((empData: SyncData) => {
							const empNo = empData.emp_no.ehr_value;
							const checked = checkStatus[empNo] === "checked";
							return (
								<CommandItem
									key={empNo}
									value={empNo}
									onSelect={() => {
										setSelectedEmployee(empNo);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedEmployee === empNo
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{
										<div
											className={cn(
												"flex items-center",
												!checked && "text-red-400"
											)}
										>
											<CompEntryDisplay
												empNo={empNo}
												name={empData.name.ehr_value}
												englishName={
													empData.english_name
														.ehr_value
												}
											/>
										</div>
									}
								</CommandItem>
							);
						})}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
