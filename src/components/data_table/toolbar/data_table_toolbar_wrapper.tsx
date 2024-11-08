import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

export function DataTableToolbarWrapper({
	children,
	className,
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div
			className={cn(
				"flex items-center justify-between space-x-2 px-2 py-2",
				className
			)}
		>
			{children}
		</div>
	);
}
