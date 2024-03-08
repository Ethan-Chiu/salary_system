import { type NextPageWithLayout } from "../_app";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { type ReactElement, useState, useEffect } from "react";
import { api } from "~/utils/api";
import { CombinedData } from "~/server/service/employee_data_service";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Header } from "~/components/header";
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
import { SelectModeComponent } from "./components/Selects";
import { AllDoneDialog } from "./components/AllDoneDialog";
import {
	DifferentKeys,
	Status,
	UpdateTable,
	UpdateTableDialog,
} from "./components/UpdateTable";
import { EmployeeDataChange } from "./components/EmpDataTable";
import { ScrollArea } from "~/components/ui/scroll-area";


const PageCheckEHR: NextPageWithLayout = () => {
	return <SyncPage period={113}/>
};

function SyncPage({period}: {period: number}) {
	const getDiffDatas = api.sync.checkEmployeeData.useQuery({
		func: "month_salary",
		period: period
	});
	const synchronizeAPI = api.sync.synchronize.useMutation({
		onSuccess: () => {
			console.log("Call synchronize API");
		},
	});

	const [selectedEmployee, setSelectedEmployee] = useState("");
	const [diffColor, setDiffColor] = useState("red");
	const [mode, setMode] = useState("Changed");

	const getKeyFromData = (
		data: Array<CombinedData>,
		query: string,
		from?: undefined | "ehr"
	): any => {
		if (data === undefined) return null;
		return !from
			? data.find((cd: CombinedData) => cd.key === query)?.salary_value
			: data.find((cd: CombinedData) => cd.key === query)?.ehr_value;
	};

	
	const [empStatus, setEmpStatus] = useState<Status>({});
	if (getDiffDatas.isFetched && Object.keys(empStatus).length === 0 && (getDiffDatas.data ?? []).length>0) {
		let tmp: any = {};
		getDiffDatas.data?.map((cd: Array<CombinedData>) => {
			tmp[getKeyFromData(cd, "emp_no", "ehr")] = "initial";
		});
		setEmpStatus(tmp);
	}

	if (getDiffDatas.isFetched && empStatus !== null) {
		if ((getDiffDatas.data ?? []).length > 0) {
			if (selectedEmployee === "") next(); // set Default
		}
	}

	function check(newCheckedEmp: string) {
		let tmp = empStatus;
		tmp[newCheckedEmp] = "checked";
		setEmpStatus(tmp);
	}

	function ignore(newIgnoredEmp: string) {
		let tmp = empStatus;
		tmp[newIgnoredEmp] = "ignored";
		setEmpStatus(tmp);
	}

	const getEmpData = (emp_no: string) => {
		let IDX = -1;
		getDiffDatas.data!.map((data: Array<CombinedData>, index: number) => {
			data.map((d: CombinedData) => {
				if (d.key === "emp_no" && d.ehr_value === emp_no) IDX = index;
			});
		});
		return getDiffDatas.data![IDX]!;
	};

	const getKeyData = (emp_no: string, query: string) => {
		let query_empData = getEmpData(emp_no);
		let query_result = getKeyFromData(query_empData, query) ?? getKeyFromData(query_empData, query, "ehr");
		return query_result;
	};

	function getChangedDatas() {
		let checkedData = Object.keys(empStatus)
			// .filter((key: string) => empStatus[key] === "checked")
			.map((emp_no: string) => {
				return getEmpData(emp_no);
			});
		console.log(checkedData);
		console.log(empStatus);
		console.log(getDiffDatas.data);
		let filterData: Array<DifferentKeys> = checkedData.map(
			(data: Array<CombinedData>) => {
				let newConstructedData: DifferentKeys = {
					emp_no: getKeyFromData(data, "emp_no", "ehr"),
					emp_name: getKeyFromData(data, "emp_name") ?? getKeyFromData(data, "emp_name", "ehr"),
					diffKeys: data.filter(
						(cd: CombinedData) => cd.is_different === true
					),
				};
				return newConstructedData;
			}
		);

		return filterData;
	}

	function next() {
		let notSeenDatas = getDiffDatas.data!.filter(
			(data: Array<CombinedData>) =>
				empStatus[getKeyFromData(data, "emp_no", "ehr")] === "initial" &&
				getKeyFromData(data, "emp_no", "ehr") !== selectedEmployee
		);
		let nextEmp =
			notSeenDatas.length > 0
				? getKeyFromData(notSeenDatas[0]!, "emp_no", "ehr")
				: selectedEmployee;
		console.log(nextEmp)
		setSelectedEmployee(nextEmp);
	}

	const handleConfirm = () => {
		check(selectedEmployee);
		next();
	};

	const handleIgnore = () => {
		ignore(selectedEmployee);
		next();
	};

	const handleUpdate = (updateList: string[]) => {
		synchronizeAPI.mutate({
			period: period,
			emp_nos: updateList
		});
	}

	function SelectedEmpDepartment({ emp_no }: { emp_no: string }) {
		return <Label>部門：{getKeyData(emp_no, "u_dep")}</Label>;
	}

	function SelectEmpComponent() {
		const [open, setOpen] = useState(false);

		function generateLongString(emp_no: string) {
			return (
				getKeyData(emp_no, "emp_no") +
				" " +
				getKeyData(emp_no, "emp_name") +
				" " +
				getKeyData(emp_no, "english_name")
			);
		}

		function SelectListEmp({ d }: { d: Array<CombinedData> }) {
			let emp_no = getKeyFromData(d, "emp_no") ?? getKeyFromData(d, "emp_no", "ehr");
			let emp_name = getKeyFromData(d, "emp_name") ?? getKeyFromData(d, "emp_name", "ehr");
			let english_name = getKeyFromData(d, "english_name") ?? getKeyFromData(d, "english_name", "ehr");
			return (
				<>
					<b className="mr-1">{emp_no}</b>
					<p className="mr-1">
						{
							emp_name +
							" " +
							english_name +
							" " + (isInitial(d)?"(尚未確認)":isIgnored(d)?"(暫不修改)":isChecked(d)?"(確認更改)":"(未知狀態)")
						}
					</p>
				</>
			);
		}

		function getStatus(d: Array<CombinedData>) {
			return empStatus[getKeyFromData(d, "emp_no") ?? getKeyFromData(d, "emp_no", "ehr")];
		}

		function isInitial(d: Array<CombinedData>) {
			return getStatus(d) === "initial";
		}

		function isIgnored(d: Array<CombinedData>) {
			return getStatus(d) === "ignored";
		}

		function isChecked(d: Array<CombinedData>) {
			return getStatus(d) === "checked";
		}

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[350px] justify-between"
					>
						{selectedEmployee !== ""
							? generateLongString(selectedEmployee)
							: "Select an Employee..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[350px] p-0">
					<Command
						filter={(value, search) => {
							return value.toUpperCase().includes(search) ||
								value.toLowerCase().includes(search)
								? 1
								: 0;
						}}
					>
						<CommandInput placeholder="Search Employee..." />
						<ScrollArea className="h-[50vh]">
						<CommandEmpty>No Employee found.</CommandEmpty>
						<CommandGroup>
							{getDiffDatas.data!.map(
								(d: Array<CombinedData>) => (
									<CommandItem
										key={getKeyFromData(d, "emp_no") ?? getKeyFromData(d, "emp_no", "ehr")}
										value={generateLongString(
											getKeyFromData(d, "emp_no") ?? getKeyFromData(d, "emp_no", "ehr")
										)}
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
												selectedEmployee ===
													getKeyFromData(d, "emp_no")
													? "opacity-100"
													: "opacity-0"
											)}
										/>
										{
											<div
												className={`flex items-center ${
													isInitial(d)
														? "text-red-400"
														: isIgnored(d)
														? ""
														: "text-green-400"
												}`}
											>
												<SelectListEmp d={d} />
											</div>
										}
									</CommandItem>
								)
							)}
						</CommandGroup>
						</ScrollArea>
					</Command>				
				</PopoverContent>
			</Popover>
		);
	}

	function FetchingPage() {
		return <p>Fetching Data</p>;
	}

	function AllDonePage() {
		function ImageComponent() {
			const imageUrl = 'https://memeprod.sgp1.digitaloceanspaces.com/user-template/b3a4babd59ebb46530a7f7cca856d848.png';
		  
			return (
			  <div>
				<img src={imageUrl} alt="Description of the image" />
			  </div>
			);
		}
		return <>
			<p>System Data is updated with EHR</p>
			<ImageComponent/>
		</>;
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
							<div className="ml-auto"></div>
							<div className="ml-2">
								<SelectModeComponent
									mode={mode}
									setMode={setMode}
								/>
							</div>
						</div>

						<div className="h-[60vh] min-h-0 w-full flex-grow">
							<EmployeeDataChange
								empData={getEmpData(selectedEmployee)}
								mode={mode}
								diffColor={diffColor}
							/>
						</div>

						<div className="mt-2 flex items-center justify-between">
							<UpdateTableDialog
								data={getChangedDatas()}
								status={empStatus}
								updateFunction={handleUpdate}
							/>

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
						{/* <Button onClick={() => console.log(empStatus)}></Button> */}
					</div>
				</div>
			</>
		);
	}

	return (
		<>
		<></>
			{!getDiffDatas.isFetched ? (
				<FetchingPage />
			) : (getDiffDatas.data ?? []).length == 0 ? (
				<AllDonePage />
			) : (
				<>
					<MainPage />
				</>
			)}
		</>
	);
	// return <Button onClick = {() => console.log(getDiffDatas.data)}> test </Button>
}

PageCheckEHR.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="check">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageCheckEHR;
