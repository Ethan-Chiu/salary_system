import React from "react";
import { useState } from "react";
import {
	Table,
	TableBody,
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
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

import { Checkbox } from "~/components/ui/checkbox";
import { displayData } from "../utils/display";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type DataComparison } from "~/server/service/sync_service";

export type SyncCheckStatus = "initial" | "checked" | "ignored";

export interface SyncDataAndStatus {
	emp_no: string;
	emp_name: string;
	check_status: SyncCheckStatus;
	comparisons: Array<DataComparison>;
}

interface UpdateTableDialogProps {
	data: SyncDataAndStatus[];
}

interface UpdateTableProps {
	data: SyncDataAndStatus[];
	showDetails: boolean;
}

export function UpdateTableDialog({ data }: UpdateTableDialogProps) {
	const [showDetails, setShowDetails] = useState<boolean>(true);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						console.log("Show update table dialog");
					}}
				>
					Update
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[60%]">
				<DialogHeader className="flex items-center">
					<div className="mr-auto">
						<DialogTitle>Changed Data</DialogTitle>
						<DialogDescription>
							Check the checked data and press the update button
							to confirm the changes.
						</DialogDescription>
					</div>
					<div className="ml-auto flex items-center space-x-2">
						<Switch
							id="showDetails"
							checked={showDetails}
							onCheckedChange={setShowDetails}
						/>
						<Label htmlFor="showDetails">Show Details</Label>
					</div>
				</DialogHeader>
				<UpdateTable data={data} showDetails={showDetails} />
			</DialogContent>
		</Dialog>
	);
}

export function UpdateTable({ data, showDetails }: UpdateTableProps) {
	const router = useRouter();

	const { mutate } = api.sync.synchronize.useMutation({
		onSuccess: () => {
			console.log("Call synchronize API");

			alert("Call API success! Reloading the page");
			router.reload();
		},
	});

	const checked: Record<string, boolean> = {};
	data.forEach((d: SyncDataAndStatus) => {
		checked[d.emp_no] = d.check_status === "checked";
	});

	const [checkedEmps, setCheckedEmps] =
		useState<Record<string, boolean>>(checked);

	function check(empNo: string) {
		setCheckedEmps((checkedEmps) => ({
			...checkedEmps,
			[empNo]: !checkedEmps[empNo],
		}));
	}

	function checkAll() {
		const allChecked: boolean = Object.values(checkedEmps).every((v) => v);
		setCheckedEmps((checkedEmps) => {
			for (const key in checkedEmps) {
				checkedEmps[key] = !allChecked;
			}
			return checkedEmps;
		});
	}

	function handleUpdate() {
		const updateList: Array<string> = [];

    for (const key in checkedEmps) {
      if (checkedEmps[key]) {
        updateList.push(key);
      }
    }

		mutate({
			period: 113,
			emp_no_list: updateList,
		});
	}

	return (
		<>
			<Table className="border">
				<TableHeader>
					<TableRow className="border">
						<TableHead className="w-[50px] border text-center">
							<Button variant={"ghost"} onClick={checkAll}>
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
					{data.map((d: SyncDataAndStatus) => {
						console.log(d);
						const comparisons = d.comparisons;
						return (
							<>
								<CustomTableRow>
									<CustomTableCell
										rowSpan={comparisons.length + 1}
										className="border text-center"
									>
										<Checkbox
											checked={checkedEmps[d.emp_no]}
											onCheckedChange={() => {
												check(d.emp_no);
											}}
											className="mr-5"
										/>
									</CustomTableCell>
									<CustomTableCell
										rowSpan={comparisons.length + 1}
										className="border text-center"
									>
										{d.emp_no}
									</CustomTableCell>
									<CustomTableCell
										rowSpan={comparisons.length + 1}
										className="border text-center"
									>
										{d.emp_name}
									</CustomTableCell>

									{showDetails && (
										<>
											<CustomTableCell className="border text-center">
												{displayData(
													comparisons[0]!.key
												)}
											</CustomTableCell>
											<CustomTableCell className="border text-center">
												{displayData(
													comparisons[0]!.salary_value
												)}
											</CustomTableCell>
											<CustomTableCell className="border text-center">
												{displayData(
													comparisons[0]!.ehr_value
												)}
											</CustomTableCell>
										</>
									)}
								</CustomTableRow>
								{comparisons.map(
									(cd: DataComparison, index: number) => {
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
																			cd.salary_value
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
				<Button type="submit" onClick={handleUpdate}>
					Update
				</Button>
			</DialogClose>
		</>
	);
}
