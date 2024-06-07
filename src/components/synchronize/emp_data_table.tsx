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
import { type DataComparison } from "~/server/service/sync_service";
import { displayData } from "~/components/synchronize/utils/display";
import { cn } from "~/lib/utils";
import {
	SyncDataDisplayModeEnum,
	type SyncDataDisplayModeEnumType,
} from "~/components/synchronize/utils/data_display_mode";

import { Translate } from "~/lib/utils/translation";

interface EmpTableParameters {
	empData: Array<DataComparison>;
	mode: SyncDataDisplayModeEnumType;
}

export function EmployeeDataChange({ empData, mode }: EmpTableParameters) {
	return (
		<>
			<ScrollArea className="h-full overflow-y-auto border text-center rounded-md">
				<Table>
					<TableHeader className="bg-secondary">
						<TableRow className="sticky top-0 bg-secondary hover:bg-secondary">
							<TableHead className="w-1/3 text-center">
								{Translate("key")}
							</TableHead>
							<TableHead className="w-1/3 text-center">
								{Translate("salary_data")}
							</TableHead>
							<TableHead className="w-1/3 text-center">
								{Translate("ehr_data")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{empData.map((d: DataComparison, _index: number) => {
							const diff = d.is_different;

							if (
								mode ===
									SyncDataDisplayModeEnum.Values.changed &&
								!diff
							) {
								return <Fragment key={d.key}></Fragment>;
							}

							return (
								<TableRow key={d.key}>
									<TableCell className="font-medium">
										{Translate(d.key)}
									</TableCell>
									<TableCell
										className={cn(
											"font-medium",
											diff && "text-red-500"
										)}
									>
										{displayData(d.salary_value)}
									</TableCell>
									<TableCell
										className={cn(
											"font-medium",
											diff && "text-red-500"
										)}
									>
										{displayData(d.ehr_value)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
					<TableFooter></TableFooter>
				</Table>
			</ScrollArea>
		</>
	);
}
