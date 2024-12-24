
import { PropsWithChildren } from "react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

export function DataTableToolbarWrapper({
	children,
	className,
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<ScrollArea>
			<div
				className={cn(
					"flex items-center justify-between space-x-2 px-2 py-2",
					className
				)}
			>
				{children}
			</div>
			<ScrollBar orientation="horizontal" className="w-full"/>
		</ScrollArea>
	);
}
