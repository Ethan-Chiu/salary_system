import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { SelectModeComponent } from "~/components/synchronize/select_mode";
import { EmployeeDataChange } from "~/components/synchronize/emp_data_table";
import { type SyncData } from "~/server/service/sync_service";
import {
	type SyncDataAndStatus,
	UpdateTableDialog,
} from "~/components/synchronize/update_table";
import { type SyncCheckStatusEnumType } from "~/components/synchronize/utils/sync_check_status";
import {
	SyncDataDisplayModeEnum,
	type SyncDataDisplayModeEnumType,
} from "~/components/synchronize/utils/data_display_mode";
import { toast } from "~/components/ui/use-toast";
import { SelectEmployee } from "~/components/synchronize/select_employee";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Toggle } from "~/components/ui/toggle";
import { useTranslation } from "next-i18next";
import { EmployeeDataChangeAll } from "./emp_data_table_all";
import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons";

export function SyncPageContent({ data }: { data: SyncData[] }) {
	const [selectedEmployee, setSelectedEmployee] = useState<string | null>(
		data[0]?.emp_no.ehr_value ?? null
	);
	const [mode, setMode] = useState<SyncDataDisplayModeEnumType>(
		SyncDataDisplayModeEnum.Values.changed
	);

	const checked = {} as Record<string, SyncCheckStatusEnumType>;
	data.forEach((d) => {
		checked[d.emp_no.ehr_value] = "initial";
	});
	const [checkedStatus, setCheckedStatus] =
		useState<Record<string, SyncCheckStatusEnumType>>(checked);
	const [dataWithStatus, setDataWithStatus] = useState<SyncDataAndStatus[]>(
		[]
	);
	const [isAllConfirmed, setIsAllConfirmed] = useState<boolean>(false);
	const [showAllData, setShowAllData] = useState<boolean>(false);

	const { t } = useTranslation(["common"]);

	useEffect(() => {
		setDataWithStatus(
			data.map((d) => {
				return {
					emp_no: d.emp_no.ehr_value,
					emp_name: d.name.ehr_value,
					check_status:
						checkedStatus[d.emp_no.ehr_value] ?? "initial",
					comparisons: d.comparisons,
				};
			})
		);
	}, [data, checkedStatus]);

	useEffect(() => {
		setIsAllConfirmed(
			Object.values(checkedStatus).every((status) => status === "checked")
		);
	}, [checkedStatus]);

	const changeSelectedEmpStatus = (status: SyncCheckStatusEnumType) => {
		setCheckedStatus((prevCheckedStatus) => {
			if (!selectedEmployee) return prevCheckedStatus;

			return {
				...prevCheckedStatus,
				[selectedEmployee]: status,
			};
		});
	};

	const nextEmp = () => {
		const selectedEmployeeIndex = data.findIndex(
			(d) => d.emp_no.ehr_value === selectedEmployee
		);
		for (let i = 1; i < data.length; i++) {
			const idx = (selectedEmployeeIndex + i) % data.length;
			const empNo = data[idx]?.emp_no.ehr_value;
			if (empNo && checkedStatus[empNo] === "initial") {
				setSelectedEmployee(empNo);
				return true;
			}
		}
		// All checked
		return false;
	};

	const handleConfirm = () => {
		changeSelectedEmpStatus("checked");
		if (!nextEmp()) {
			toast({
				title: t("others.well_done"),
				description: t("others.well_done_msg"),
				className: cn(
					"top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 data-[state=open]:sm:slide-in-from-top-full"
				),
			});
		}
	};

	const handleIgnore = () => {
		changeSelectedEmpStatus("ignored");
		nextEmp();
	};

	function CompAllDonePage() {
		return (
			<div className="flex h-0 w-full flex-grow items-center justify-center">
				<Card className="w-1/2 text-center">
					<CardHeader className="p-2 pt-0 md:p-4">
						<CardTitle className="p-4">
							{t("others.up_to_date")}
						</CardTitle>
						<CardDescription>
							{t("others.up_to_date_msg")}
						</CardDescription>
					</CardHeader>
					<CardContent className="p-2 pt-0 md:p-4 md:pt-0"></CardContent>
				</Card>
			</div>
		);
	}

	function CompTopBar({ data }: { data: SyncData[] }) {
		return (
			<>
				<div className="mb-4 flex items-center">
					<Toggle
						variant="outline"
						aria-label="Toggle italic"
						className="mr-2"
						onPressedChange={() => setShowAllData(!showAllData)}
						pressed={showAllData}
					>
						{showAllData ? (
							<>
								<DoubleArrowUpIcon className="mr-2 h-4 w-4" />
								<p>{t("sync_page.select_employee")}</p>
							</>
						) : (
							<>
								<DoubleArrowDownIcon className="mr-2 h-4 w-4" />
								<p>{t("sync_page.show_all")}</p>
							</>
						)}
					</Toggle>
					<div
						className={cn(
							"transition-all duration-700",
							!showAllData ? "opacity-100" : "opacity-0"
						)}
					>
						<SelectEmployee
							data={data}
							checkStatus={checkedStatus}
							selectedEmployee={selectedEmployee}
							setSelectedEmployee={setSelectedEmployee}
						/>
					</div>
					<div className="ml-auto">
						<SelectModeComponent mode={mode} setMode={setMode} />
					</div>
				</div>
			</>
		);
	}

	function CompChangedDataTable({ data }: { data: SyncData[] }) {
		const selectedEmployeeData =
			data.find((emp) => {
				return emp.emp_no.ehr_value === selectedEmployee;
			})?.comparisons ?? [];

		return (
			<>
				{selectedEmployee && (
					<div className="h-0 w-full flex-grow">
						<EmployeeDataChange
							empData={selectedEmployeeData}
							mode={mode}
						/>
					</div>
				)}
			</>
		);
	}

	function CompChangedDataTableAll({ data }: { data: SyncData[] }) {
		return (
			<>
				{selectedEmployee && (
					<div className="h-0 w-full flex-grow">
						<EmployeeDataChangeAll data={data} mode={mode} />
					</div>
				)}
			</>
		);
	}

	if (!data || data.length === 0) {
		return <CompAllDonePage />;
	}

	return (
		<>
			{/* Main Content */}
			<CompTopBar data={data} />
			{showAllData ? (
				<CompChangedDataTableAll data={data} />
			) : (
				<CompChangedDataTable data={data} />
			)}
			{/* Bottom Buttons */}
			<div className="mt-4 flex justify-between">
				<UpdateTableDialog data={dataWithStatus} />

				<div className="flex">
					<Button
						key="IgnoreButton"
						variant={"destructive"}
						onClick={() => handleIgnore()}
					>
						{t("button.ignore")}
					</Button>
					<Button
						key="ConfirmButton"
						onClick={() => handleConfirm()}
						className="ml-4"
						disabled={isAllConfirmed}
					>
						{t("button.confirm")}
					</Button>
				</div>
			</div>
		</>
	);
}
