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

import { Checkbox } from "~/components/ui/checkbox";
import { CombinedData } from "~/server/service/employee_data_service";
import { displayData } from "../utils/display";
import { DialogClose } from "@radix-ui/react-dialog";

export interface DifferentKeys {
	emp_no: string;
	emp_name: string;
	diffKeys: Array<CombinedData>;
}

interface UpdateTableDialogProps {
    data: DifferentKeys[];
    updateFunction: () => void;
}

interface UpdateTableProps {
	data: DifferentKeys[];
	showDetails: boolean;
}

export function UpdateTableDialog({ data, updateFunction }: UpdateTableDialogProps) {
	const [showDetails, setShowDetails] = useState<boolean>(true);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button onClick={updateFunction}>
                    Update
                </Button>
			</DialogTrigger>
			<DialogContent  className="max-h-screen overflow-y-scroll sm:max-w-[70%]">
				<DialogHeader>
					<DialogTitle>Title</DialogTitle>
					<DialogDescription>
						Description
					</DialogDescription>
				</DialogHeader>
				<Button variant={"ghost"} onClick={() => setShowDetails(!showDetails)}>Options</Button>
				<UpdateTable data={data} showDetails={showDetails}/>
				<DialogClose>
					<Button type="submit">Update</Button>
                </DialogClose>
			</DialogContent>
		</Dialog>
	);
}

export function UpdateTable({ data, showDetails }: UpdateTableProps) {
	const [toUpdate, setToUpdate] = useState({});

	useEffect(() => {
		let tmpDir: any = {};
		data.map((d: DifferentKeys) => {
			tmpDir[d.emp_name] = false;
		})
	}, []);

	return (
		<>
			<Table className="border">
				{/* <TableCaption></TableCaption> */}
				<TableHeader>
					<TableRow className="border">
						<TableHead className="w-[50px] border text-center">
							Update
						</TableHead>
						<TableHead className="border text-center">
							Emp Number
						</TableHead>
						<TableHead className="border text-center">
							Emp Name
						</TableHead>
						{(showDetails)&&<>
						<TableHead className="border text-center">
							Key
						</TableHead>
						<TableHead className="border text-center">
							Local Value
						</TableHead>
						<TableHead className="border text-center">
							eHR Value
						</TableHead>
						</>}
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
										<Checkbox onCheckedChange={(c) => console.log(c)} className="mr-5" />
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

									{showDetails&&<><CustomTableCell className="border text-center">
										{displayData(d.diffKeys[0]!.key)}
									</CustomTableCell>
									<CustomTableCell className="border text-center">
										{displayData(d.diffKeys[0]!.db_value)}
									</CustomTableCell>
									<CustomTableCell className="border text-center">
										{displayData(d.diffKeys[0]!.ehr_value)}
									</CustomTableCell></>}
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
														{showDetails&&<><CustomTableCell className="border text-center">
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
															</CustomTableCell></>}
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
		</>
	);
}
