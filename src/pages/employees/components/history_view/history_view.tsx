import {
	ArrowRightCircle,
	Check,
	ChevronsUpDown,
	GitCommitHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
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

	const [selectedId, setSelectedId] = useState<number>(0);
	const [selectedEmpNo, setSelectedEmpNo] = useState<string | null>(null);

	const { t } = useTranslation(["common"]);

	// Select the first when data loaded
	useEffect(() => {
		if (!isLoading && data?.[0]) {
			setSelectedId(data[0].id);
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
				setSelectedId(filteredData[0].id);
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

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={25} minSize={15}>
				<div className="flex h-full flex-col">
					<CompSelectEmp data={data} />
					<Separator />
					<div className="h-0 flex-grow">
						<ScrollArea className="h-full">
							{data
								.sort((a, b) => {
									if (a.start_date == null) {
										return -1;
									} else if (b.start_date == null) {
										return 1;
									} else {
										return a.start_date > b.start_date
											? -1
											: 1;
									}
								})
								.filter(
									(e) =>
										selectedEmpNo === null ||
										e.emp_no === selectedEmpNo
								)
								.map((e) => (
									<div
										key={e.id}
										className={cn(
											" relative m-2 flex flex-col rounded-md border p-1 hover:bg-muted",
											e.id === selectedId && "bg-muted",
											is_date_available(
												e.start_date,
												e.end_date
											) && "mb-3 border-blue-500"
										)}
										onClick={() => setSelectedId(e.id)}
									>
										<div className="m-1 flex flex-wrap items-center justify-center">
											<div className="flex-1 whitespace-nowrap text-center">
												{e.start_date ??
													t("others.now")}
											</div>
											<ArrowRightCircle
												size={18}
												className="mx-2 flex-shrink-0"
											/>
											<div className="flex-1 whitespace-nowrap text-center">
												{e.end_date ?? t("others.now")}
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
											e.start_date,
											e.end_date
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
			<ResizablePanel defaultSize={75}>
				{data.filter((e) => e.id === selectedId).length > 0 ? (
					<DataTable
						columns={columns}
						data={data.filter((e) => e.id === selectedId) as any[]}
					/>
				) : (
					<></>
				)}
			</ResizablePanel>
		</ResizablePanelGroup>
	);

	function CompSelectEmp({
		data,
	}: {
		data: EmployeeHistoryViewCommonEmpInfo[];
	}) {
		const [open, setOpen] = useState(false);

		const seen = new Set<string>();
		const employees: EmployeeHistoryViewCommonEmpInfo[] = [];

		data.forEach((employee) => {
			if (!seen.has(employee.emp_no)) {
				seen.add(employee.emp_no);
				employees.push(employee);
			}
		});

		return (
			<div className="p-2">
				<Popover open={open} onOpenChange={setOpen}>
					{/* Trigger */}
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-full justify-between"
						>
							{selectedEmpNo ? (
								<>
									{`${selectedEmpNo} ${
										employees.find(
											(emp) =>
												emp.emp_no === selectedEmpNo
										)?.emp_name ??
										t("others.search_employee")
									}`}
								</>
							) : (
								<> {t("others.search_employee")} </>
							)}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					{/* Employee list */}
					<PopoverContent className="p-0">
						<Command className="max-h-[40vh]">
							<CommandInput
								placeholder={t("others.search_employee")}
							/>
							<CommandList>
								<CommandEmpty>
									{t("others.no_employee_found")}
								</CommandEmpty>
								<CommandGroup>
									{employees.map((employee) => (
										<CommandItem
											key={employee.emp_no}
											value={`${employee.emp_no} ${employee.emp_name}`}
											onSelect={() => {
												setSelectedEmpNo(
													employee.emp_no
												);
												setOpen(false);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													selectedEmpNo ===
														employee.emp_no
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{`${employee.emp_no} ${employee.emp_name}`}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		);
	}
}
