import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement, useState, useEffect, Fragment } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Header } from "~/components/header";
import { Label } from "~/components/ui/label";
import { api } from "~/utils/api";
import { Paintbrush } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

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

import { displayData } from "./utils/display";
import { SelectModeComponent } from "./components/Selects";
import { AllDoneDialog } from "./components/AllDoneDialog";
import { CombinedData } from "~/server/service/employee_data_service";

interface EMP {
	emp_no: string;
}

interface EmpTableParameters {
	empData: Array<CombinedData>,
	mode: string,
	diffColor: string
}

function EmployeeDataChange({
	empData,
	mode,
	diffColor,
}: EmpTableParameters) {
	const [diffKeys, setDiffKeys] = useState<string[]>([]);
	useEffect(() => {
		let dk: Array<string> = [];
		empData.map((d: CombinedData) => {
			if(d.is_different) dk.push(d.key)
		})
		setDiffKeys(dk);
	}, []);

	const isDiff = (checkKey: string): boolean => {
		return diffKeys.includes(checkKey);
	};

	function EmpTableContent() {
		if (!diffColor) diffColor = "red";
		const colorClassName = "text-red-500";
		return (
			<>
				<ScrollArea className="h-full overflow-y-auto border text-center">
					<Table>
						<TableHeader className="bg-secondary">
							<TableRow className="sticky top-0 bg-secondary hover:bg-secondary">
								<TableHead className="w-1/3 text-center">
									Key
								</TableHead>
								<TableHead className="w-1/3 text-center">
									Old Value
								</TableHead>
								<TableHead className="w-1/3 text-center">
									New Value
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{empData.map(
								(d: CombinedData, index: number) => {
									let diff = isDiff(d.key);
									return mode === "Changed" && !diff ? (
										<Fragment key={d.key}></Fragment>
									) : (
										<TableRow key={d.key}>
											<TableCell className="font-medium">
												{d.key}
											</TableCell>
											<TableCell
												className={`font-medium ${
													diff && colorClassName
												}`}
											>
												{displayData(
													d.db_value
												)}
											</TableCell>
											<TableCell
												className={`font-medium ${
													diff && colorClassName
												}`}
											>
												{displayData(d.ehr_value)}
											</TableCell>
										</TableRow>
									);
								}
							)}
						</TableBody>
						<TableFooter></TableFooter>
					</Table>
				</ScrollArea>
			</>
		);
	}

	return <EmpTableContent />;
}

