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
import { useContext } from "react";
import periodContext from "~/components/context/period_context";
import { useToast } from "~/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

type FunctionLinkData = (CardFunctionData & {url: string | null});

const function_data: FunctionLinkData[] = [
	{
		title: "月薪",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
    url: "/functions/month_salary",
	},
	{
		title: "15日外勞獎金",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
    url: "/functions/month_salary",
	},
	{
		title: "持股信託",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
    url: null,
	},
	{
		title: "季獎金",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
    url: null,
	},
	{
		title: "員工分紅",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
    url: null,
	},
];

const PageHome: NextPageWithLayout = () => {
	const router = useRouter();
  const { selectedPeriod } = useContext(periodContext);
	const { toast } = useToast();

	return (
		<>
			<Header title="functions" showOptions className="mb-4" />
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
                    <ToastAction altText="Go to select period">Select</ToastAction>
                  ),
                });
              } else {
                void router.push(f_data.url ?? "/functions")
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

PageHome.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="functions">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageHome;

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
