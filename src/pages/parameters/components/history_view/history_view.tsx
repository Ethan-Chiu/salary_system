import { ArrowRightCircle, GitCommitHorizontal } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import ApiFunctionsProvider, {
	apiFunctionsContext,
} from "../context/api_context_provider";
import dataTableContext, { FunctionMode } from "../context/data_table_context";
import { getTableColumn, getTableMapper } from "../../tables/table_columns";
import { DataTable } from "./data_table";
import { is_date_available } from "~/server/service/helper_function";
import { Badge } from "~/components/ui/badge";
import { useTranslation } from "react-i18next";
import { type ParameterHistoryQueryFunctionType } from "~/components/data_table/history_data_type";
import periodContext from "~/components/context/period_context";
import { formatDate } from "~/lib/utils/format_date";
import { Separator } from "~/components/ui/separator";
import { DateStringPopoverSelector, PopoverSelectorDataType } from "~/components/popover_selector";

export default function HistoryView() {
	const { selectedTableType } = useContext(dataTableContext);

	return (
		<>
			<ApiFunctionsProvider selectedTableType={selectedTableType}>
				<CompHistoryView />
			</ApiFunctionsProvider>
		</>
	);
}

function CompHistoryView() {
	const { t } = useTranslation(['common']);
	const { selectedTableType, setOpen, setMode, setData } = useContext(dataTableContext);

	const queryFunctions = useContext(apiFunctionsContext);
	const queryFunction = queryFunctions.queryFunction! as ParameterHistoryQueryFunctionType;

	const { isLoading, isError, data, error } = queryFunction();

	const { selectedPeriod } = useContext(periodContext);

	const [selectedId, setSelectedId] = useState<number>(0);
	const [selectedDateString, setSelectedDateString] = useState<string | null>(null);
	const filterKey = "name";

	useEffect(() => {
		if (!isLoading && data?.[0] && data?.[0]?.[0]) {
			const targetData = data[0][0]
			setSelectedId(targetData.id);
			setData({
				...targetData,
				functions: {
					create: targetData.creatable,
					update: targetData.updatable,
					delete: targetData.deletable
				}
			});
			setSelectedDateString(formatDate("day", targetData.start_date) ?? t("others.now"));
		}
	}, [isLoading, data]);

	useEffect(() => {
		if (!isLoading && selectedDateString && data?.[0] && data?.[0]?.[0]) {
			const targetData = data.filter((e) => formatDate("day", e[0]!.start_date) === selectedDateString)[0]![0]!
			setSelectedId(targetData.id);
			setData({
				...targetData,
				functions: {
					create: targetData.creatable,
					update: targetData.updatable,
					delete: targetData.deletable
				}
			});
		}
	}, [selectedDateString]);

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

	const dateOpts: PopoverSelectorDataType[] = [];
	data?.forEach((e) => {
		if (e[0]!.start_date && !dateOpts.some((opt) => opt.key === formatDate("day", e[0]!.start_date))) {
			dateOpts.push({
				key: formatDate("day", e[0]!.start_date) ?? t("others.now"),
				value: formatDate("day", e[0]!.start_date) ?? t("others.now"),
			});
		}
	});

	// return <></>

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={30} minSize={15}>
				<DateStringPopoverSelector
					data={dateOpts}
					selectedKey={selectedDateString}
					setSelectedKey={setSelectedDateString}
				/>
				<Separator />
				<ScrollArea className="h-full">
					{data!
						.filter((e) => formatDate("day", e[0]!.start_date) === selectedDateString)
						.map((e) => e[0]!)
						.map((e) => (
							<div
								key={e.id}
								className={cn(
									" relative m-2 flex flex-col rounded-md border p-1 hover:bg-muted",
									e.id === selectedId && "bg-muted",
									is_date_available(
										selectedPeriod,
										e.start_date.toString(),
										e.end_date?.toString() ?? ""
									) && "mb-3 border-blue-500"
								)}
								onClick={() => {
									setSelectedId(e.id)
									console.log(e)
									setData({
										...e,
										functions: {
											create: e.creatable,
											update: e.updatable,
											delete: e.deletable
										}
									});
								}}
							>
								<div className="m-1 flex flex-wrap items-center justify-center">
									<div className="flex-1 whitespace-nowrap text-center">
										{formatDate("day", e.start_date) ?? t("others.now")}
									</div>
									<ArrowRightCircle
										size={18}
										className="mx-2 flex-shrink-0"
									/>
									<div className="flex-1 whitespace-nowrap text-center">
										{formatDate("day", e.end_date) ?? ""}
									</div>
								</div>
								<div className="m-1 flex text-sm">
									<GitCommitHorizontal
										size={18}
										className="mr-2 flex-shrink-0"
									/>
									<div className="line-clamp-1 break-all">
										{t("table.update_by") + " " + e.update_by}
									</div>
								</div>
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
				</ScrollArea>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={70}>
				{data!.filter((e) => e[0]!.id === selectedId).length > 0 ? (
					<DataTable
						columns={getTableColumn(selectedTableType, t, selectedPeriod!.period_id, setOpen, setMode, setData)}
						data={getTableMapper(selectedTableType)!(
							data!.filter((e) => e[0]!.id === selectedId)[0]! as any[]
						)}
						filterColumnKey={filterKey}
					/>
				) : (
					<></>
				)}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
