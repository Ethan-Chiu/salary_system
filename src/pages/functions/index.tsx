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

const function_data: CardFunctionData[] = [
	{
		title: "月薪",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "15日外勞獎金",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "持股信託",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "季獎金",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "員工分紅",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
];

let routerMap = new Map();
routerMap.set("月薪", "/functions/month_salary");
routerMap.set("15日外勞獎金", "/functions/month_salary");

const PageHome: NextPageWithLayout = () => {
	const router = useRouter();
	return (
		<>
			<Header title="functions" showOptions className="mb-4" />
			<motion.div
				className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
				variants={container}
				initial="hidden"
				animate="visible"
			>
				{function_data.map((f_data: CardFunctionData) => (
					<motion.div
						key={f_data.title}
						variants={stagger}
						className="cursor-pointer"
						onClick={() => router.push(routerMap.get(f_data.title))}
					>
						<CardFunction
							title={f_data.title}
							iconPath={f_data.iconPath}
							subscript={f_data.subscript}
						>
							<CardFunctionIcon className="text-foreground">
								{IconCoins()}
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
