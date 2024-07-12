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

import { useTranslation } from "react-i18next";

interface EmpTableParameters {
	empData: Array<DataComparison>;
	mode: SyncDataDisplayModeEnumType;
}

export function EmployeeDataChange({ empData, mode }: EmpTableParameters) {
	const { t } = useTranslation(['common']);
	return (
		<>
			<ScrollArea className="h-full overflow-y-auto border text-center rounded-md">
				<Table>
					<TableHeader className="bg-secondary">
						<TableRow className="sticky top-0 bg-secondary hover:bg-secondary">
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
										{t(`table.${d.key}`)}
									</TableCell>
									<TableCell
										className={cn(
											"font-medium",
											diff && "text-red-500"
										)}
									>
										{displayData(d.salary_value, t)}
									</TableCell>
									<TableCell
										className={cn(
											"font-medium",
											diff && "text-red-500"
										)}
									>
										{displayData(d.ehr_value, t)}
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
