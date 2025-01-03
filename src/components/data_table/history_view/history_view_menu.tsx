import { type PropsWithChildren } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";

export function HistoryViewMenu({children}: PropsWithChildren) {
	return (
		<div className="h-0 flex-grow">
			<ScrollArea className="h-full">
				{children}
				<div className="h-4" />
			</ScrollArea>
		</div>
	);
}
