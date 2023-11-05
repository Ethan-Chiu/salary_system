import { usePathname } from "next/navigation";
import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { api } from "~/utils/api";

import { Checkbox } from "~/components/ui/checkbox"
import { Separator } from "~/components/ui/separator";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";

import { type NextPageWithLayout } from "../../_app";
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { type ReactElement, useRef, useState, useEffect, useMemo , CSSProperties} from "react";

import { DATA, createDATA } from "../tables/datatype";
import { BankTable, BankRow, createBankRow } from "../tables/bank_table";
import { ParameterTable, SettingItem, createSettingItem } from "../tables/parameter_table";

import { Translate } from "../utils/translation";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import FadeLoader from "react-spinners/FadeLoader";
import { BankForm } from "./form";


const PageParametersSettings: NextPageWithLayout = ({data}: any) => {
	console.log("this");
	console.log(data);
	return <>
		<Header title={"Parameters Settings"+(data?.table_name?" of "+data.table_name:"")} />
		<BankForm />
	</> 
};

PageParametersSettings.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="parameters settings">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageParametersSettings;

