import React, { useContext, useEffect, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
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
import DataTableContextProvider from "./components/context/data_table_context_provider";
import dataTableContext from "./components/context/data_table_context";
import { getTableName } from "./components/context/data_table_enum";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ParameterTableEnum, ParameterTableEnumValues } from "./parameter_tables";
import periodContext from "~/components/context/period_context";
import { Period } from "~/server/database/entity/UMEDIA/period";

type TableComponentProps = {
	index: number;
	globalFilter: string;
};

type TableComponent = {
	component: React.ReactElement<TableComponentProps>;
	icon: LucideIcon;
};

function getTableComponent(table: ParameterTableEnum, selectedPeriod: Period | null): TableComponent {
	switch (table) {
		case "TableAttendance":
			return {
				component: selectedPeriod ? <AttendanceTable period_id={selectedPeriod.period_id} /> : <p>Please select period first</p>,
				icon: Clock,
			};
		case "TableBankSetting":
			return {
				component: selectedPeriod ? <BankTable period_id={selectedPeriod.period_id} /> : <p>Please select period first</p>,
				icon: CreditCard,
			};
		case "TableInsurance":
			return {
				component: selectedPeriod ? <InsuranceRateTable period_id={selectedPeriod.period_id} /> : <p>Please select period first</p>,
				icon: ActivitySquare,
			};
		case "TableBonusSetting":
			return {
				component: selectedPeriod ? <BonusTable period_id={selectedPeriod.period_id} /> : <p>Please select period first</p>,
				icon: CircleDollarSign,
			};
		case "TableBonusDepartment":
			return {
				component: selectedPeriod ? <BonusDepartmentTable period_id={selectedPeriod.period_id} /> : <p>Please select period first</p>,
				icon: Users,
			};
		case "TableBonusPosition":
			return {
				component: selectedPeriod ? <BonusPositionTable period_id={selectedPeriod.period_id} /> : <p>Please select period first</p>,
				icon: Briefcase,
			};
		case "TableBonusPositionType":
			return {
				component: selectedPeriod ? <BonusPositionTypeTable period_id={selectedPeriod.period_id} /> : <p>Please select period first</p>,
				icon: Key,
			};
		case "TableBonusSeniority":
			return {
				component: selectedPeriod ? <BonusSeniorityTable period_id={selectedPeriod.period_id} /> : <p>Please select period first</p>,
				icon: Cake,
			};
		default:
			throw new Error(`Invalid table: ${table}`);
	}
}

export default function TablesView() {
	return (
		<DataTableContextProvider>
			<ResizablePanelGroup direction="horizontal">
				{/* left panel */}
				<ResizablePanel defaultSize={15} minSize={10}>
					<CompTablesSelector />
				</ResizablePanel>
				<ResizableHandle />
				{/* right panel */}
				<ResizablePanel minSize={40}>
					<CompTableView />
				</ResizablePanel>
			</ResizablePanelGroup>
		</DataTableContextProvider>
	);
}

function CompTablesSelector() {
	const [selectedTag, setSelectedTag] = useState<ParameterTableEnum>(
		ParameterTableEnumValues[0]
	);

	const { setSelectedTableType } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);

	const tableComponentMap: Record<ParameterTableEnum, TableComponent> =
		ParameterTableEnumValues.reduce((map, table) => {
			map[table] = getTableComponent(table, selectedPeriod);
			return map;
		}, {} as Record<ParameterTableEnum, TableComponent>);

	useEffect(() => {
		setSelectedTableType(selectedTag);
	}, [selectedTag]);

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-[48px] items-center justify-center text-lg">
				<div>Tables</div>
			</div>
			<Separator />
			<div className="h-0 grow">
				<ScrollArea className="h-full">
					{ParameterTableEnumValues.map((table) => {
						const tableComponent = tableComponentMap[table];

						return (
							<div
								key={table}
								className={cn(
									"m-2 flex items-center rounded-md border p-1 hover:bg-muted",
									table === selectedTag && "bg-muted"
								)}
								onClick={() => {
									setSelectedTag(table);
								}}
							>
								<tableComponent.icon
									size={18}
									className="ml-1 mr-2 flex-shrink-0 cursor-pointer"
								/>
								<div className="m-1 line-clamp-1 break-all">
									{getTableName(table)}
								</div>
							</div>
						);
					})}
				</ScrollArea>
			</div>
		</div>
	);
}

function CompTableView() {
	const { selectedTableType } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);

	return (
		<>
			{ParameterTableEnumValues.filter((table) => table === selectedTableType).map(
				(selectedTableType) => {
					return (
						<div key={selectedTableType} className="flex h-full">
							{React.cloneElement<TableComponentProps>(
								getTableComponent(selectedTableType, selectedPeriod).component,
								{}
							)}
						</div>
					);
				}
			)}
		</>
	);
}
