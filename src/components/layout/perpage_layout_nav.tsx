import Head from "next/head";
import { useState, type PropsWithChildren, useRef } from "react";
import { Sidebar } from "~/components/sidebar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "../ui/resizable";
import { cn } from "~/lib/utils";
import { type ImperativePanelHandle } from "react-resizable-panels";
import PeriodContextProvider from "../context/period_context_provider";

type PerpageLayoutProp = {
	pageTitle: string;
};

export const PerpageLayoutNav = (
	props: PropsWithChildren<PerpageLayoutProp>
) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const ref = useRef<ImperativePanelHandle>(null);

	return (
		<>
			<Head>
				{/* basic meta */}
				<title>{props.pageTitle}</title>
				<meta name="description" content="Salary system" />
				<link rel="icon" href="/favicon.ico" />
				{/* mobile mata */}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
			</Head>
			<main className="min-h-screen bg-background">
				<PeriodContextProvider>
					<ResizablePanelGroup
						direction="horizontal"
						onLayout={(sizes: number[]) => {
							document.cookie = `react-resizable-panels:layout=${JSON.stringify(
								sizes
							)}`;
						}}
						className="min-h-screen items-stretch"
					>
						<ResizablePanel
							ref={ref}
							defaultSize={265}
							collapsedSize={3}
							collapsible
							minSize={10}
							maxSize={20}
							onExpand={() => {
								setIsCollapsed(false);
								document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
									false
								)}`;
							}}
							onCollapse={() => {
								setIsCollapsed(true);
								document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
									true
								)}`;
							}}
							className={cn(
								isCollapsed &&
									"min-w-[50px] transition-all duration-300 ease-in-out"
							)}
						>
							<Sidebar
								isCollapsed={isCollapsed}
								collapseFunction={() => ref.current?.collapse()}
								expandFunction={() => ref.current?.expand()}
								className="hidden lg:block lg:border-border"
							/>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel
							defaultSize={440}
							minSize={30}
							className={cn(
								isCollapsed &&
									"transition-all duration-300 ease-in-out"
							)}
						>
							<div className="h-full w-full">
								{props.children}
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</PeriodContextProvider>
			</main>
		</>
	);
};
