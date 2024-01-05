import { RootLayout } from "~/components/layout/root_layout";
import { CardFunction, CardFunctionIcon, CardFunctionData } from "~/components/functions/card_function";
import { motion } from "framer-motion";
import { type NextPageWithLayout } from "../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { IconCoins, IconCreditCard } from "~/components/icons/svg_icons";
import { Header } from "~/components/header";
import * as TABLE_NAMES from "../table_names";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from 'next/router';
import * as Icon from "~/components/icons/svg_icons"

import { changePasswordForm } from "../settings/components/changePassword";
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { getServerSession } from "next-auth";
import { getServerAuthSession } from "~/server/auth";


const Test: NextPageWithLayout = () => {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<>
			<Header title="Setting/Account" showOptions className="mb-4" />
			{
				
			}
			{changePasswordForm()}
		</>
	);
};

Test.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<RootLayout>
				{/* <PerpageLayout pageTitle="Test">{page}</PerpageLayout> */}
				<PerpageLayoutNav pageTitle="Test">{page}</PerpageLayoutNav>
			</RootLayout>
		</>
	);
};

export default Test;

