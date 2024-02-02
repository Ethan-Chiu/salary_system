import { CombinedData } from "~/server/service/employee_data_service";
import { type ReactElement, useState, useEffect, Fragment } from "react";

import { ScrollArea } from "~/components/ui/scroll-area";

import { displayData } from "../utils/display";

import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

interface EmpTableParameters {
	empData: Array<CombinedData>,
	mode: string,
	diffColor: string
}

export function EmployeeDataChange({
	empData,
	mode,
	diffColor,
}: EmpTableParameters) {
	const [diffKeys, setDiffKeys] = useState<string[]>([]);
	useEffect(() => {
		let dk: Array<string> = [];
		empData.map((d: CombinedData) => {
			if(d.is_different) dk.push(d.key)
		})
		setDiffKeys(dk);
	}, []);

	const isDiff = (checkKey: string): boolean => {
		return diffKeys.includes(checkKey);
	};

	function EmpTableContent() {
		if (!diffColor) diffColor = "red";
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
							{empData.map(
								(d: CombinedData, index: number) => {
									let diff = isDiff(d.key);
									return mode === "Changed" && !diff ? (
										<Fragment key={d.key}></Fragment>
									) : (
										<TableRow key={d.key}>
											<TableCell className="font-medium">
												{d.key}
											</TableCell>
											<TableCell
												className={`font-medium ${
													diff && colorClassName
												}`}
											>
												{displayData(
													d.db_value
												)}
											</TableCell>
											<TableCell
												className={`font-medium ${
													diff && colorClassName
												}`}
											>
												{displayData(d.ehr_value)}
											</TableCell>
										</TableRow>
									);
								}
							)}
						</TableBody>
						<TableFooter></TableFooter>
					</Table>
				</ScrollArea>
			</>
		);
	}

	return <EmpTableContent />;
}