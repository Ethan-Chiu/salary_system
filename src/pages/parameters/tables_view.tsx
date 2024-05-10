import React, { useContext, useEffect, useState, type ComponentType } from "react";
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
	type LucideIcon,
	Table,
	TrendingUp,
	Users,
} from "lucide-react";
import DataTableContextProvider from "./components/context/data_table_context_provider";
import dataTableContext from "./components/context/data_table_context";
import { getTableName } from "./components/context/data_table_enum";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
	type ParameterTableEnum,
	ParameterTableEnumValues,
} from "./parameter_tables";
import periodContext from "~/components/context/period_context";
import { LevelRangeTable } from "./tables/level_range_table";
import { LevelTable } from "./tables/level_table";
import { PerformanceLevelTable } from "./tables/performance_level_table";

export type TableComponentProps = {
	period_id: number;
	globalFilter?: string;
};

type TableComponent = {
	component: ComponentType<TableComponentProps>;
	icon: LucideIcon;
};

function getTableComponent(
	table: ParameterTableEnum,
): TableComponent {
	switch (table) {
		case "TableAttendance":
			return {
				component: AttendanceTable,
				icon: Clock,
			};
		case "TableBankSetting":
			return {
				component: BankTable,
				icon: CreditCard,
			};
		case "TableInsurance":
			return {
				component: InsuranceRateTable,
				icon: ActivitySquare,
			};
		case "TableBonusSetting":
			return {
				component: BonusTable,
				icon: CircleDollarSign,
			};
		case "TableBonusDepartment":
			return {
				component: BonusDepartmentTable,
				icon: Users,
			};
		case "TableBonusPosition":
			return {
				component: BonusPositionTable,
				icon: Briefcase,
			};
		case "TableBonusPositionType":
			return {
				component: BonusPositionTypeTable,
				icon: Key,
			};
		case "TableBonusSeniority":
			return {
				component: BonusSeniorityTable,
				icon: Cake,
			};
		case "TableLevelRange":
			return {
				component: LevelRangeTable,
				icon: Table,
			};
		case "TableLevel":
			return {
				component: LevelTable,
				icon: Table,
			};
		case "TablePerformanceLevel":
			return {
				component: PerformanceLevelTable,
				icon: TrendingUp,
			};
		default:
			throw new Error(`Invalid table`);
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

	const tableComponentMap: Record<ParameterTableEnum, TableComponent> =
		ParameterTableEnumValues.reduce((map, table) => {
			map[table] = getTableComponent(table);
			return map;
		}, {} as Record<ParameterTableEnum, TableComponent>);

	useEffect(() => {
		setSelectedTableType(selectedTag);
	}, [selectedTag, setSelectedTableType]);

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
			{ParameterTableEnumValues.filter(
				(table) => table === selectedTableType
			).map((selectedTableType) => {
				return (
					<div key={selectedTableType} className="flex h-full">
						{selectedPeriod ? React.createElement<TableComponentProps>(
							getTableComponent(selectedTableType).component,
							{ period_id: selectedPeriod.period_id }
						) : <p>Please select a period first</p>}
					</div>
				);
			})}
		</>
	);
}
