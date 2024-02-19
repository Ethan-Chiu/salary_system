import React from "react";
import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	CustomTableRow,
	CustomTableCell,
} from "~/components/ui/table";

import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

import { Checkbox } from "~/components/ui/checkbox";
import { CombinedData } from "~/server/service/employee_data_service";
import { displayData } from "../utils/display";
import { DialogClose } from "@radix-ui/react-dialog";

export interface Status {
	[key: string]: "initial" | "checked" | "ignored";
}

export interface DifferentKeys {
	emp_no: string;
	emp_name: string;
	diffKeys: Array<CombinedData>;
}

interface UpdateTableDialogProps {
	data: DifferentKeys[];
	status: Status;
	updateFunction: () => void;
}

interface UpdateTableProps {
	data: DifferentKeys[];
	status: Status;
	showDetails: boolean;
}

export function UpdateTableDialog({
	data,
	status,
	updateFunction,
}: UpdateTableDialogProps) {
	const [showDetails, setShowDetails] = useState<boolean>(true);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button onClick={updateFunction}>Update</Button>
			</DialogTrigger>
			<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[60%]">
				<DialogHeader className="flex items-center">
					<div className="mr-auto">
						<DialogTitle>Changed Data</DialogTitle>
						<DialogDescription>
							Check the checked data and press the update button to confirm the changes.
						</DialogDescription>
					</div>
					<div className="ml-auto flex items-center space-x-2">
						<Switch id="showDetails" checked={showDetails} onCheckedChange={setShowDetails}/>
						<Label htmlFor="showDetails">Show Details</Label>
					</div>
				</DialogHeader>
				<UpdateTable data={data} status={status} showDetails={showDetails} />
			</DialogContent>
		</Dialog>
	);
}

export function UpdateTable({ data, status, showDetails }: UpdateTableProps) {
	const [toUpdate, setToUpdate] = useState({});
	const initialCheckedData: Record<string, boolean> = {};
	const [checkedData, setCheckedData] = useState<Record<string, boolean>>(initialCheckedData);


	useEffect(() => {
		let tmpDir: any = {};
		data.map((d: DifferentKeys) => {
			tmpDir[d.emp_no] = (status[d.emp_no] == "checked");
		});
		setCheckedData(tmpDir);
	}, []);

	function checkEmp(emp_no: string) {
		return function(b: boolean) {
		  setCheckedData(prevState => {
			return {
			  ...prevState,
			  [emp_no]: b
			};
		  });
		}
	}

	function AllClick() {
		const AllClicked = Object.values(checkedData).every(value => value === true);
		let tmpDir: any = {};
		data.map((d: DifferentKeys) => {
			tmpDir[d.emp_no] = (AllClicked)?false:true;
		});
		setCheckedData(tmpDir);
	}

	function updateFunction() {
		console.log(checkedData);
	}

	return (
		<>
			<Table className="border">
				<TableHeader>
					<TableRow className="border">
						<TableHead className="w-[50px] border text-center">
							<Button variant={"ghost"} onClick={AllClick}>
								All (un)Click
							</Button>
						</TableHead>
						<TableHead className="border text-center">
							Emp Number
						</TableHead>
						<TableHead className="border text-center">
							Emp Name
						</TableHead>
						{showDetails && (
							<>
								<TableHead className="border text-center">
									Key
								</TableHead>
								<TableHead className="border text-center">
									Local Value
								</TableHead>
								<TableHead className="border text-center">
									eHR Value
								</TableHead>
							</>
						)}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={6}
								className="border text-center"
							>
								No Result
							</TableCell>
						</TableRow>
					)}
					{data.map((d: DifferentKeys) => {
						console.log(d);
						return (
							<>
								<CustomTableRow>
									<CustomTableCell
										rowSpan={d.diffKeys.length + 1}
										className="border text-center"
									>
										<Checkbox
											checked = {checkedData[d.emp_no]}
											onCheckedChange={checkEmp(d.emp_no)}
											className="mr-5"
										/>
									</CustomTableCell>
									<CustomTableCell
										rowSpan={d.diffKeys.length + 1}
										className="border text-center"
									>
										{d.emp_no}
									</CustomTableCell>
									<CustomTableCell
										rowSpan={d.diffKeys.length + 1}
										className="border text-center"
									>
										{d.emp_name}
									</CustomTableCell>

									{showDetails && (
										<>
											<CustomTableCell className="border text-center">
												{displayData(
													d.diffKeys[0]!.key
												)}
											</CustomTableCell>
											<CustomTableCell className="border text-center">
												{displayData(
													d.diffKeys[0]!.db_value
												)}
											</CustomTableCell>
											<CustomTableCell className="border text-center">
												{displayData(
													d.diffKeys[0]!.ehr_value
												)}
											</CustomTableCell>
										</>
									)}
								</CustomTableRow>
								{d.diffKeys.map(
									(cd: CombinedData, index: number) => {
										return (
											<>
												{index === 0 ? (
													<CustomTableRow></CustomTableRow>
												) : (
													<>
														<CustomTableRow>
															{showDetails && (
																<>
																	<CustomTableCell className="border text-center">
																		{displayData(
																			cd.key
																		)}
																	</CustomTableCell>
																	<CustomTableCell className="border text-center">
																		{displayData(
																			cd.db_value
																		)}
																	</CustomTableCell>
																	<CustomTableCell className="border text-center">
																		{displayData(
																			cd.ehr_value
																		)}
																	</CustomTableCell>
																</>
															)}
														</CustomTableRow>
													</>
												)}
											</>
										);
									}
								)}
							</>
						);
					})}
				</TableBody>
			</Table>
			<DialogClose>
					<Button type="submit" onClick={updateFunction}>Update</Button>
			</DialogClose>
		</>
	);
}
