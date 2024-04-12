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
import { AllDoneDialog } from "~/pages/synchronize/components/AllDoneDialog";
import { Translate } from "~/lib/utils/translation";
import { LoadingSpinner } from "~/components/loading";
import { type SyncData } from "~/server/service/sync_service";

export function SyncPage({
	period,
	selectedIndex,
	setSelectedIndex,
}: {
	period: number;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
	const [checkedEmployees, setCheckedEmployees] = useState<Array<string>>([]);
	const [selectedEmployee, setSelectedEmployee] = useState<string | null>(
		null
	);
	const [mode, setMode] = useState("Changed");

	const { isLoading, isError, data, error } =
		api.sync.checkEmployeeData.useQuery({
			func: "month_salary",
			period: period,
		});

	const [isFinished, setIsFinished] = useState(false);

	useEffect(() => {
		const dataLength = data?.length ?? 0;

		setIsFinished(
			(checkedEmployees.length == dataLength - 1 &&
				selectedEmployee != null &&
				!checkedEmployees.includes(selectedEmployee)) ||
				checkedEmployees.length == dataLength
		);
	}, [
		checkedEmployees,
		data?.length,
		selectedEmployee,
		checkedEmployees.length,
	]);

	const handleConfirmChange = () => {
		setCheckedEmployees((prevCheckedEmployees) => {
			if (!selectedEmployee) return prevCheckedEmployees;

			return prevCheckedEmployees.includes(selectedEmployee)
				? prevCheckedEmployees
				: [...prevCheckedEmployees, selectedEmployee];
		});
	};

	const handleAllDone = () => {
		setSelectedIndex(selectedIndex + 1);
		console.log("confirm");
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
						checkedEmployees={checkedEmployees}
						selectedEmployee={selectedEmployee}
						setSelectedEmployee={setSelectedEmployee}
					/>
					{selectedEmployee && (
						<Label className="ml-4">部門：{}</Label>
					)}
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

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<div className="grow">
			<div className="flex h-full flex-grow flex-col">
				{/* Main Content */}
				{data ? <MainPage data={data} /> : <AllDonePage />}
				{/* Pagination */}
				<CompPagination
					isFinished={isFinished}
					handleFinish={handleAllDone}
					handleNext={handleConfirmChange}
				/>
			</div>
		</div>
	);
}

function CompSelectEmp({
	data,
	checkedEmployees,
	selectedEmployee,
	setSelectedEmployee,
}: {
	data: SyncData[];
	checkedEmployees: string[];
	selectedEmployee: string | null;
	setSelectedEmployee: (emp: string | null) => void;
}) {
	const [open, setOpen] = useState(false);

	const selectFilter = (value: string, search: string) =>
		value.toUpperCase().includes(search) ||
		value.toLowerCase().includes(search)
			? 1
			: 0;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{selectedEmployee
						? selectedEmployee
						: "Select an Employee..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command filter={selectFilter}>
					<CommandInput placeholder="Search Employee..." />
					<CommandEmpty>No Employee found.</CommandEmpty>
					<CommandGroup>
						{data.map((empData: SyncData) => {
							const empNo = empData.emp_no.ehr_value;
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
												!checkedEmployees.includes(
													empNo
												) && "text-red-400"
											)}
										>
											<b className="mr-1">{empNo}</b>
											<p className="mr-1">
												{empData.name.ehr_value}
											</p>
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

function CompPagination({
	isFinished,
	handleFinish,
	handleNext,
}: {
	isFinished: boolean;
	handleFinish: () => void;
	handleNext: () => void;
}) {
	return (
		<div className="mt-4 flex justify-between">
			<Button
				key="PreviousButton"
				className="disabled:cursor-not-allowed"
			>
				{Translate("previous_step")}
			</Button>

			{isFinished ? (
				<AllDoneDialog confirmFunction={handleFinish} />
			) : (
				<Button key="ConfirmButton" onClick={handleNext}>
					{Translate("next_step")}
				</Button>
			)}
		</div>
	);
}
