import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";

import { api } from "~/utils/api";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { type NextPageWithLayout } from "../_app";
import React, { useState, type ReactElement } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { AttendanceTable } from "./tables/attendance_table";
import { BankTable } from "./tables/bank_table";
import { InsuranceRateTable } from "./tables/insurance_rate_table";
import { BonusTable } from "./tables/bonus_table";
import { BonusDepartmentTable } from "./tables/bonus_department_table";
import { BonusPositionTable } from "./tables/bonus_position_table";
import { BonusPositionTypeTable } from "./tables/bonus_position_type_table";
import { BonusSeniorityTable } from "./tables/bonus_seniority_table";
import { Input } from "~/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import { MultiSelect } from "./components/multi_select";

enum FilterMode {
	Search,
	Select,
}

type TableComponentProps = {
	index: number;
	globalFilter: string;
};

type TableComponent = {
	tag: string;
	component: React.ReactElement<TableComponentProps>;
};

const PageParameters: NextPageWithLayout = () => {
	const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.Search);
	const [filterTableDisable, setFilterTableDisable] = useState(false);

	const [globalFilterInput, setGlobalFilterInput] = useState("");
	const [filterInput, setFilterInput] = useState("");
	const [selected, setSelected] = useState<string[]>([]);

	const tables: TableComponent[] = [
		{
			tag: "請假加班",
			component: <AttendanceTable />,
		},
		{
			tag: "銀行",
			component: <BankTable />,
		},
		{
			tag: "勞健保費率",
			component: <InsuranceRateTable />,
		},
		{
			tag: "獎金",
			component: <BonusTable />,
		},
		{
			tag: "獎金部門",
			component: <BonusDepartmentTable />,
		},
		{
			tag: "獎金職等",
			component: <BonusPositionTable />,
		},
		{
			tag: "獎金職級",
			component: <BonusPositionTypeTable />,
		},
		{
			tag: "獎金年資",
			component: <BonusSeniorityTable />,
		},
	];

	return (
		<>
			{/* header */}
			<Header title="parameters" showOptions />

			{/* top search bar */}
			<div className="grid grid-cols-7 items-center gap-4 py-4">
				<div className="col-span-4 text-center">
					{filterMode === FilterMode.Search ? (
						<Input
							className="max-w-sm"
							placeholder="Filter tables"
							disabled={filterTableDisable}
							onChange={(event) => {
								setFilterInput(event.target.value);
							}}
						/>
					) : (
						<MultiSelect
							options={tables.map((t) => {
								return { label: t.tag, value: t.tag };
							})}
							onChange={setSelected}
						/>
					)}
				</div>
				<ArrowUpDown
					className="ml-2 h-5 w-5 cursor-pointer hover:text-gray-500"
					onClick={() => {
						setFilterMode((mode) => {
							return mode === FilterMode.Search
								? FilterMode.Select
								: FilterMode.Search;
						});
					}}
				/>
				<div className="col-span-2 text-center">
					<Input
						placeholder="Find Parameter"
						onChange={(e) => {
							setFilterTableDisable(e.target.value !== "");
							setGlobalFilterInput(e.target.value);
						}}
					/>
				</div>
			</div>

			<Accordion type="single" collapsible className="w-full">
				{tables.map((table, index) => {
					if (
						(filterMode === FilterMode.Search &&
							table.tag.includes(filterInput)) ||
						(filterMode === FilterMode.Select &&
							selected.includes(table.tag))
					) {
						return (
							<AccordionItem
								key={table.tag}
								value={"item-" + index.toString()}
							>
								<AccordionTrigger>{table.tag}</AccordionTrigger>
								<AccordionContent>
									{React.cloneElement<TableComponentProps>(
										table.component,
										{
											index: index,
											globalFilter: globalFilterInput,
										}
									)}
								</AccordionContent>
							</AccordionItem>
						);
					}
					return <div key={table.tag}></div>;
				})}
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
