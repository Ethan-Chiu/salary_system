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
import PeriodSelector from "~/components/period_selector";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { ToastAction } from "~/components/ui/toast";

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'

import { Translate } from "~/lib/utils/translation";

type FunctionLinkData = CardFunctionData & { url: string | null };

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
	const { selectedPeriod, selectedPayDate } = useContext(periodContext);
	const { toast } = useToast();
	const [open, setOpen] = useState(false);

  const { t } = useTranslation('common')
  
	return (
		<>
			<Header title={Translate("functions")} showOptions className="mb-4" />
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
							if (!selectedPeriod || !selectedPayDate) {
								toast({
									title: "period or payDate not selected",
									description:
										"Please select a period and paydate",
									action: (
										<ToastAction
											altText="Go to select period and paydate"
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


export const getServerSideProps = async ({ locale }: { locale: string }) => {
  console.log("locale", locale); 
  return ({props: {
    ...(await serverSideTranslations(locale, ["common"], i18n, locales)),
  }});
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
