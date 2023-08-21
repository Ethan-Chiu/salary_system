import type { PropsWithChildren } from "react";
import { ThemeProvider } from "~/components/theme-provider"

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="w-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {props.children}
        </ThemeProvider>
    </main>
  );
};