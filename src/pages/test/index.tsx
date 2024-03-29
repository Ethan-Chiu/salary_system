import { NextPageWithLayout } from "../_app";
import { OvertimeTable } from "../functions/tables/overtime_table";
import { ReactElement } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { HolidayTable } from "../functions/tables/holiday_table";

const TEST: NextPageWithLayout = () => {
	return <HolidayTable period={113} />
};

TEST.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="check">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default TEST;