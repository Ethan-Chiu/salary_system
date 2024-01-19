import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../_app";
import { useContext, type ReactElement, useState, useEffect } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";

import { Button } from "~/components/ui/button";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

import { ScrollArea } from "~/components/ui/scroll-area";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { Header } from "~/components/header";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DataTableDataHeader } from "~/components/data_table/data_table_data_header";

interface KVString {
	[key: string]: string;
}

const previousTableData: KVString = {
	"1": "Item 1",
	"2": "Item 2",
	"3": "Item 3",
	"4": "Item 4",
	"5": "Item 5",
	"6": "Item 6",
	"7": "Item 7",
	"8": "Item 8",
	"9": "Item 9",
	"10": "Item 10",
	"11": "Item 11",
	"12": "Item 12",
	"13": "Item 13",
	"14": "Item 14",
	"15": "Item 15",
	"16": "Item 16",
	"17": "Item 17",
	"18": "Item 18",
	"19": "Item 19",
	"20": "Item 20",
};

const newTableData: KVString = {
	"1": "Item 1",
	"2": "Item 2",
	"3": "Item 3",
	"4": "Item 4",
	"5": "Item 5",
	"6": "Item 6",
	"7": "Item 7",
	"8": "Item 8",
	"9": "Item 9",
	"10": "Item 10",
	"11": "Item 11",
	"12": "Item 12",
	"13": "Item 16",
	"14": "Item 14",
	"15": "Item 15",
	"16": "Item 16",
	"17": "Item 17",
	"18": "Item 18",
	"19": "Item 19",
	"20": "Item 20",
};

function EmployeeDataChange({ previousTableData, newTableData, mode }: any) {
	const getDiffKeys = () => {
		let diffkeys: Array<string> = [];
		Object.keys(previousTableData).map((key: string) => {
			if (previousTableData[key] !== newTableData[key])
				diffkeys.push(key);
		});
		return diffkeys;
	};

	const createTable = () => {
		return (
			<>
				<ScrollArea className="overflow-y-auto h-full text-center border">
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
								(key: string) => {
									let diff = getDiffKeys().includes(key);
									return (
										(mode==="Changed"&&!diff)?<></>:<TableRow key={key}>
											<TableCell className="font-medium">
												{key}
											</TableCell>
											<TableCell
												className={`font-medium ${
													diff && "text-red-500"
												}`}
											>
												{previousTableData[key]}
											</TableCell>
											<TableCell
												className={`font-medium ${
													diff && "text-red-500"
												}`}
											>
												{newTableData[key]}
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
	};

	return <>{createTable()}</>;
}

const PageCheckEHR: NextPageWithLayout = () => {
	const changedEmployees = ["A", "B", "C", "D"]; // 員工編號 中文 英文 部門
	const [checkedEmployees, setCheckedEmployees] = useState<Array<string>>([]);
	const [selectedEmployee, setSelectEmployee] = useState("");
	const [finish, setFinish] = useState(false);
	const [mode, setMode] = useState("Changed");

	useEffect(() => next(), []);

	function check(newCheckedEmp: string) {
		if (checkedEmployees.includes(newCheckedEmp)) return;
		let newCheck: Array<string> = checkedEmployees;
		newCheck.push(newCheckedEmp);
		setCheckedEmployees(newCheck);
	}

	function next() {
		if (checkedEmployees.length === changedEmployees.length) {
			setFinish(true);
		} else {
			let nextEmp = changedEmployees.filter(
				(emp) => !checkedEmployees.includes(emp)
			)[0]!;
			setSelectEmployee(nextEmp);
		}
	}

	const handleConfirmChange = () => {
		check(selectedEmployee);
		next();
	};

	return (
		<>
			<div className="flex h-full flex-grow flex-col">
				<Header title="Data Check" />
				<Separator />
				<div className="min-h-0 grow p-4">
					<div className="mb-4 flex min-h-0 items-center">
						<Select
							value={selectedEmployee}
							onValueChange={(v) => {
								setSelectEmployee(v);
							}}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select an employee" />
							</SelectTrigger>
							<SelectContent>
								{changedEmployees.map((emp_no) => {
									if (checkedEmployees.includes(emp_no))
										return (
											<SelectItem
												value={emp_no}
												key={emp_no}
											>
												{emp_no}
											</SelectItem>
										);
									else
										return (
											<SelectItem
												value={emp_no}
												className="text-red-400 focus:text-red-400"
												key={emp_no}
											>
												{emp_no}
											</SelectItem>
										);
								})}
							</SelectContent>
						</Select>

						<div className="m-4">
							<Label>英文姓名</Label>
						</div>

						<div>
							<Label>部門</Label>
						</div>
						<div className="ml-auto">
							<Select
								value={mode}
								onValueChange={(v) => {
									setMode(v);
									console.log(mode)
								}}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select an employee" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Changed">
										Only Changed
									</SelectItem>
									<SelectItem value="All">
										Display All
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="min-h-0 w-full h-[55vh] flex-grow">
						<EmployeeDataChange
							previousTableData={previousTableData}
							newTableData={newTableData}
							mode={mode}
						/>
					</div>
					<Button
						className="mt-4"
						key="Confirm"
						onClick={() => handleConfirmChange()}
					>
						Confirm Change
					</Button>
				</div>
			</div>
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
