import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { SelectModeComponent } from "~/components/synchronize/select_mode";
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
import { useTranslation } from "next-i18next";
import { EmployeeDataChangeAll } from "./emp_data_table_all";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	SyncDataSelectModeEnum,
	type SyncDataSelectModeEnumType,
	syncDataSelectModeString,
} from "./utils/select_mode";
import { Label } from "../ui/label";

export function SyncPageContent({ data }: { data: SyncData[] }) {
	const [mode, setMode] = useState<SyncDataDisplayModeEnumType>(
		SyncDataDisplayModeEnum.Values.changed
	);
	const [filterMode, setFilterMode] = useState<SyncDataSelectModeEnumType>(
		SyncDataSelectModeEnum.Values.all_emp
	);
	const [filterData, setFilterData] = useState<SyncData[]>(data);

	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

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

	useEffect(() => {
		switch (filterMode) {
			case SyncDataSelectModeEnum.Values.all_emp:
				setFilterData(data);
				break;
			case SyncDataSelectModeEnum.Values.filter_emp:
				setFilterData(() =>
					data.filter((d) => selectedKeys.has(d.emp_no.salary_value))
				);
				break;
			case SyncDataSelectModeEnum.Values.filter_dep:
				setFilterData(() =>
					data.filter((d) => d.department.ehr_value === "TODO")
				);
				break;
		}
	}, [data, filterMode, selectedKeys]);

	/* const changeSelectedEmpStatus = (status: SyncCheckStatusEnumType) => { */
	/* 	setCheckedStatus((prevCheckedStatus) => { */
	/* 		if (!selectedEmployee) return prevCheckedStatus; */
	/**/
	/* 		return { */
	/* 			...prevCheckedStatus, */
	/* 			[selectedEmployee]: status, */
	/* 		}; */
	/* 	}); */
	/* }; */

	/* const nextEmp = () => { */
	/* 	const selectedEmployeeIndex = data.findIndex( */
	/* 		(d) => d.emp_no.ehr_value === selectedEmployee */
	/* 	); */
	/* 	for (let i = 1; i < data.length; i++) { */
	/* 		const idx = (selectedEmployeeIndex + i) % data.length; */
	/* 		const empNo = data[idx]?.emp_no.ehr_value; */
	/* 		if (empNo && checkedStatus[empNo] === "initial") { */
	/* 			setSelectedEmployee(empNo); */
	/* 			return true; */
	/* 		} */
	/* 	} */
	/* 	// All checked */
	/* 	return false; */
	/* }; */

	/* const handleConfirm = () => { */
	/* 	changeSelectedEmpStatus("checked"); */
	/* 	if (!nextEmp()) { */
	/* 		toast({ */
	/* 			title: t("others.well_done"), */
	/* 			description: t("others.well_done_msg"), */
	/* 			className: cn( */
	/* 				"top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 data-[state=open]:sm:slide-in-from-top-full" */
	/* 			), */
	/* 		}); */
	/* 	} */
	/* }; */

	/* const handleIgnore = () => { */
	/* 	changeSelectedEmpStatus("ignored"); */
	/* 	nextEmp(); */
	/* }; */

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
					<Select
						value={filterMode}
						onValueChange={(v) =>
							setFilterMode(v as SyncDataSelectModeEnumType)
						}
					>
						<SelectTrigger className="mr-2 w-[180px]">
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>
									{t("sync_page.select_filter_mode")}
								</SelectLabel>
								<SelectItem
									value={
										SyncDataSelectModeEnum.Values.all_emp
									}
								>
									{syncDataSelectModeString(
										SyncDataSelectModeEnum.Values.all_emp
									)}
								</SelectItem>
								<SelectItem
									value={
										SyncDataSelectModeEnum.Values.filter_emp
									}
								>
									{syncDataSelectModeString(
										SyncDataSelectModeEnum.Values.filter_emp
									)}
								</SelectItem>
								<SelectItem
									value={
										SyncDataSelectModeEnum.Values.filter_dep
									}
								>
									{syncDataSelectModeString(
										SyncDataSelectModeEnum.Values.filter_dep
									)}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					{filterMode ===
						SyncDataSelectModeEnum.Values.filter_emp && (
						<div className="">
							<SelectEmployee
								data={data}
								selectedKeys={selectedKeys}
								setSelectedKeys={setSelectedKeys}
							/>
						</div>
					)}
					{filterMode ===
						SyncDataSelectModeEnum.Values.filter_dep && (
						<div className="">
							<SelectEmployee
								data={data}
								selectedKeys={selectedKeys}
								setSelectedKeys={setSelectedKeys}
							/>
						</div>
					)}
					<div className="ml-auto">
						<SelectModeComponent mode={mode} setMode={setMode} />
					</div>
				</div>
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
			<div className="relative h-0 w-full flex-grow ">
				<EmployeeDataChangeAll data={filterData} mode={mode} />
			</div>
			{/* Bottom Buttons */}
			<div className="mt-4 flex justify-between">
				<UpdateTableDialog data={dataWithStatus} />

				<div className="flex">
					<Button key="IgnoreButton" variant={"destructive"}>
						{t("button.ignore")}
					</Button>
					<Button
						key="ConfirmButton"
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
