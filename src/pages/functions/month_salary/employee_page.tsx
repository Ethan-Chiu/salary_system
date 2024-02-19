import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";
import { progressBarLabels } from ".";
import { api } from "~/utils/api";
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

export function EmployeePage({
	period,
	func,
	selectedIndex,
	setSelectedIndex,
}: {
	period: number;
	func: string;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
	const employees = api.employeeData.getPaidEmployees.useQuery({ func });
	return (
		<>
			<div className="h-0 grow">
				<ScrollArea className="h-full overflow-y-auto border text-center">
					{employees.data && (
						<Table>
							<TableHeader className="bg-secondary">
								<TableRow className="sticky top-0 bg-secondary hover:bg-secondary">
									<TableHead className="w-1/3 text-center">
										id
									</TableHead>
									<TableHead className="w-1/3 text-center">
										name
									</TableHead>
									<TableHead className="w-1/3 text-center">
										english name
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{employees.data.map((e) => (
									<TableRow key={e.emp_no}>
										<TableCell className={`font-medium`}>
											{e.emp_no}
										</TableCell>
										<TableCell className={`font-medium`}>
											{e.name}
										</TableCell>
										<TableCell className={`font-medium`}>
											{e.english_name}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter></TableFooter>
						</Table>
					)}
				</ScrollArea>
			</div>
			<div className="mt-4 flex justify-between">
				<Button
					onClick={() => setSelectedIndex(selectedIndex - 1)}
					disabled={selectedIndex === 0}
				>
					{Translate("previous_step")}
				</Button>
				<Button
					onClick={() => setSelectedIndex(selectedIndex + 1)}
					disabled={selectedIndex === progressBarLabels.length - 1}
				>
					{Translate("next_step")}
				</Button>
			</div>
		</>
	);
}
