import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import { type NextPageWithLayout } from "../_app";
import React, { type ReactElement } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import TablesView from "./tables_view";
import { Translate } from "~/lib/utils/translation";

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'

const PageParameters: NextPageWithLayout = () => {
	return (
		<div className="flex h-screen flex-col">
			<Header title={Translate("parameters")} showOptions />

			<div className="m-4 h-0 grow rounded-md border-2">
				<TablesView />
			</div>
		</div>
	);
};

PageParameters.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="parameters">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageParameters;

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return ({props: {
    ...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
  }});
};

