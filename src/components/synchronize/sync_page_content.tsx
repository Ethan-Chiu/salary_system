import { useEffect, useState } from "react";
import { SelectModeComponent } from "~/components/synchronize/select_mode";
import { type SyncData } from "~/server/service/sync_service";
import {
	type SyncDataAndStatus,
	UpdateTableDialog,
} from "~/components/synchronize/update_table";
import {
	SyncDataDisplayModeEnum,
	type SyncDataDisplayModeEnumType,
} from "~/components/synchronize/utils/data_display_mode";
import { SelectEmployee } from "~/components/synchronize/select_employee";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { useTranslation } from "next-i18next";
import { EmployeeDataChangeTable } from "./emp_data_table_all";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	SyncDataSelectModeEnum,
	type SyncDataSelectModeEnumType,
	syncDataSelectModeString,
} from "./utils/select_mode";
import { SelectDepartment } from "./select_department";

export function SyncPageContent({ data }: { data: SyncData[] }) {
	const [mode, setMode] = useState<SyncDataDisplayModeEnumType>(
		SyncDataDisplayModeEnum.Values.changed
	);
	const [filterMode, setFilterMode] = useState<SyncDataSelectModeEnumType>(
		SyncDataSelectModeEnum.Values.all_emp
	);

	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
	const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(
		new Set()
	);

	// Status
	const [dataWithStatus, setDataWithStatus] = useState<SyncDataAndStatus[]>(
		[]
	);
	const [filterData, setFilterData] = useState<SyncDataAndStatus[]>([]);

	const { t } = useTranslation(["common"]);

	useEffect(() => {
		setDataWithStatus(
			data.map((d) => {
				return {
					emp_no: d.emp_no.salary_value,
					emp_name: d.name.salary_value,
					department: d.department.salary_value,
					comparisons: d.comparisons.map((c) => {
						return {
							key: c.key,
							salary_value: c.salary_value,
							ehr_value: c.ehr_value,
							is_different: c.is_different,
							check_status: "initial",
						};
					}),
				};
			})
		);
	}, [data]);

	/* Filter Data */
	useEffect(() => {
		switch (filterMode) {
			case SyncDataSelectModeEnum.Values.all_emp:
				setFilterData(dataWithStatus);
				break;
			case SyncDataSelectModeEnum.Values.filter_emp:
				setFilterData(() =>
					dataWithStatus.filter((d) => selectedKeys.has(d.emp_no))
				);
				break;
			case SyncDataSelectModeEnum.Values.filter_dep:
				setFilterData(() =>
					dataWithStatus.filter((d) =>
						selectedDepartments.has(d.department)
					)
				);
				break;
		}
	}, [dataWithStatus, filterMode, selectedKeys, selectedDepartments]);

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
								<SelectItem
									value={
										SyncDataSelectModeEnum.Values.all_emp
									}
								>
									{t(
										`sync_page.${syncDataSelectModeString(
											SyncDataSelectModeEnum.Values
												.all_emp
										)}`
									)}
								</SelectItem>
								<SelectItem
									value={
										SyncDataSelectModeEnum.Values.filter_emp
									}
								>
									{t(
										`sync_page.${syncDataSelectModeString(
											SyncDataSelectModeEnum.Values
												.filter_emp
										)}`
									)}
								</SelectItem>
								<SelectItem
									value={
										SyncDataSelectModeEnum.Values.filter_dep
									}
								>
									{t(
										`sync_page.${syncDataSelectModeString(
											SyncDataSelectModeEnum.Values
												.filter_dep
										)}`
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
							<SelectDepartment
								data={data}
								selectedKeys={selectedDepartments}
								setSelectedKeys={setSelectedDepartments}
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
				<EmployeeDataChangeTable 
					data={filterData} 
					setDataStatus={(emp_no, key, checked) => {
						setDataWithStatus((prevData) => {
							return prevData.map((employee) => {
								if (employee.emp_no === emp_no) {
									return {
										...employee,
										comparisons: employee.comparisons.map((comparison) => {
											if (comparison.key === key) {
												return {
													...comparison,
													check_status: checked ? "checked" : "initial"
												};
											}
											return comparison;
										})
									};
								}
								return employee;
							});
						});
					}}
					mode={mode}
				/>
			</div>
			{/* Bottom Buttons */}
			<div className="mt-4 flex justify-between">
				<UpdateTableDialog data={dataWithStatus} />
			</div>
		</>
	);
}
