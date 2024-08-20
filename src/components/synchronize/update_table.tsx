import React, { Fragment, useContext, useEffect } from "react";
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
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

import { Checkbox } from "~/components/ui/checkbox";
import { displayData } from "~/components/synchronize/utils/display";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type DataComparison } from "~/server/service/sync_service";
import { type SyncCheckStatusEnumType } from "~/components/synchronize/utils/sync_check_status";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import periodContext from "../context/period_context";
import { useTranslation } from "react-i18next";

export interface SyncDataAndStatus {
	emp_no: string;
	emp_name: string;
	check_status: SyncCheckStatusEnumType;
	comparisons: Array<DataComparison>;
}

interface UpdateTableDialogProps {
	data: SyncDataAndStatus[];
}

interface UpdateTableProps {
	data: SyncDataAndStatus[];
	showDetails: boolean;
	checkedEmps: Record<string, boolean>;
	setCheckedEmps: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
}

export function UpdateTableDialog({ data }: UpdateTableDialogProps) {
	const [showDetails, setShowDetails] = useState<boolean>(true);
	const [checkedEmps, setCheckedEmps] = useState<Record<string, boolean>>({});
	const { selectedPeriod } = useContext(periodContext);

	const { t } = useTranslation(["common"]);

	useEffect(() => {
		const checked: Record<string, boolean> = {};
		data.forEach((d: SyncDataAndStatus) => {
			checked[d.emp_no] = d.check_status === "checked";
		});
		setCheckedEmps(checked);
	}, [data]);

	const router = useRouter();

	const { mutate } = api.sync.synchronize.useMutation({
		onSuccess: () => {
			router.reload();
		},
	});

	function handleUpdate(period_id: number) {
		const updateList: Array<string> = [];

		for (const key in checkedEmps) {
			if (checkedEmps[key]) {
				updateList.push(key);
			}
		}

		mutate({
			period: period_id,
			emp_no_list: updateList,
		});
	}

	if (selectedPeriod == null) {
		return <p>{t("others.select_period")}</p>;
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						console.log("Show update table dialog");
					}}
				>
					{t("button.update")}
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[90vw] max-w-5xl p-8">
				<DialogHeader className="mx-4 flex items-center">
					<div className="mr-auto">
						<DialogTitle>{t("others.changed_data")}</DialogTitle>
						<DialogDescription>
							{t("others.changed_data_msg")}
						</DialogDescription>
					</div>
					<div className="ml-auto flex items-center space-x-2">
						<Switch
							id="showDetails"
							checked={showDetails}
							onCheckedChange={setShowDetails}
						/>
						<Label htmlFor="showDetails">
							{t("others.show_details")}
						</Label>
					</div>
				</DialogHeader>
				{/* <ScrollArea className="max-h-[70vh] overflow-y-scroll"> */}
				<ScrollArea className="max-h-[70vh]">
					<UpdateTable
						data={data}
						showDetails={showDetails}
						checkedEmps={checkedEmps}
						setCheckedEmps={setCheckedEmps}
					/>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>

				<DialogClose asChild>
					<Button
						type="submit"
						onClick={() => handleUpdate(selectedPeriod.period_id)}
					>
						{t("button.update")}
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}

export function UpdateTable({
	data,
	showDetails,
	checkedEmps,
	setCheckedEmps,
}: UpdateTableProps) {
	function check(empNo: string) {
		setCheckedEmps((checkedEmps) => ({
			...checkedEmps,
			[empNo]: !checkedEmps[empNo],
		}));
	}

	function checkAll() {
		const allChecked: boolean = Object.values(checkedEmps).every((v) => v);
		const newChecked: Record<string, boolean> = {};
		Object.keys(checkedEmps).forEach((k: string) => {
			newChecked[k] = !allChecked;
		});
		setCheckedEmps(newChecked);
	}

	const { t } = useTranslation(["common"]);

	return (
		<>
			<Table className="border">
				<TableHeader>
					<TableRow className="border">
						<TableHead className="w-[50px] whitespace-nowrap border text-center">
							<Button variant={"ghost"} onClick={checkAll}>
								{t("others.all_(un)click")}
							</Button>
						</TableHead>
						<TableHead className="whitespace-nowrap border text-center">
							{t("table.emp_no")}
						</TableHead>
						<TableHead className="whitespace-nowrap border text-center">
							{t("table.name")}
						</TableHead>
						{showDetails && (
							<>
								<TableHead className="whitespace-nowrap border text-center">
									{t("table.key")}
								</TableHead>
								<TableHead className="whitespace-nowrap border text-center">
									{t("table.salary_data")}
								</TableHead>
								<TableHead className="whitespace-nowrap border text-center">
									{t("table.ehr_data")}
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
								className="whitespace-nowrap border text-center font-medium"
							>
								{t("table.no_data")}
							</TableCell>
						</TableRow>
					)}
					{data.map((d: SyncDataAndStatus) => {
						const comparisons = d.comparisons;
						return (
							<Fragment key={d.emp_no}>
								<CustomTableRow>
									<CustomTableCell
										rowSpan={comparisons.length + 1}
										className="whitespace-nowrap border text-center"
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
										className="whitespace-nowrap border text-center"
									>
										{d.emp_no}
									</CustomTableCell>
									<CustomTableCell
										rowSpan={comparisons.length + 1}
										className="whitespace-nowrap border text-center"
									>
										{d.emp_name}
									</CustomTableCell>

									{showDetails && (
										<>
											<CustomTableCell className="whitespace-nowrap border text-center">
												{displayData(
													t(
														`table.${
															comparisons[0]!.key
														}`
													),
													t
												)}
											</CustomTableCell>
											<CustomTableCell className="whitespace-nowrap border text-center">
												{displayData(
													comparisons[0]!
														.salary_value,
													t
												)}
											</CustomTableCell>
											<CustomTableCell className="whitespace-nowrap border text-center">
												{displayData(
													comparisons[0]!.ehr_value,
													t
												)}
											</CustomTableCell>
										</>
									)}
								</CustomTableRow>
								{comparisons.map(
									(cd: DataComparison, index: number) => {
										return (
											<Fragment key={cd.key}>
												{index === 0 ? (
													<CustomTableRow></CustomTableRow>
												) : (
													<>
														<CustomTableRow>
															{showDetails && (
																<>
																	<CustomTableCell className="whitespace-nowrap border text-center">
																		{displayData(
																			t(
																				`table.${cd.key}`
																			),
																			t
																		)}
																	</CustomTableCell>
																	<CustomTableCell className="whitespace-nowrap border text-center">
																		{displayData(
																			cd.salary_value,
																			t
																		)}
																	</CustomTableCell>
																	<CustomTableCell className="whitespace-nowrap border text-center">
																		{displayData(
																			cd.ehr_value,
																			t
																		)}
																	</CustomTableCell>
																</>
															)}
														</CustomTableRow>
													</>
												)}
											</Fragment>
										);
									}
								)}
							</Fragment>
						);
					})}
				</TableBody>
			</Table>
		</>
	);
}
