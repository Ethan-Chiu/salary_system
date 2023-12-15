import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";

import { api } from "~/utils/api";

import { Accordion } from "~/components/ui/accordion";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { AttendanceTable } from "./tables/attendance_table";
import { BankTable } from "./tables/bank_table";
import { InsuranceRateTable } from "./tables/insurance_rate_table";
import { BonusTable } from "./tables/bonus_table";
import { BonusDepartmentTable } from "./tables/bonus_department_table";
import { BonusPositionTable } from "./tables/bonus_position_table";
import { BonusPositionTypeTable } from "./tables/bonus_position_type_table";
import { BonusSeniorityTable } from "./tables/bonus_seniority_table";

const PageParameters: NextPageWithLayout = () => {
	return (
		<>
			{/* header */}
			<Header title="parameters" showOptions />

			<Accordion type="single" collapsible className="w-full">
				<AttendanceTable index={0} globalFilter={""} />
				<BankTable index={1} globalFilter={""} />
				<InsuranceRateTable index={2} globalFilter={""} />
				<BonusTable index={3} globalFilter={""} />
				<BonusDepartmentTable index={4} globalFilter={""} />
				<BonusPositionTable index={5} globalFilter={""} />
				<BonusPositionTypeTable index={6} globalFilter={""} />
				<BonusSeniorityTable index={7} globalFilter={""} />
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
