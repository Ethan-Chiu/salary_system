import { ScrollArea } from "~/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { displayData } from "~/components/synchronize/utils/display";
import { cn } from "~/lib/utils";
import {
	SyncDataDisplayModeEnum,
	type SyncDataDisplayModeEnumType,
} from "~/components/synchronize/utils/data_display_mode";

import { useTranslation } from "react-i18next";
import { Checkbox } from "../ui/checkbox";
import {
	type DataComparisonAndStatus,
	type SyncDataAndStatus,
} from "./update_table";
import { CircleCheckBigIcon } from "lucide-react";

interface EmployeeDataChangeAllProps {
	data: SyncDataAndStatus[];
	mode: SyncDataDisplayModeEnumType;
	setDataStatus: (emp_no: string, key: string, checked: boolean) => void;
}

export function EmployeeDataChangeTable({
	data,
	mode,
	setDataStatus,
}: EmployeeDataChangeAllProps) {
	const { t } = useTranslation(["common"]);
	return (
		<>
			<ScrollArea className="h-full overflow-y-auto rounded-md border text-center">
				<Table>
					<TableHeader className="bg-secondary">
						<TableRow className="sticky top-0 bg-secondary hover:bg-secondary">
							<TableHead className="w-1/4 text-center">
								{t("table.department")}
							</TableHead>
							<TableHead className="w-1/4 text-center">
								{t("table.emp_no")}
							</TableHead>
							<TableHead className="w-1/4 text-center">
								{t("table.emp_name")}
							</TableHead>
							<TableHead className="w-1/4 text-center">
								{t("table.key")}
							</TableHead>
							<TableHead className="w-1/4 min-w-[180px] text-center">
								{t("table.salary_data")}
							</TableHead>
							<TableHead className="w-1/4 min-w-[180px] text-center">
								{t("table.ehr_data")}
							</TableHead>
							<TableHead className="w-1/4 text-center">
								Check
								{/* {t("sync_page.check")} */}
							</TableHead>
						</TableRow>
					</TableHeader>
					{data.map((d: SyncDataAndStatus, _index: number) => {
						// Filter data based on mode
						let comparisons: DataComparisonAndStatus[] =
							d.comparisons;

						if (mode === SyncDataDisplayModeEnum.Values.changed) {
							comparisons = d.comparisons.filter(
								(c: DataComparisonAndStatus) => c.is_different
							);
						}

						// Get row span
						const rowSpan = comparisons.length;

						return (
							<>
								<TableBody className="hover:bg-muted/50">
									{comparisons.map(
										(
											c: DataComparisonAndStatus,
											index: number
										) => {
											const diff = c.is_different;

											return (
												<TableRow
													key={c.key}
													className="hover:bg-transparent"
												>
													{/* Department */}
													{index === 0 ? (
														<TableCell
															className="font-medium hover:bg-muted/50"
															rowSpan={rowSpan}
														>
															{d.department}
														</TableCell>
													) : (
														<></>
													)}
													{/* Emp No */}
													{index === 0 ? (
														<TableCell
															className="font-medium hover:bg-muted/50"
															rowSpan={rowSpan}
														>
															{d.emp_no}
														</TableCell>
													) : (
														<></>
													)}
													{/* Name */}
													{index === 0 ? (
														<TableCell
															className="font-medium hover:bg-muted/50"
															rowSpan={rowSpan}
														>
															{d.emp_name}
														</TableCell>
													) : (
														<></>
													)}
													{/* Data Field Name */}
													<TableCell className="font-medium">
														{t(`table.${c.key}`)}
													</TableCell>
													{/* Salary Data */}
													<TableCell
														className={cn(
															"min-w-[180px] font-medium",
															diff &&
																"text-red-500"
														)}
													>
														{displayData(
															c.salary_value,
															t
														)}
													</TableCell>
													{/* EHR Data */}
													<TableCell
														className={cn(
															"min-w-[180px] font-medium",
															diff &&
																"text-red-500"
														)}
													>
														{displayData(
															c.ehr_value,
															t
														)}
													</TableCell>
													<TableCell className="flex h-14 items-center justify-center p-0">
														{diff ? (
															<Checkbox
																className="border-red-500 data-[state=checked]:bg-red-500"
																checked={
																	c.check_status ===
																	"checked"
																}
																onCheckedChange={(
																	checked
																) =>
																	setDataStatus(
																		d.emp_no,
																		c.key,
																		checked ===
																			true
																	)
																}
															/>
														) : (
															<CircleCheckBigIcon
																width={16}
																className="text-green-500"
															/>
														)}
													</TableCell>
												</TableRow>
											);
										}
									)}
								</TableBody>
							</>
						);
					})}
					<TableFooter></TableFooter>
				</Table>
			</ScrollArea>
		</>
	);
}
