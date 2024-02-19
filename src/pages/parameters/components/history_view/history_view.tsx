import { ArrowRightCircle, GitCommitVertical } from "lucide-react";
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
import dataTableContext from "../context/data_table_context";
import { getTableColumn, getTableMapper } from "../../tables/table_columns";
import { DataTable } from "./data_table";
import { is_date_available } from "~/server/service/helper_function";
import { Badge } from "~/components/ui/badge";

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
	const { selectedTableType } = useContext(dataTableContext);

	const queryFunctions = useContext(apiFunctionsContext);
	const queryFunction = queryFunctions.queryFunction!;

	const { isLoading, isError, data, error } = queryFunction();

	const [selectedId, setSelectedId] = useState<number>(0);
	const filterKey = "name";

	useEffect(() => {
		if (!isLoading && data) {
			setSelectedId(data![0]!.id);
		}
	}, [isLoading]);

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

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={25} minSize={15}>
				<ScrollArea className="h-full">
					{data
						.sort((a, b) => {
							if (a.start_date == null) {
								return -1;
							} else if (b.start_date == null) {
								return 1;
							} else {
								return a.start_date > b.start_date ? -1 : 1;
							}
						})
						.map((e) => (
							<div
								key={e.id}
								className={cn(
									" relative m-2 flex flex-col rounded-md border p-1 hover:bg-muted",
									e.id === selectedId && "bg-muted",
									is_date_available(
										e.start_date,
										e.end_date
									) && "border-blue-500 mb-3"
								)}
								onClick={() => setSelectedId(e.id)}
							>
								<div className="m-1 flex flex-wrap items-center justify-center">
									<div className="flex-1 whitespace-nowrap text-center">
										{e.start_date ?? "current"}
									</div>
									<ArrowRightCircle
										size={18}
										className="mx-2 flex-shrink-0"
									/>
									<div className="flex-1 whitespace-nowrap text-center">
										{e.end_date ?? "current"}
									</div>
								</div>
								<div className="m-1 flex text-sm">
									<GitCommitVertical
										size={18}
										className="mr-2 flex-shrink-0"
									/>
									<div className="line-clamp-1 break-all">
										update by {e.update_by}
									</div>
								</div>
								{is_date_available(
									e.start_date,
									e.end_date
								) && (
									<div className="absolute -bottom-3 right-2 z-10">
										<Badge>Current</Badge>
									</div>
								)}
							</div>
						))}
				</ScrollArea>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={75}>
				{data.filter((e) => e.id === selectedId).length > 0 ? (
					<DataTable
						columns={getTableColumn(selectedTableType)}
						data={getTableMapper(selectedTableType)(
							data.filter((e) => e.id === selectedId)
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
