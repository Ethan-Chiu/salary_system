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
import {
	type SyncCheckStatusEnumType,
} from "~/components/synchronize/utils/sync_check_status";
import {
	SyncDataDisplayModeEnum,
	type SyncDataDisplayModeEnumType,
} from "~/components/synchronize/utils/data_display_mode";
import { toast } from "~/components/ui/use-toast";
import { SelectEmployee } from "~/components/synchronize/select_employee";


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
				title: "Well done!",
				description:
					"You have checked all the changes. Please click Update button.",
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
			<div className="h-0 w-full flex-grow">
				System Data is updated with EHR
			</div>
		);
	}

	function CompTopBar({ data }: { data: SyncData[] }) {
		return (
			<>
				<div className="mb-4 flex items-center">
					<SelectEmployee
						data={data}
						checkStatus={checkedStatus}
						selectedEmployee={selectedEmployee}
						setSelectedEmployee={setSelectedEmployee}
					/>
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

	return (
		<>
			{/* Main Content */}
			{data ? (
				<>
					<CompTopBar data={data} />
					<CompChangedDataTable data={data} />
				</>
			) : (
				<CompAllDonePage />
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
						{"Ignore"}
					</Button>
					<Button
						key="ConfirmButton"
						onClick={() => handleConfirm()}
						className="ml-4"
						disabled={isAllConfirmed}
					>
						{"Confirm"}
					</Button>
				</div>
			</div>
		</>
	);
}
