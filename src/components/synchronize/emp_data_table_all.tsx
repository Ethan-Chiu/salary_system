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
import {
	type SyncData,
	type DataComparison,
} from "~/server/service/sync_service";
import { displayData } from "~/components/synchronize/utils/display";
import { cn } from "~/lib/utils";
import {
	SyncDataDisplayModeEnum,
	type SyncDataDisplayModeEnumType,
} from "~/components/synchronize/utils/data_display_mode";

import { useTranslation } from "react-i18next";

interface EmployeeDataChangeAllProps {
	data: SyncData[];
	mode: SyncDataDisplayModeEnumType;
}

export function EmployeeDataChangeAll({
	data,
	mode,
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
							<TableHead className="w-1/4 text-center">
								{t("table.salary_data")}
							</TableHead>
							<TableHead className="w-1/4 text-center">
								{t("table.ehr_data")}
							</TableHead>
						</TableRow>
					</TableHeader>
					{data.map((d: SyncData, _index: number) => {
						// Filter data based on mode
						let comparisons: DataComparison[] = d.comparisons;

						if (mode === SyncDataDisplayModeEnum.Values.changed) {
							comparisons = d.comparisons.filter(
								(c: DataComparison) => c.is_different
							);
						}

						// Get row span
						const rowSpan = comparisons.length;

						return (
							<>
								<TableBody className="hover:bg-muted/50">
									{comparisons.map(
										(c: DataComparison, index: number) => {
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
															{d.department.salary_value}
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
															{d.emp_no.salary_value}
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
															{d.name.salary_value}
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
															"font-medium min-w-[120px]",
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
															"font-medium min-w-[120px]",
															diff &&
															"text-red-500"
														)}
													>
														{displayData(
															c.ehr_value,
															t
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
