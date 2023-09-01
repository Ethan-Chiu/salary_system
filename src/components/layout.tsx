import Head from "next/head";
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "~/components/theme_provider";

export const RootLayout = (props: PropsWithChildren) => {
	return (
		<main className="w-full">
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{props.children}
			</ThemeProvider>
		</main>
	);
};
