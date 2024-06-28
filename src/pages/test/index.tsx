import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { OvertimeTable } from "./test_overtime";


const TEST: NextPageWithLayout = () => {
	return <>
		<Header title="TEST" />
		<OvertimeTable />
	</>
};

TEST.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="check">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default TEST;
