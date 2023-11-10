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
import * as LucideIcons from "lucide-react";
import LongHorizontalTable from "./LongHorizontalTable";
import { Button } from "~/components/ui/button";
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
	const [createForm, setCreateForm] = useState(0);

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
				const getAllAttendanceSetting =
					api.parameters.getAllAttendanceSetting.useQuery();
				const updateAttendanceSetting =
					api.parameters.updateAttendanceSetting.useMutation({
						onSuccess: () => {
							getAllAttendanceSetting.refetch();
						},
					});
				if (getAllAttendanceSetting.isFetched)
					return !createForm ? (
						<>
                            <p style={{fontSize: "20px",fontWeight: "bold",}}>
                                {"All Data"}
                            </p>
							{getAllAttendanceSetting.data?.map(
								(attendanceData, index) => (
									<div
                                        style={{cursor: "pointer"}}
										onClick={() => {
											setCreateForm(index + 1);
											console.log(attendanceData);
										}}
									>
										<LongHorizontalTable
											tableData={attendanceData}
										/>
									</div>
								)
							)}
						</>
					) : (
						<SingleParameterSettings
							formSchema={attendanceSchema(
								getAllAttendanceSetting.data![createForm - 1]
							)}
							original_data={
								getAllAttendanceSetting.data![createForm - 1]
							}
							updateFunction={(d: any) => {
								updateAttendanceSetting.mutate(d);
							}}
							returnPage={(n: number) => {
								setLoadData("");
								setCreateForm(0);
							}}
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
            <LucideIcons.ArrowLeft style={{cursor: "pointer"}} onClick={() => {setCreateForm(0);setLoadData("")}} />
            <br/>
			{loadData == "" ? <TableList /> : <SelectData />}
            <br/>
            <br/>
            <br/>
            
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
