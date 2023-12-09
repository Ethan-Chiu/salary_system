import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { api } from "~/utils/api";

import { Accordion } from "~/components/ui/accordion";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { ParameterTable } from "./tables/parameter_table";
import { DATA } from "../develop_parameters/tables/datatype";

export type SettingItem = {
	name: string;
	// type: "boolean" | "list" | "number" | "input"
	value: number | string;
	status: "pending" | "processing" | "success" | "failed";
};

let datas: DATA[] = [
	{
		table_name: "請假加班",
		table_type: "typical",
		table_content: [],
	},
]

const PageParameters: NextPageWithLayout = () => {
	const getAttendanceSetting = api.parameters.getCurrentAttendanceSetting.useQuery();

	return (
		<>
			{/* header */}
			<Header title="parameters" showOptions />

			<Accordion type="single" collapsible className="w-full">
				<ParameterTable
					defaultData={datas[0]?.table_content}
					table_name={datas[0]?.table_name}
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
