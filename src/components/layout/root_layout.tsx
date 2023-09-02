import type { PropsWithChildren } from "react";
import { ThemeProvider } from "~/components/theme_provider";
import { Toaster } from "~/components/ui/toaster"

export const RootLayout = (props: PropsWithChildren) => {
	return (
		<main className="w-full">
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{props.children}
			</ThemeProvider>
			<Toaster />
		</main>
	);
};
