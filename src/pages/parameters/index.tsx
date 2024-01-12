import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type NextPageWithLayout } from "../_app";
import React, { useState, type ReactElement, useRef, useContext } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { AttendanceTable } from "./tables/attendance_table";
import { BankTable } from "./tables/bank_table";
import { InsuranceRateTable } from "./tables/insurance_rate_table";
import { BonusTable } from "./tables/bonus_table";
import { BonusDepartmentTable } from "./tables/bonus_department_table";
import { BonusPositionTable } from "./tables/bonus_position_table";
import { BonusPositionTypeTable } from "./tables/bonus_position_type_table";
import { BonusSeniorityTable } from "./tables/bonus_seniority_table";
import { cn } from "~/lib/utils";
import {
	ActivitySquare,
	Briefcase,
	Cake,
	CircleDollarSign,
	Clock,
	CreditCard,
	Key,
	LucideIcon,
	Users,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import DataTableContextProvider from "./components/context/data_table_context_provider";
import dataTableContext from "./components/context/data_table_context";
import TableEnum, {
	TableEnumValues,
	getTableName,
} from "./components/context/data_table_enum";
import TablesSelector from "./tables_selector";

enum FilterMode {
	Search,
	Select,
}

type TableComponentProps = {
	index: number;
	globalFilter: string;
};

export type TableComponent = {
	component: React.ReactElement<TableComponentProps>;
	icon: LucideIcon;
};

export type ShowTableEnum = Extract<
	TableEnum,
	(typeof ShowTableEnumValues)[number]
>;

export const ShowTableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableBonusSetting",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusPositionType",
	"TableBonusSeniority",
] as const;

export function getTableComponent(table: ShowTableEnum): TableComponent {
	switch (table) {
		case "TableAttendance":
			return {
				component: <AttendanceTable />,
				icon: Clock,
			};
		case "TableBankSetting":
			return {
				component: <BankTable />,
				icon: CreditCard,
			};
		case "TableInsurance":
			return {
				component: <InsuranceRateTable />,
				icon: ActivitySquare,
			};
		case "TableBonusSetting":
			return {
				component: <BonusTable />,
				icon: CircleDollarSign,
			};
		case "TableBonusDepartment":
			return {
				component: <BonusDepartmentTable />,
				icon: Users,
			};
		case "TableBonusPosition":
			return {
				component: <BonusPositionTable />,
				icon: Briefcase,
			};
		case "TableBonusPositionType":
			return {
				component: <BonusPositionTypeTable />,
				icon: Key,
			};
		case "TableBonusSeniority":
			return {
				component: <BonusSeniorityTable />,
				icon: Cake,
			};
		default:
			throw new Error(`Invalid table: ${table}`);
	}
}

const PageParameters: NextPageWithLayout = () => {
	return (
		<div className="flex h-screen flex-col">
			<Header title="parameters" showOptions />

			<div className="m-4 min-h-0 flex-grow rounded-md border-2">
				<DataTableContextProvider>
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel defaultSize={15} minSize={10}>
							<TablesSelector />
						</ResizablePanel>

						<ResizableHandle />
						<ResizablePanel minSize={40}>
							<CompTableView />
						</ResizablePanel>
					</ResizablePanelGroup>
				</DataTableContextProvider>
			</div>
		</div>
	);
};

function CompTableView() {
	const { selectedTable } = useContext(dataTableContext);

	return (
		<>
			{ShowTableEnumValues.filter((table) => table === selectedTable).map(
				(selectedTable) => {
					return (
						<div key={selectedTable} className="flex h-full">
							{React.cloneElement<TableComponentProps>(
								getTableComponent(selectedTable).component,
								{}
							)}
						</div>
					);
				}
			)}
		</>
	);
}

PageParameters.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="parameters">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageParameters;
