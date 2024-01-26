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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { displayData } from "./utils/display";


interface EMP {
	emp_no: string;
}


function EmployeeDataChange({
	previousTableData,
	newTableData,
	mode,
	diffColor,
}: any) {
	const [diffKeys, setDiffKeys] = useState<string[]>([]);
	useEffect(() => {
		let dk: Array<string> = [];
		Object.keys(previousTableData).map((key: string) => {
			if (previousTableData[key] !== newTableData[key]) dk.push(key);
		});
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
							{Object.keys(previousTableData).map(
								(key: string, index: number) => {
									let diff = isDiff(key);
									return mode === "Changed" && !diff ? (
										<Fragment key={key}></Fragment>
									) : (
										<TableRow key={key}>
											<TableCell className="font-medium">
												{key}
											</TableCell>
											<TableCell
												className={`font-medium ${
													diff && colorClassName
												}`}
											>
												{displayData(
													previousTableData[key]
												)}
											</TableCell>
											<TableCell
												className={`font-medium ${
													diff && colorClassName
												}`}
											>
												{displayData(newTableData[key])}
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

	const [checkedEmployees, setCheckedEmployees] = useState<Array<string>>([]);
	const [selectedEmployee, setSelectEmployee] = useState("");
	const [diffColor, setDiffColor] = useState("red");
	const [finish, setFinish] = useState(false);
	const [mode, setMode] = useState("Changed");

	if (getDiffDatas.isFetched) {
		if ((getDiffDatas.data ?? []).length > 0 && selectedEmployee === "")
			next();
		else if (!finish) setFinish(true);
	}

	function check(newCheckedEmp: string) {
		setCheckedEmployees((prevCheckedEmployees) => {
			if (prevCheckedEmployees.includes(newCheckedEmp))
				return prevCheckedEmployees;
			return [...prevCheckedEmployees, newCheckedEmp];
		});
	}

	function next() {
		if (checkedEmployees.length >= getDiffDatas.data!.length - 1) {
			setFinish(true);
		} else {
			let nextEmp = getDiffDatas.data!.filter(
				(data: any) =>
					!checkedEmployees.includes(data["old_data"].emp_no) &&
					data.old_data.emp_no !== selectedEmployee
			)[0]!.old_data.emp_no;
			setSelectEmployee(nextEmp);
		}
	}

	const handleConfirmChange = () => {
		check(selectedEmployee);
		next();
	};

	const getOldDatas = () => getDiffDatas.data!.map((d) => d.old_data);
	const getNewDatas = () => getDiffDatas.data!.map((d) => d.ehr_data);

	const getEmpData = (emp_no: string) =>
		getDiffDatas.data!.find((d) => d.old_data.emp_no === emp_no);

	function SelectedEmpEnName({ emp_no }: EMP) {
		return (
			<Label>英文姓名：{getEmpData(emp_no)?.old_data.english_name}</Label>
		);
	}
	function SelectedEmpDepartment({ emp_no }: EMP) {
		return <Label>部門：{getEmpData(emp_no)?.old_data.department}</Label>;
	}
	function SelectModeComponent() {
		return (
			<>
				<Select value={mode} onValueChange={setMode}>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Changed">Only Changed</SelectItem>
						<SelectItem value="All">Display All</SelectItem>
					</SelectContent>
				</Select>
			</>
		);
	}
	function SelectEmpComponent() {
		return (
			<>
				<Select
					value={selectedEmployee}
					onValueChange={setSelectEmployee}
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Select an employee" />
					</SelectTrigger>
					<SelectContent>
						{getDiffDatas.data!.map((data) => {
							let emp_no = data.old_data.emp_no;
							let emp_name = data.old_data.emp_name;
							let en_name = data.old_data.english_name;
							let department = data.old_data.department;
							if (checkedEmployees.includes(emp_no))
								return (
									<SelectItem value={emp_no} key={emp_no}>
										<div className="flex items-center">
											<b className="mr-1">{emp_no}</b>
											{/* <p className="mr-1">{department}</p> */}
											<p className="mr-1">
												{emp_name + "(" + en_name + ")"}
											</p>
										</div>
									</SelectItem>
								);
							else
								return (
									<SelectItem
										value={emp_no}
										className="text-red-400 focus:text-red-400"
										key={emp_no}
									>
										<div className="flex items-center">
											<b className="mr-1">{emp_no}</b>
											{/* <p className="mr-1">{department}</p> */}
											<p className="mr-1">
												{emp_name + "(" + en_name + ")"}
											</p>
										</div>
									</SelectItem>
								);
						})}
					</SelectContent>
				</Select>
			</>
		);
	}

	const SelectColorComponent = () => {
		return (
			<>
				<Select value={diffColor} onValueChange={setDiffColor}>
					<SelectPrimitive.Trigger
						className={
							"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						}
					>
						<Paintbrush
							strokeWidth={1.5}
							className="cursor-pointer"
						/>
					</SelectPrimitive.Trigger>
					<SelectContent>
						<SelectItem value="red">Red</SelectItem>
						<SelectItem value="blue">Blue</SelectItem>
						<SelectItem value="purple">Purple</SelectItem>
					</SelectContent>
				</Select>
			</>
		);
	};

	function FetchingPage() {
		return <p>Fetching Data</p>
	}

	function AllDonePage() {
		return <p>System Data is updated with EHR</p>
	}

	function MainPage() {
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
									<SelectColorComponent />
								</div>
								<div className="ml-2">
									<SelectModeComponent />
								</div>
							</div>

							<div className="h-[60vh] min-h-0 w-full flex-grow">
								<EmployeeDataChange
									previousTableData={
										getEmpData(selectedEmployee)?.old_data
									}
									newTableData={
										getEmpData(selectedEmployee)?.ehr_data
									}
									mode={mode}
									diffColor={diffColor}
								/>
							</div>

							<div className="mt-4 flex justify-end">
								<Button
									key="Confirm"
									onClick={() => handleConfirmChange()}
								>
									Confirm Change
								</Button>
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
