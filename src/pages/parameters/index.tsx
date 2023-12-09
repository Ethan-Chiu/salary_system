import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";

import { api } from "~/utils/api";

import { Accordion } from "~/components/ui/accordion";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { AttendanceTable } from "./tables/attendance_table";

const PageParameters: NextPageWithLayout = () => {
	return (
		<>
			{/* header */}
			<Header title="parameters" showOptions />

			<Accordion type="single" collapsible className="w-full">
				<AttendanceTable
					index={0}
					globalFilter={""}
				/>
			</Accordion>
		</>
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
