import { type PropsWithChildren } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";

export function HistoryViewMenu({ children }: PropsWithChildren) {
	return (
		<ScrollArea className="h-full">
			{children}
			<div className="h-4" />
		</ScrollArea>
	);
}
