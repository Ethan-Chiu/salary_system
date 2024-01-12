import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type NextPageWithLayout } from "../../_app";
import React, { useState, type ReactElement, useRef } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { AttendanceTable } from "~/pages/parameters/tables/attendance_table";
import { BankTable } from "~/pages/parameters/tables/bank_table";
import { InsuranceRateTable } from "~/pages/parameters/tables/insurance_rate_table";
import { BonusTable } from "~/pages/parameters/tables/bonus_table";
import { BonusDepartmentTable } from "~/pages/parameters/tables/bonus_department_table";
import { BonusPositionTable } from "~/pages/parameters/tables/bonus_position_table";
import { BonusPositionTypeTable } from "~/pages/parameters/tables/bonus_position_type_table";
import { BonusSeniorityTable } from "~/pages/parameters/tables/bonus_seniority_table";
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
	icon: LucideIcon;
};


export function CheckParameters () {
    const tables: TableComponent[] = [
		{
			tag: "請假加班",
			component: <AttendanceTable viewOnly/>,
			icon: Clock,
		},
		{
			tag: "銀行",
			component: <BankTable viewOnly/>,
			icon: CreditCard,
		},
		{
			tag: "勞健保費率",
			component: <InsuranceRateTable viewOnly/>,
			icon: ActivitySquare,
		},
		{
			tag: "獎金",
			component: <BonusTable viewOnly/>,
			icon: CircleDollarSign,
		},
		{
			tag: "獎金部門",
			component: <BonusDepartmentTable viewOnly/>,
			icon: Users,
		},
		{
			tag: "獎金職等",
			component: <BonusPositionTable viewOnly/>,
			icon: Briefcase,
		},
		{
			tag: "獎金職級",
			component: <BonusPositionTypeTable viewOnly/>,
			icon: Key,
		},
		{
			tag: "獎金年資",
			component: <BonusSeniorityTable viewOnly/>,
			icon: Cake,
		},
	];

	const [selectedTag, setSelectedTag] = useState<string>(tables[0]!.tag);

	return (
		<div className="flex h-screen flex-col">
			<div className="m-4 min-h-0 flex-grow rounded-md border-2">
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel defaultSize={15} minSize={10}>
						<div className="flex h-[48px] items-center justify-center text-lg">
							<div>Tables</div>
						</div>
						<Separator />
						<ScrollArea className="h-full">
							{tables.map((table) => (
								<div
									key={table.tag}
									className={cn(
										"m-2 flex items-center rounded-md border p-1 hover:bg-muted",
										table.tag === selectedTag && "bg-muted"
									)}
									onClick={() => setSelectedTag(table.tag)}
								>
									<table.icon
										size={18}
										className="ml-1 mr-2 flex-shrink-0 cursor-pointer"
									/>
									<div className="m-1 line-clamp-1">
										{table.tag}
									</div>
								</div>
							))}
						</ScrollArea>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel minSize={40}>
						{tables
							.filter((table) => table.tag === selectedTag)
							.map((t) => {
								return (
									<div key={t.tag} className="flex h-full">
										{React.cloneElement<TableComponentProps>(
											t.component,
											{}
										)}
									</div>
								);
							})}
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}