import Head from "next/head";
import type { PropsWithChildren } from "react";
import { Sidebar } from "~/components/sidebar";
import { Title } from "~/components/title";

type PerpageLayoutWithTitleProp = {
	pageTitle: string;
};

export const PerpageLayoutWithTitle = (props: PropsWithChildren<PerpageLayoutWithTitleProp>) => {
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
				<div className="grid min-h-screen lg:grid-cols-5">
					
					<Sidebar className="hidden lg:block lg:border-border" />
					<div className="col-span-3 lg:col-span-4 lg:border-l">
						<div className="h-full px-4 py-6 lg:px-8">
							<div className="w-full">
								<Title title={props.pageTitle} />
								{props.children}
							</div>
						</div>
					</div>

				</div>
			</main>
		</>
	);
};