const PageCheckEHR: NextPageWithLayout = () => {
	const getDiffDatas = api.employeeData.checkEmployeeData.useQuery({
		func: "",
	});
	const getDataLength = () => getDiffDatas.data!.length;

	const [checkedEmployees, setCheckedEmployees] = useState<Array<string>>([]);
	const [selectedEmployee, setSelectedEmployee] = useState("");
	const [diffColor, setDiffColor] = useState("red");
	const [mode, setMode] = useState("Changed");

	const getKeyFromData = (
		data: Array<CombinedData>,
		query: string,
		from?: string
	): any => {
		if(data === undefined)	return null;
		return !from
			? data.find((cd: CombinedData) => cd.key === query)?.db_value
			: data.find((cd: CombinedData) => cd.key === query)?.ehr_value;
	};

	if (getDiffDatas.isFetched) {
		if ((getDiffDatas.data ?? []).length > 0) {
			if (selectedEmployee === "") next(); // set Default
		}
	}

	function check(newCheckedEmp: string) {
		setCheckedEmployees((prevCheckedEmployees) => {
			if (prevCheckedEmployees.includes(newCheckedEmp))
				return prevCheckedEmployees;
			return [...prevCheckedEmployees, newCheckedEmp];
		});
	}

	const getEmpData = (emp_no: string) => {
		let IDX = -1;
		getDiffDatas.data!.map(
			(data: Array<CombinedData>, index: number) => {
				data.map((d: CombinedData) => {
					if(d.key === "emp_no" && d.db_value === emp_no)	IDX = index;
				})
			}
		);
		return getDiffDatas.data![IDX]!;
	};

	

	const getKeyData = (emp_no: string, query: string) => {
		return getKeyFromData(getEmpData(emp_no), query);
	};

	function next() {
		let nextEmpData = getDiffDatas.data!.filter(
			(data: Array<CombinedData>) =>
				!checkedEmployees.includes(
					data.find((cd: CombinedData) => {
						cd.key === "emp_no";
					})?.db_value
				) && getKeyFromData(data, "emp_no") !== selectedEmployee
		)[0]!;
		let nextEmp = getKeyFromData(nextEmpData, "emp_no");
		setSelectedEmployee(nextEmp);
	}

	const handleConfirmChange = () => {
		check(selectedEmployee);
		next();
	};

	const handleAllDone = () => {
		console.log("confirm");
	};

	function SelectedEmpDepartment({ emp_no }: EMP) {
		return <Label>部門：{getKeyData(emp_no, "department")}</Label>;
	}

	function SelectEmpComponent() {
		const [open, setOpen] = useState(false);

		function generateLongString(emp_no: string) {
			return (
				getKeyData(emp_no, "emp_no") + " " +
				getKeyData(emp_no, "emp_name") + " " +
				getKeyData(emp_no, "english_name")
			);
		}

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[200px] justify-between"
					>
						{selectedEmployee !== ""
							? generateLongString(selectedEmployee)
							: "Select an Employee..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command
						filter={(value, search) => {
							console.log(value);
							console.log(search);
							return value.toUpperCase().includes(search) ||
								value.toLowerCase().includes(search)
								? 1
								: 0;
						}}
					>
						<CommandInput placeholder="Search Employee..." />
						<CommandEmpty>No Employee found.</CommandEmpty>
						<CommandGroup>
							{getDiffDatas.data!.map(
								(d: Array<CombinedData>) => (
									<CommandItem
										key={getKeyFromData(d, "emp_no")}
										// value={d.old_data.emp_no}
										value={generateLongString(
											getKeyFromData(d, "emp_no")
										)}
										onSelect={(currentValue) => {
											console.log(
												currentValue.split(" ")
											);
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
												selectedEmployee ===
													getKeyFromData(d, "emp_no")
													? "opacity-100"
													: "opacity-0"
											)}
										/>
										{
											<div
												className={`flex items-center ${
													!checkedEmployees.includes(
														getKeyFromData(d,"emp_no")
													)
														? "text-red-400"
														: ""
												}`}
											>
												<b className="mr-1">
													{getKeyFromData(d,"emp_no")}
												</b>
												<p className="mr-1">
													{getKeyFromData(d,"emp_name") + " " +
													getKeyFromData(d,"english_name") + " "}
												</p>
											</div>
										}
									</CommandItem>
								)
							)}
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		);
	}

	function isFinished() {
		return (
			(checkedEmployees.length == getDataLength() - 1 &&
				!checkedEmployees.includes(selectedEmployee)) ||
			checkedEmployees.length == getDataLength()
		);
	}

	function FetchingPage() {
		return <p>Fetching Data</p>;
	}

	function AllDonePage() {
		return <p>System Data is updated with EHR</p>;
	}

	function MainPage() {
		console.log(getEmpData(selectedEmployee))
		return (
			<>
				<div className="flex h-full flex-grow flex-col">
					<Header title="Data Check" />
					<Separator />
					<div className="min-h-0 grow p-4">
						<div className="mb-4 flex min-h-0 items-center">
							<SelectEmpComponent />
							<div className="ml-4">
								<SelectedEmpDepartment
									emp_no={selectedEmployee}
								/>
							</div>
							<div className="ml-auto">
							</div>
							<div className="ml-2">
								<SelectModeComponent
									mode={mode}
									setMode={setMode}
								/>
							</div>
						</div>

						<div className="h-[60vh] min-h-0 w-full flex-grow">
							<EmployeeDataChange
								empData = {getEmpData(selectedEmployee)}
								mode={mode}
								diffColor={diffColor}
							/>
						</div>

						<div className="mt-4 flex justify-end">
							{!isFinished() && (
								<Button
									key="ConfirmButton"
									onClick={() => handleConfirmChange()}
								>
									{"Confirm Change"}
								</Button>
							)}

							{isFinished() && (
								<AllDoneDialog
									confirmFunction={() => handleAllDone()}
								/>
							)}
						</div>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			{!getDiffDatas.isFetched ? (
				<FetchingPage />
			) : (getDiffDatas.data ?? []).length == 0 ? (
				<AllDonePage />
			) : (
				<MainPage />
			)}
		</>
	);
};

PageCheckEHR.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="check">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageCheckEHR;
