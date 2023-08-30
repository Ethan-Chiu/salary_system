import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { Sidebar } from "~/components/sidebar";
import { api } from "~/utils/api";
import { UserAvatar } from "~/components/user_avatar";
import { CardFunction } from "~/components/functions/card_function";
import type { CardFunctionData } from "~/components/functions/card_function";
import { motion } from "framer-motion";

const function_data: CardFunctionData[] = [
	{
		title: "計算月薪",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "計算年薪",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "計算分紅",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "計算津貼",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
];

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

export default function Home() {
	// const hello = api.example.hello.useQuery({ text: "from tRPC" });

	return (
		<PageLayout>
			<Head>
				<title>Create T3 App</title>
				<meta name="description" content="Salary system" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen bg-background">
				<div className="grid min-h-screen lg:grid-cols-5">
					<Sidebar className="hidden lg:block lg:border-border" />
					<div className="col-span-3 lg:col-span-4 lg:border-l">
						<div className="flex h-14 px-4">
							<div className="ml-auto flex items-center space-x-4">
								<UserAvatar />
							</div>
						</div>
						<div className="h-full px-4 py-6 lg:px-8">
							Main page: Functions
							<motion.div
								className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
								variants={container}
								initial="hidden"
								animate="visible"
							>
								{function_data.map(
									(f_data: CardFunctionData) => (
										<motion.div
											key={f_data.title}
											variants={stagger}
										>
											<CardFunction
												title={f_data.title}
												iconPath={f_data.iconPath}
												subscript={f_data.subscript}
											/>
										</motion.div>
									)
								)}
							</motion.div>
						</div>
					</div>
				</div>
			</main>
		</PageLayout>
	);
}
