import { Fragment } from "react";

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
							<TableHead className="w-1/3 text-center">
								{"Emp no"}
							</TableHead>
							<TableHead className="w-1/3 text-center">
								{t("table.key")}
							</TableHead>
							<TableHead className="w-1/3 text-center">
								{t("table.salary_data")}
							</TableHead>
							<TableHead className="w-1/3 text-center">
								{t("table.ehr_data")}
							</TableHead>
						</TableRow>
					</TableHeader>
					{data.map((d: SyncData, _index: number) => {
						const rowSpan = d.comparisons.length - 1;

						return (
							<>
								<TableBody className="hover:bg-muted/50">
									{d.comparisons.map(
										(c: DataComparison, index: number) => {
											const diff = c.is_different;

											if (
												mode ===
													SyncDataDisplayModeEnum
														.Values.changed &&
												!diff
											) {
												return (
													<Fragment
														key={c.key}
													></Fragment>
												);
											}

											return (
												<TableRow
													key={c.key}
													className="hover:bg-transparent"
												>
													{index === 1 ? (
														<TableCell
															className="font-medium hover:bg-muted/50"
															rowSpan={rowSpan}
														>
															{d.emp_no.ehr_value}
														</TableCell>
													) : (
														<></>
													)}
													<TableCell className="font-medium">
														{t(`table.${c.key}`)}
													</TableCell>
													<TableCell
														className={cn(
															"font-medium",
															diff &&
																"text-red-500"
														)}
													>
														{displayData(
															c.salary_value,
															t
														)}
													</TableCell>
													<TableCell
														className={cn(
															"font-medium",
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
