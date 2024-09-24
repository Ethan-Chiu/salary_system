import { ArrowRightCircle, GitCommitHorizontal } from "lucide-react";
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

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	dataFunction: HistoryQueryFunctionType;
}
   
export function HistoryView<TData>({
	columns,
	dataFunction, 
}: DataTableProps<TData>) {

	const { isLoading, isError, data, error } = dataFunction();

	const [selectedId, setSelectedId] = useState<number>(0);
	const { t } = useTranslation(['common']);

	useEffect(() => {
		if (!isLoading && data?.[0]) {
			setSelectedId(data[0].id);
		}
	}, [isLoading, data]);

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
					{data!
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
									) && "mb-3 border-blue-500"
								)}
								onClick={() => setSelectedId(e.id)}
							>
								<div className="m-1 flex flex-wrap items-center justify-center">
									<div className="flex-1 whitespace-nowrap text-center">
										{e.start_date ?? t("others.now")}
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
										{t("table.update_by") + " " + e.update_by}
									</div>
								</div>
								{is_date_available(
									e.start_date,
									e.end_date
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
			<ResizablePanel defaultSize={75}>
				{data!.filter((e) => e.id === selectedId).length > 0 ? (
					<DataTable
						columns={columns}
						data={(
							data!.filter((e) => e.id === selectedId) as any[]
						)}
					/>
				) : (
					<></>
				)}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
