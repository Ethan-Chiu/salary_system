import { api } from "~/utils/api";
import { type NextPageWithLayout } from "../_app";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { type ReactElement } from "react";
import { LoadingSpinner } from "~/components/loading";
import { Header } from "~/components/header";
import { SyncPageContent } from "~/components/synchronize/sync_page_content";
import { FunctionsEnum } from "~/server/service/sync_service";


const PageCheckEHR: NextPageWithLayout = () => {
	return <SyncPage period={115} />;
};

function SyncPage({ period }: { period: number }) {
	const { isLoading, isError, data, error } =
		api.sync.checkEmployeeData.useQuery({
			func: FunctionsEnum.Enum.month_salary,
			period: period,
		});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return data != null ? (
		<div className="flex h-full w-full flex-col">
			<Header title="Synchronize" showOptions className="mb-4" />
			<div className="mx-4 flex h-0 grow">
        <div className="w-full flex flex-col mb-4">
          <SyncPageContent data={data} />
        </div>
			</div>
		</div>
	) : (
		<div>no data</div>
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
