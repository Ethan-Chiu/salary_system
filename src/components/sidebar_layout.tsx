import Head from "next/head";
import type { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar";

type SidebarLayoutProp = {
	pageTitle: string;
};

export const SidebarLayout = (props: PropsWithChildren<SidebarLayoutProp>) => {
	return (
		<>
			<Head>
				<title>{props.pageTitle}</title>
				<meta name="description" content="Salary system" />
				<link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main className="min-h-screen bg-background">
				<div className="grid min-h-screen lg:grid-cols-5">
					<Sidebar className="hidden lg:block lg:border-border" />
					<div className="col-span-3 lg:col-span-4 lg:border-l">
						<div className="h-full px-4 py-6 lg:px-8">
							<div className="w-full">{props.children}</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};
