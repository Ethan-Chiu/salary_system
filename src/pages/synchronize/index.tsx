import { api } from "~/utils/api";
import { type NextPageWithLayout } from "../_app";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { useContext, type ReactElement } from "react";
import { LoadingSpinner } from "~/components/loading";
import { Header } from "~/components/header";
import { SyncPageContent } from "~/components/synchronize/sync_page_content";
import periodContext from "~/components/context/period_context";
import { FunctionsEnum } from "~/server/api/types/functions_enum";
import { Translate } from "~/lib/utils/translation";

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'


const PageCheckEHR: NextPageWithLayout = () => {
	return <SyncPage />;
};

function SyncPage() {
	const {selectedPeriod} = useContext(periodContext);
	if (selectedPeriod == null) {
		return <p>{Translate("Please select period first")}</p>;
	}

	const { isLoading, isError, data, error } =
		api.sync.checkEmployeeData.useQuery({
			func: FunctionsEnum.Enum.month_salary,
			// func: "month_salary",
			period: selectedPeriod.period_id,
		});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return data != null ? (
		<div className="flex h-full w-full flex-col">
			<Header title={Translate("synchronize")} showOptions className="mb-4" />
			<div className="mx-4 flex h-0 grow">
        <div className="w-full flex flex-col mb-4">
          <SyncPageContent data={data} />
        </div>
			</div>
		</div>
	) : (
		<div>{Translate("no data")}</div>
	);
}

PageCheckEHR.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="check">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageCheckEHR;

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return ({props: {
    ...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
  }});
};

