import { ArrowRightCircle, GitCommitVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { AttendanceTable } from "../../tables/attendance_table";

export default function HistoryView() {
	const { isLoading, isError, data, error } =
		api.parameters.getAllAttendanceSetting.useQuery();

	const [selectedId, setSelectedId] = useState<number>(0);

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
			<ResizablePanel defaultSize={30} minSize={15}>
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
									"m-2 flex flex-col rounded-md border p-1 hover:bg-muted",
									e.id === selectedId && "bg-muted"
								)}
								onClick={() => setSelectedId(e.id)}
							>
								<div className="m-1 flex flex-wrap items-center justify-center">
									<div className="flex-1 whitespace-nowrap text-center">
										{e.start_date}
									</div>
									<ArrowRightCircle
										size={18}
										className="mx-2 flex-shrink-0"
									/>
									<div className="flex-1 whitespace-nowrap text-center">
										{e.end_date}
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
							</div>
						))}
				</ScrollArea>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={70}>
				<AttendanceTable />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
