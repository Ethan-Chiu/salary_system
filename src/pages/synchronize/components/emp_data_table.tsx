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
import { DataComparison, SyncData } from "~/server/service/sync_service";

interface EmpTableParameters {
	empData: SyncData;
	mode: string;
	diffColor: string;
}

export function EmployeeDataChange({
	empData,
	mode,
	diffColor,
}: EmpTableParameters) {
	const [diffKeys, setDiffKeys] = useState<string[]>([]);
	const allData = [empData.emp_no, empData.name, empData.english_name, empData.department, ...empData.comparisons];
	useEffect(() => {
		let dk: Array<string> = [];
		allData.map((d: DataComparison) => {
			if (d.is_different) dk.push(d.key);
		});
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
							{allData.map((d: DataComparison, index: number) => {
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
											{displayData(d.salary_value)}
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
							})}
						</TableBody>
						<TableFooter></TableFooter>
					</Table>
				</ScrollArea>
			</>
		);
	}

	return <EmpTableContent />;
}
