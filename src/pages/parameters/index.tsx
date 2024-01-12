import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import { type NextPageWithLayout } from "../_app";
import React, { type ReactElement } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import TablesView from "./tables_view";

const PageParameters: NextPageWithLayout = () => {
	return (
		<div className="flex h-screen flex-col">
			<Header title="parameters" showOptions />

			<div className="m-4 min-h-0 flex-grow rounded-md border-2">
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
