import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type NextPageWithLayout } from "../_app";
import React, { useState, type ReactElement, useRef } from "react";
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

const PageParameters: NextPageWithLayout = () => {
	const tables: TableComponent[] = [
		{
			tag: "請假加班",
			component: <AttendanceTable />,
			icon: Clock,
		},
		{
			tag: "銀行",
			component: <BankTable />,
			icon: CreditCard,
		},
		{
			tag: "勞健保費率",
			component: <InsuranceRateTable />,
			icon: ActivitySquare,
		},
		{
			tag: "獎金",
			component: <BonusTable />,
			icon: CircleDollarSign,
		},
		{
			tag: "獎金部門",
			component: <BonusDepartmentTable />,
			icon: Users,
		},
		{
			tag: "獎金職等",
			component: <BonusPositionTable />,
			icon: Briefcase,
		},
		{
			tag: "獎金職級",
			component: <BonusPositionTypeTable />,
			icon: Key,
		},
		{
			tag: "獎金年資",
			component: <BonusSeniorityTable />,
			icon: Cake,
		},
	];

	const [selectedTag, setSelectedTag] = useState<string>(tables[0]!.tag);

	return (
		<div className="flex h-screen flex-col">
			<Header title="parameters" showOptions />
			<ResizablePanelGroup direction="horizontal" className="grow">
				<ResizablePanel defaultSize={15} minSize={10}>
					<ScrollArea className="h-full">
						{tables.map((table) => (
							<div
								key={table.tag}
								className={cn(
									"m-1 flex items-center rounded-md border p-1 hover:bg-muted",
									table.tag === selectedTag && "bg-muted"
								)}
								onClick={() => setSelectedTag(table.tag)}
							>
								<table.icon
									size={18}
									className="ml-1 mr-2 cursor-pointer"
								/>
								<div className="m-1 truncate">{table.tag}</div>
							</div>
						))}
					</ScrollArea>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>
					<ScrollArea className="h-full">
						<div className="m-1">
							{tables
								.filter((table) => table.tag === selectedTag)
								.map((t) => {
									return (
										<div key={t.tag}>
											{React.cloneElement<TableComponentProps>(
												t.component,
												{}
											)}
										</div>
									);
								})}
						</div>
					</ScrollArea>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
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
