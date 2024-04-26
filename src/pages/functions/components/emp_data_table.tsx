import { type CombinedData } from "~/server/service/employee_data_service";
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
import { displayData } from "~/pages/synchronize/utils/display";
import { cn } from "~/lib/utils";

interface EmpTableParameters {
	empData: Array<DataComparison>;
	mode: string;
}

export function EmployeeDataChange({
	empData,
	mode,
}: EmpTableParameters) {

  const diffKeys: string[] = [];
  empData.forEach((d: CombinedData) => {
    diffKeys.push(d.key)    
  })

	const isDiff = (checkKey: string): boolean => {
		return diffKeys.includes(checkKey);
	};

	const colorClassName = "text-red-500";

	return (
		<>
			<ScrollArea className="h-full overflow-y-auto border text-center">
				<Table>
					<TableHeader className="bg-secondary">
						<TableRow className="sticky top-0 bg-secondary hover:bg-secondary">
							<TableHead className="w-1/3 text-center">
								Key
							</TableHead>
							<TableHead className="w-1/3 text-center">
								Old Value
							</TableHead>
							<TableHead className="w-1/3 text-center">
								New Value
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{empData.map((d: DataComparison, _index: number) => {
							const diff = isDiff(d.key);
							return mode === "Changed" && !diff ? (
								<Fragment key={d.key}></Fragment>
							) : (
								<TableRow key={d.key}>
									<TableCell className="font-medium">
										{d.key}
									</TableCell>
									<TableCell
										className={cn(
											"font-medium",
											diff && colorClassName
										)}
									>
										{displayData(d.salary_value)}
									</TableCell>
									<TableCell
										className={cn(
											"font-medium",
											diff && colorClassName
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
