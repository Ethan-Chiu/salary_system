import { RootLayout } from "~/components/layout/root_layout";
import {
	CardFunction,
	CardFunctionIcon,
} from "~/components/functions/card_function";
import type { CardFunctionData } from "~/components/functions/card_function";
import { motion } from "framer-motion";
import { type NextPageWithLayout } from "../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { IconCoins } from "~/components/icons/svg_icons";
import { Header } from "~/components/header";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../table_names";
import { useState } from "react";
import { Table } from "lucide-react";
import LongHorizontalTable from "./LongHorizontalTable";
import { Button } from "~/components/ui/button";
import { create } from "domain";
import { SingleParameterSettings } from "./ParameterForm";
import { attendanceSchema } from "./Schemas/attendanceSchema";

export type TableData = {
	title: string;
	iconPath: string;
	subscript: string;
	createFunction: any;
	updateFunction: any;
	deleteFunction: any;
	data: any;
	schema: any;
};

const table_data: TableData[] = [
	{
		title: TABLE_NAMES.TABLE_ATTENDANCE,
		iconPath: "./icons/coins.svg",
		subscript: "Attendance data",
		createFunction: console.log("create"),
		updateFunction: console.log("update"),
		deleteFunction: console.log("delete"),
		data: {},
		schema: null,
	},
];

const container = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

const stagger = {
	hidden: { opacity: 0, y: -100 },
	visible: { opacity: 1, y: 0 },
};

const Modify: NextPageWithLayout = () => {
	const [loadData, setLoadData] = useState("");
	const [createForm, setCreateForm] = useState(false);
	function TableList() {
		return (
			<motion.div
				className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
				variants={container}
				initial="hidden"
				animate="visible"
			>
				{table_data.map((f_data: CardFunctionData, index) => (
					<motion.div
						key={f_data.title}
						variants={stagger}
						className="cursor-pointer"
					>
						<div
							onClick={() => {
								console.log("click");
								setLoadData(f_data.title);
							}}
						>
							<CardFunction
								title={f_data.title}
								iconPath={f_data.iconPath}
								subscript={f_data.subscript}
							>
								<CardFunctionIcon className="text-foreground">
									<IconCoins />
								</CardFunctionIcon>
							</CardFunction>
						</div>
					</motion.div>
				))}
			</motion.div>
		);
	}

	function SelectData() {
		switch (loadData) {
			case TABLE_NAMES.TABLE_ATTENDANCE:
				const getAttendanceSetting = api.parameters.getAttendanceSetting.useQuery();
				const updateAttendanceSetting =
					api.parameters.updateAttendanceSetting.useMutation({
						onSuccess: () => {
							getAttendanceSetting.refetch();
						},
					});
				if (getAttendanceSetting.isFetched)
					return !createForm ? (
						<div
							onClick={() => {
								setCreateForm(true);
								console.log(getAttendanceSetting.data);
							}}
						>
							<LongHorizontalTable
								tableData={getAttendanceSetting.data}
							/>
						</div>
					) : (
						<SingleParameterSettings
							formSchema={attendanceSchema(
								getAttendanceSetting.data
							)}
							original_data={getAttendanceSetting.data}
							updateFunction={
                                (d:any) => {
                                    updateAttendanceSetting.mutate(d)
                                }
                            }
						/>
					);
				break;
			default:
				break;
		}
		return <></>;
	}

	return (
		<>
			<Header title="Parameter Settings" showOptions className="mb-4" />
			{loadData == "" ? <TableList /> : <SelectData />}
		</>
	);
};

Modify.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="modify">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Modify;
