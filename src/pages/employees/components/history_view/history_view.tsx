import {
	ArrowRightCircle,
	GitCommitHorizontal,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { DataTable } from "./history_data_table";
import { is_date_available } from "~/server/service/helper_function";
import { Badge } from "~/components/ui/badge";
import { useTranslation } from "react-i18next";
import { type HistoryQueryFunctionType } from "~/components/data_table/history_data_type";
import { type ColumnDef } from "@tanstack/react-table";
import { Separator } from "~/components/ui/separator";
import {
	PopoverSelector,
	type PopoverSelectorDataType,
} from "~/components/popover_selector";
import periodContext from "~/components/context/period_context";
import { Button } from "~/components/ui/button";

export interface EmployeeHistoryViewCommonEmpInfo {
	emp_name: string;
	emp_no: string;
}

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	dataFunction: HistoryQueryFunctionType<EmployeeHistoryViewCommonEmpInfo>;
}

export function HistoryView<TData>({
	columns,
	dataFunction,
}: DataTableProps<TData>) {
	const { isLoading, isError, data, error } = dataFunction();

	const { selectedPeriod } = useContext(periodContext);

	const [selectedId, setSelectedId] = useState<number>(0);
	const [selectedEmpNo, setSelectedEmpNo] = useState<string | null>(null);


	const { t } = useTranslation(["common"]);

	// Select the first when data loaded
	useEffect(() => {
		if (!isLoading && data?.[0]) {
			// setSelectedId(data[0].id);
			setSelectedId(0);
			setSelectedEmpNo(data[0].emp_no);
		}
	}, [isLoading, data]);

	// Select employee in the filtered list
	useEffect(() => {
		if (data) {
			const filteredData = data.filter(
				(employee) => employee.emp_no === selectedEmpNo
			);

			if (
				!filteredData?.find((employee) => employee.id === selectedId) &&
				filteredData?.[0]
			) {
				// setSelectedId(filteredData[0].id);
				console.log("here");
			}
		}
	}, [data, selectedId, selectedEmpNo]);

	if (isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (!data) {
		return <div />;
	}

	const seen = new Set<string>();
	const employees: PopoverSelectorDataType[] = [];

	data.forEach((employee: any) => {
		seen.add(employee[0]!.emp_no);
		employees.push({
			key: employee[0]!.emp_no,
			value: `${employee[0]!.emp_no} ${employee[0]!.emp_name}`,
		})
		// if (!seen.has(employee.emp_no)) {
		// 	seen.add(employee.emp_no);
		// 	employees.push({
		// 		key: employee.emp_no,
		// 		value: `${employee.emp_no} ${employee.emp_name}`,
		// 	});
		// }
	});

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={25} minSize={15}>
				<div className="flex h-full flex-col">
					<PopoverSelector
						data={employees}
						selectedKey={selectedEmpNo}
						setSelectedKey={setSelectedEmpNo}
					/>
					<Separator />
					<div className="h-0 flex-grow">
						<ScrollArea className="h-full">
							{((data.find((e: any) => (selectedEmpNo === null || e[0]!.emp_no === selectedEmpNo)) as any) ?? [])
								.map((e: any, idx: number) => (
									<div
										key={e.id}
										className={cn(
											" relative m-2 flex flex-col rounded-md border p-1 hover:bg-muted",
											idx === selectedId && "bg-muted",
											is_date_available(
												selectedPeriod,
												e.start_date.toString(),
												e.end_date?.toString() ?? ""
											) && "mb-3 border-blue-500"
										)}
										onClick={() => setSelectedId(idx)}
									>
										<div className="m-1 flex flex-wrap items-center justify-center">
											<div className="flex-1 whitespace-nowrap text-center">
												{e.start_date.toString() ??
													t("others.now")}
											</div>
											<ArrowRightCircle
												size={18}
												className="mx-2 flex-shrink-0"
											/>
											<div className="flex-1 whitespace-nowrap text-center">
												{e.end_date?.toString() ??
													t("others.now")}
											</div>
										</div>
										<div className="m-1 flex text-sm">
											<GitCommitHorizontal
												size={18}
												className="mr-2 flex-shrink-0"
											/>
											<div className="line-clamp-1 break-all">
												{t("table.update_by") +
													" " +
													e.update_by}
											</div>
										</div>
										{is_date_available(
											selectedPeriod,
											e.start_date.toString(),
											e.end_date?.toString() ?? ""
										) && (
												<div className="absolute -bottom-3 right-2 z-10">
													<Badge>
														{t("table.current")}
													</Badge>
												</div>
											)}
									</div>
								))}
							<div className="h-4" />
						</ScrollArea>
					</div>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			{/* <Button onClick={() => console.log(data)}>
				TEST
			</Button> */}
			<ResizablePanel defaultSize={75}>
				{((data.findLast((e: any) => e[0].emp_no === selectedEmpNo)! as any) ?? []).filter((e: any, idx: number) => idx === selectedId).length > 0 ? (
					<>
						<DataTable
							columns={columns}
							data={((data.findLast((e: any) => e[0].emp_no === selectedEmpNo) ?? []) as any).filter((e: any, idx: number) => idx === selectedId) as any[]}
						/>
						
					</>
				) : (
					<>
					<p>No find selected</p>
					</>
				)}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
