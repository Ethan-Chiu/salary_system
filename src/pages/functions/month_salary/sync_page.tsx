import { useState } from "react";
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
import { EmployeeDataChange } from "~/pages/synchronize/components/EmpDataTable";
import { AllDoneDialog } from "~/pages/synchronize/components/AllDoneDialog";
import { Translate } from "~/lib/utils/translation";
import { LoadingSpinner } from "~/components/loading";
import { SyncData } from "~/server/service/sync_service";

interface EMP {
	emp_no: string;
}
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

	const { isFetched, isLoading, isError, data, error } =
		api.sync.checkEmployeeData.useQuery({
			func: "month_salary",
			period: period,
		});

	const getDataLength = () => (data ?? []).length;

	function check(newCheckedEmp: string) {
		setCheckedEmployees((prevCheckedEmployees) => {
			if (prevCheckedEmployees.includes(newCheckedEmp))
				return prevCheckedEmployees;
			return [...prevCheckedEmployees, newCheckedEmp];
		});
	}

	const handleConfirmChange = () => {
		// check(selectedEmployee);
	};

	const handleAllDone = () => {
		setSelectedIndex(selectedIndex + 1);
		console.log("confirm");
	};

	function SelectEmpComponent({ data }: { data: SyncData[] }) {
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
										onSelect={(currentValue) => {
											setSelectedEmployee(
												(
													currentValue.split(
														" "
													)[0] ?? ""
												).toUpperCase()
											);
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

	function isFinished() {
		return (
			(checkedEmployees.length == getDataLength() - 1 &&
				selectedEmployee &&
				!checkedEmployees.includes(selectedEmployee)) ||
			checkedEmployees.length == getDataLength()
		);
	}

	function AllDonePage() {
		return (
			<div className="flex h-full flex-grow flex-col">
				<div className="h-0 w-full flex-grow">
					System Data is updated with EHR
				</div>
				<div className="mt-4 flex justify-between">
					<Button
						key="PreviousButton"
						onClick={() => setSelectedIndex(selectedIndex - 1)}
					>
						{Translate("previous_step")}
					</Button>
					{!isFinished() && (
						<Button
							key="ConfirmButton"
							onClick={() => handleConfirmChange()}
						>
							{Translate("next_step")}
						</Button>
					)}

					{isFinished() && (
						<AllDoneDialog
							confirmFunction={() => handleAllDone()}
						/>
					)}
				</div>
			</div>
		);
	}

	function MainPage({ data }: { data: SyncData[] }) {
		return (
			<div className="flex h-full flex-grow flex-col">
				<div className="mb-4 flex items-center">
					<SelectEmpComponent data={data} />
					{selectedEmployee && (
						<Label className="ml-4">部門：{}</Label>
					)}
					<div className="ml-auto">
						<SelectModeComponent mode={mode} setMode={setMode} />
					</div>
				</div>
				{selectedEmployee && (
					<div className="h-0 w-full flex-grow">
						{/* <EmployeeDataChange
							empData={getEmpData(selectedEmployee)}
							mode={mode}
							diffColor={diffColor}
						/> */}
					</div>
				)}
				<div className="mt-4 flex justify-between">
					<Button
						key="PreviousButton"
						onClick={() => setSelectedIndex(selectedIndex - 1)}
					>
						{Translate("previous_step")}
					</Button>
					{!isFinished() && (
						<Button
							key="ConfirmButton"
							onClick={() => handleConfirmChange()}
						>
							{Translate("next_step")}
						</Button>
					)}

					{isFinished() && (
						<AllDoneDialog
							confirmFunction={() => handleAllDone()}
						/>
					)}
				</div>
			</div>
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
			{data ? <MainPage data={data} /> : <AllDonePage />}
		</div>
	);
}
