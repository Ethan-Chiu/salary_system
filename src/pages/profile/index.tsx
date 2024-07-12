import { RootLayout } from "~/components/layout/root_layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { useTranslation } from "react-i18next";

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'

const ProfilePage: NextPageWithLayout = () => {
	const { t } = useTranslation(["common"]);
	return (
		<>
			<Header title={t("profile")} showOptions />
		</>
	);
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="profile">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default ProfilePage;

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return ({props: {
    ...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
  }});
};

