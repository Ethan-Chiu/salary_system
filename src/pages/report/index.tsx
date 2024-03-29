import { RootLayout } from "~/components/layout/root_layout";
import {
	CardFunction,
	CardFunctionIcon,
} from "~/components/functions/card_function";
import type { CardFunctionData } from "~/components/functions/card_function";
import { motion } from "framer-motion";
import { type NextPageWithLayout } from "../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { IconCoins } from "~/components/icons/svg_icons";
import { Header } from "~/components/header";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import periodContext from "~/components/context/period_context";
import { useToast } from "~/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import PeriodSelector from "~/components/period_selector";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import PeriodContextProvider from "~/components/context/period_context_provider";

type FunctionLinkData = CardFunctionData & { url: string | null };

const function_data: FunctionLinkData[] = [
	{
		title: "薪資異動檔",
		iconPath: "./icons/coins.svg",
		subscript: "salary report",
		url: "/report/salary",
	},
];

const ReportHomePage: NextPageWithLayout = () => {
	const router = useRouter();
	const { selectedPeriod } = useContext(periodContext);
	const { toast } = useToast();
	const [open, setOpen] = useState(false);

	return (
		<>
			<Header title="functions" showOptions className="mb-4" />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<PeriodSelector />
				</DialogContent>
			</Dialog>
			<motion.div
				className="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
				variants={container}
				initial="hidden"
				animate="visible"
			>
				{function_data.map((f_data: FunctionLinkData) => (
					<motion.div
						key={f_data.title}
						variants={stagger}
						className="cursor-pointer"
						onClick={() => {
							if (!selectedPeriod) {
								toast({
									title: "No period selected",
									description: "Please select a period",
									action: (
										<ToastAction
											altText="Go to select period"
											onClick={() => {
												setOpen(true);
											}}
										>
											Select
										</ToastAction>
									),
								});
							} else {
								void router.push(f_data.url ?? "/functions");
							}
						}}
					>
						<CardFunction
							title={f_data.title}
							iconPath={f_data.iconPath}
							subscript={f_data.subscript}
						>
							<CardFunctionIcon className="text-foreground">
								<IconCoins />
							</CardFunctionIcon>
						</CardFunction>
					</motion.div>
				))}
			</motion.div>
		</>
	);
};

ReportHomePage.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="reports">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default ReportHomePage;

const container = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

const stagger = {
	hidden: { opacity: 0, y: -100 },
	visible: { opacity: 1, y: 0 },
};