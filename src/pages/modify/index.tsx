import { RootLayout } from "~/components/layout/root_layout";
import { CardFunction, CardFunctionIcon, CardFunctionData } from "~/components/functions/card_function";
import { motion } from "framer-motion";
import { type NextPageWithLayout } from "../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { IconCoins, IconCreditCard } from "~/components/icons/svg_icons";
import { Header } from "~/components/header";
// import * as TABLE_NAMES from "../table_names";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from 'next/router';
import * as Icon from "~/components/icons/svg_icons"
import { Translate } from "../../lib/utils/translation";

export type TableData = {
	title: string;
	icon: React.ReactElement;
	subscript: string;
	navLink: string;
};



const Modify: NextPageWithLayout = () => {

	const table_data: TableData[] = [
		{
			title: Translate("attendanceSetting"),
			icon: Icon.IconClock(6),
			subscript: "Attendance data",
			navLink: "/modify/attendance",
		},
		{
			title: Translate("bankSetting"),
			icon: Icon.IconCreditCard(6),
			subscript: "Bank setting",
			navLink: "/modify/bank",
		},
		{
			title: Translate("insuranceRateSetting"),
			icon: Icon.IconShieldCheck(6),
			subscript: "Insurance setting",
			navLink: "/modify/insurance",
		},
		{
			title: Translate("bonusSetting"),
			icon: Icon.IconDollar(6),
			subscript: "Bonus setting",
			navLink: "/modify/bonusSetting",
		},
		{
			title: Translate("bonusDepartmentSetting"),
			icon: Icon.IconUsers(6),
			subscript: "Bonus Department setting",
			navLink: "/modify/bonusDepartment",
		},
		{
			title: Translate("bonusPositionSetting"),
			icon: Icon.IconBriefcase(6),
			subscript: "Bonus Position setting",
			navLink: "/modify/bonusPosition",
		},
		{
			title: Translate("bonusPositionTypeSetting"),
			icon: Icon.IconKey(6),
			subscript: "Bonus Position Type setting",
			navLink: "/modify/bonusPositionType",
		},
		{
			title: Translate("bonusSenioritySetting"),
			icon: Icon.IconCake(7),
			subscript: "Bonus Seniority setting",
			navLink: "/modify/bonusSeniority",
		},
		{
			title: Translate("level"),
			icon: Icon.IconCake(7),
			subscript: "Level setting",
			navLink: "/modify/level",
		},
		{
			title: Translate("levelRange"),
			icon: Icon.IconCake(7),
			subscript: "Level Range setting",
			navLink: "/modify/levelRange",
		},
		{
			title: Translate("performanceLevel"),
			icon: Icon.IconCake(7),
			subscript: "Performance Level setting",
			navLink: "/modify/performanceLevel",
		},
		{
			title: Translate("trustMoney"),
			icon: Icon.IconCake(7),
			subscript: "Trust Money setting",
			navLink: "/modify/trustMoney",
		},
	];



	const pathname = usePathname();
	const router = useRouter();

	function TableList() {
		return (
			<>
			<motion.div
				className="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
				variants={container}
				initial="hidden"
				animate="visible"
			>
				{table_data.map((f_data: TableData, index: number) => (
						<motion.div
							onClick={() => router.push(f_data.navLink)}
							key={f_data.title}
							variants={stagger}
							className="cursor-pointer"
						>
								<CardFunction
									title={f_data.title}
									subscript={f_data.subscript}
								>
									<CardFunctionIcon className="text-foreground">
										{f_data.icon}
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