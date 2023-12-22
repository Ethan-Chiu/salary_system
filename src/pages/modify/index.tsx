import { RootLayout } from "~/components/layout/root_layout";
import { CardFunction, CardFunctionIcon, CardFunctionData } from "~/components/functions/card_function";
import { motion } from "framer-motion";
import { type NextPageWithLayout } from "../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { IconCoins } from "~/components/icons/svg_icons";
import { Header } from "~/components/header";
import * as TABLE_NAMES from "../table_names";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from 'next/router';

export type TableData = {
	title: string;
	iconPath: string;
	subscript: string;
	navLink: string;
};

const table_data: TableData[] = [
	{
		title: TABLE_NAMES.TABLE_ATTENDANCE,
		iconPath: "./icons/coins.svg",
		subscript: "Attendance data",
		navLink: "/modify/attendance",
	},
	{
		title: TABLE_NAMES.TABLE_BANK_SETTING,
		iconPath: "./icons/coins.svg",
		subscript: "Bank setting",
		navLink: "/modify/bank",
	},
	{
		title: TABLE_NAMES.TABLE_INSURANCE,
		iconPath: "./icons/coins.svg",
		subscript: "Insurance setting",
		navLink: "/modify/insurance",
	},
];



const Modify: NextPageWithLayout = () => {
	const pathname = usePathname();
	const router = useRouter();

	function TableList() {
		return (
			<>
			<motion.div
				className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
				variants={container}
				initial="hidden"
				animate="visible"
			>
				{table_data.map((f_data: TableData, index) => (
						<motion.div
							onClick={() => router.push(f_data.navLink)}
							key={f_data.title}
							variants={stagger}
							className="cursor-pointer"
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
	}

	return (
		<>
			<Header title="Parameter Settings" showOptions className="mb-4" />
			<TableList />
		</>
	);
};

Modify.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="modify">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Modify;



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