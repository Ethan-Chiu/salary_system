import { ArrowRightCircle, GitCommitHorizontal } from "lucide-react";
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
import {
	type HistoryDataType,
	type EmployeeHistoryQueryFunctionType,
} from "~/components/data_table/history_data_type";
import { type ColumnDef } from "@tanstack/react-table";
import { Separator } from "~/components/ui/separator";
import {
	EmployeePopoverSelector,
	type PopoverSelectorDataType,
} from "~/components/popover_selector";
import periodContext from "~/components/context/period_context";
import { formatDate } from "~/lib/utils/format_date";
import { employeePaymentMapper } from "../../tables/employee_payment_table";
import { getTableMapper } from "../../tables/table_columns";
import dataTableContext from "../context/data_table_context";
import { FunctionMode } from "../function_sheet/data_table_functions";

export interface EmployeeHistoryViewCommonEmpInfo {
	emp_name?: string;
	emp_no: string;
}

type DataRow = EmployeeHistoryViewCommonEmpInfo & HistoryDataType;

interface DataTableProps<TData extends DataRow> {
	columns: ColumnDef<TData, any>[];
	dataFunction: EmployeeHistoryQueryFunctionType<TData>;
}

export function HistoryView<TData extends DataRow>({
	columns,
	dataFunction,
}: DataTableProps<TData>) {
	const { t } = useTranslation(['common']);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const { selectedTableType } = useContext(dataTableContext);

	const { isLoading, isError, data, error } = dataFunction();

	const { selectedPeriod } = useContext(periodContext);

	const [selectedEmpNo, setSelectedEmpNo] = useState<string | null>(null);
	const [selectedEmpDataList, setSelectedEmpDataList] = useState<DataRow[]>(
		[]
	);
	const [selectedEmpData, setSelectedEmpData] = useState<DataRow | null>(
		null
	);

	// Select the first when data loaded
	useEffect(() => {
		if (!isLoading && data?.[0] && data?.[0]?.[0]) {
			setSelectedEmpData(data[0][0]);
			setSelectedEmpNo(data[0][0].emp_no);
			const newSelectedEmpDataList = data?.find(
				(empDataList) => empDataList[0]?.emp_no === data[0]?.[0]?.emp_no
			);
			if (newSelectedEmpDataList) {
				setSelectedEmpDataList(newSelectedEmpDataList);
			}
		}
	}, [isLoading, data]);

	useEffect(() => {
		const newSelectedEmpDataList = data?.find(
			(empDataList) => empDataList[0]?.emp_no === selectedEmpNo
		);
		if (
			newSelectedEmpDataList &&
			!newSelectedEmpDataList.find(
				(empData) => empData.id === selectedEmpData?.id
			) &&
			newSelectedEmpDataList[0]
		) {
			setSelectedEmpData(newSelectedEmpDataList[0]);
			setSelectedEmpDataList(newSelectedEmpDataList);
		}
	}, [selectedEmpNo, data, selectedEmpData]);

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

	const employeeOpts: PopoverSelectorDataType[] = [];

	data.forEach((empDataList) => {
		const firstEmpData = empDataList[0];
		if (!firstEmpData) {
			return;
		}
		employeeOpts.push({
			key: firstEmpData.emp_no,
			value: `${firstEmpData.emp_no} ${firstEmpData.emp_name}`,
		});
	});

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={25} minSize={15}>
				<div className="flex h-full flex-col">
					<EmployeePopoverSelector
						data={employeeOpts}
						selectedKey={selectedEmpNo}
						setSelectedKey={setSelectedEmpNo}
					/>
					<Separator />
					<div className="h-0 flex-grow">
						<ScrollArea className="h-full">
							{selectedEmpDataList.map((e) => (
								<div
									key={e.id}
									className={cn(
										" relative m-2 flex flex-col rounded-md border p-1 hover:bg-muted",
										e.id === selectedEmpData?.id &&
										"bg-muted",
										is_date_available(
											selectedPeriod,
											e.start_date.toString(),
											e.end_date?.toString() ?? ""
										) && "mb-3 border-blue-500"
									)}
									onClick={() => setSelectedEmpData(e)}
								>
									<div className="m-1 flex flex-wrap items-center justify-center">
										<div className="flex-1 whitespace-nowrap text-center">
											{formatDate("day", e.start_date) ??
												t("others.now")}
										</div>
										<ArrowRightCircle
											size={18}
											className="mx-2 flex-shrink-0"
										/>
										<div className="flex-1 whitespace-nowrap text-center">
											{formatDate("day", e.end_date) ??
												t("others.now")}
										</div>
									</div>
									{/* Update by */}
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
									{/* Current badge */}
									{is_date_available(
										selectedPeriod,
										e.start_date.toString(),
										e.end_date?.toString() ?? ""
									) && (
											<div className="absolute -bottom-3 right-2 z-10">
												<Badge>{t("table.current")}</Badge>
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
				{selectedEmpData ? (
					<>
						<DataTable
							columns={columns}
							data={selectedEmpData ? getTableMapper(selectedTableType)(t, [selectedEmpData]) : []}
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
