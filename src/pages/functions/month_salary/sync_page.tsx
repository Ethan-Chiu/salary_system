import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

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

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { SelectModeComponent } from "~/pages/synchronize/components/Selects";
import { EmployeeDataChange } from "~/pages/functions/components/emp_data_table";
import { LoadingSpinner } from "~/components/loading";
import { type SyncData } from "~/server/service/sync_service";
import {
	type SyncDataAndStatus,
	type SyncCheckStatus,
	UpdateTableDialog,
} from "~/pages/synchronize/components/update_table";

interface SyncPageProps {
	period: number;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

export function SyncPage({ period }: SyncPageProps) {
	const { isLoading, isError, data, error } =
		api.sync.checkEmployeeData.useQuery({
			func: "month_salary",
			period: period,
		});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return data != null ? <SyncPageContent data={data} /> : <div>no data</div>;
}

function SyncPageContent({ data }: { data: SyncData[] }) {
	const [selectedEmployee, setSelectedEmployee] = useState<string | null>(
		data[0]?.emp_no.ehr_value ?? null
	);
	const [mode, setMode] = useState("Changed");

	const checked = {} as Record<string, SyncCheckStatus>
	data.forEach((d) => {
		checked[d.emp_no.ehr_value] = "initial"
	})
	const [checkedStatus, setCheckedStatus] = useState<Record<string, SyncCheckStatus>>(checked);
	const [dataWithStatus, setDataWithStatus] = useState<SyncDataAndStatus[]>([]);
	
	useEffect(() => {
		setDataWithStatus(data.map((d) => {
			return {
				emp_no: d.emp_no.ehr_value,
				emp_name: d.name.ehr_value,
				check_status: checkedStatus[d.emp_no.ehr_value] ?? "initial",
				comparisons: d.comparisons
			}
		}))
	}, [data, checkedStatus])

	const changeSelectedEmpStatus = (status: SyncCheckStatus) => {
		setCheckedStatus((prevCheckedStatus) => {
			if (!selectedEmployee) return prevCheckedStatus;

			return {
				...prevCheckedStatus,
				[selectedEmployee]: status,
			};
		})
	}

	const handleConfirm = () => {
		changeSelectedEmpStatus("checked");
	};

	const handleIgnore = () => {
		changeSelectedEmpStatus("ignored");
	};

	function AllDonePage() {
		return (
			<div className="h-0 w-full flex-grow">
				System Data is updated with EHR
			</div>
		);
	}

	function MainPage({ data }: { data: SyncData[] }) {
		const selectedEmployeeData =
			data.find((emp) => {
				return emp.emp_no.ehr_value === selectedEmployee;
			})?.comparisons ?? [];

		return (
			<>
				<div className="mb-4 flex items-center">
					<CompSelectEmp
						data={data}
						checkStatus={checkedStatus}
						selectedEmployee={selectedEmployee}
						setSelectedEmployee={setSelectedEmployee}
					/>
					<div className="ml-auto">
						<SelectModeComponent mode={mode} setMode={setMode} />
					</div>
				</div>
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
		<div className="grow">
			<div className="flex h-full flex-grow flex-col">
				{/* Main Content */}
				{data ? <MainPage data={data} /> : <AllDonePage />}
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
						>
							{"Confirm"}
						</Button>
					</div>
				</div>
				{/*  */}
			</div>
		</div>
	);
}

function CompSelectEmp({
	data,
	checkStatus,
	selectedEmployee,
	setSelectedEmployee,
}: {
	data: SyncData[];
	checkStatus: Record<string, SyncCheckStatus>;
	selectedEmployee: string | null;
	setSelectedEmployee: (emp: string | null) => void;
}) {
	const [open, setOpen] = useState(false);

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
		return (
			<>
				<b className="mr-1">{empNo}</b>
				<p className="mr-1">{`${name} ${englishName}`}</p>
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
				{`部門： ${selectedEmployeeData?.department.ehr_value}`}
			</Label>
			{/* Popover */}
			<PopoverContent className="w-[200px] p-0">
				<Command filter={selectFilter}>
					<CommandInput placeholder="Search Employee..." />
					<CommandEmpty>No Employee found.</CommandEmpty>
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
