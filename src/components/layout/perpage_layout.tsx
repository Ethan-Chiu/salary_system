import Head from "next/head";
import type { PropsWithChildren } from "react";

type PerpageLayoutProp = {
	pageTitle: string;
};

export const PerpageLayout = (props: PropsWithChildren<PerpageLayoutProp>) => {
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
			<main className="min-h-screen bg-background">{props.children}</main>
		</>
	);
};
