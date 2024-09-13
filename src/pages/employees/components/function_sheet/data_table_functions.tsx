import { cn } from "~/lib/utils";
import { useState } from "react";
import {
	type LucideIcon,
	PenSquare,
	Plus,
	PlusSquare,
	RefreshCcw,
	Trash2,
} from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import {
	type TableEnum,
	getTableNameKey,
} from "~/pages/employees/components/context/data_table_enum";
import { EmployeeForm } from "./employee_form";
import { getSchema } from "~/pages/employees/schemas/get_schemas";
import { modeDescription } from "~/lib/utils/helper_function";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
}

export type FunctionMode =
	| "create"
	| "update"
	| "delete"
	| "auto_calculate"
	| "none";

export function DataTableFunctions({
	tableType,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const { t } = useTranslation(['common', 'nav']);

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Sheet open={open} onOpenChange={setOpen}>
				{/* Dropdown */}
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="ml-auto hidden h-8 lg:flex"
						>
							<PlusSquare className="cursor-pointer stroke-[1.5]" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[150px]">
						<DropdownMenuLabel>{t("others.functions")}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<CompTriggerItem
							mode={"update"}
							itemName={t("button.update")}
							icon={PenSquare}
						/>
						<CompTriggerItem
							mode={"create"}
							itemName={t("button.create")}
							icon={Plus}
						/>
						<CompTriggerItem
							mode={"delete"}
							itemName={t("button.delete")}
							icon={Trash2}
						/>
						<CompTriggerItem
							mode={"auto_calculate"}
							itemName={t("button.auto_calculate")}
							icon={RefreshCcw}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				<SheetContent className="w-[50%]">
					<SheetHeader>
						<SheetTitle>
							{`${t(`button.${mode}`)!}${t("button.form")} (${t(getTableNameKey(tableType))})`}
						</SheetTitle>
						<SheetDescription>
							{modeDescription(mode)}
						</SheetDescription>
					</SheetHeader>
					<ScrollArea className="h-[85%] w-full">
						<EmployeeForm
							formSchema={getSchema(tableType)!}
							mode={mode}
							closeSheet={() => setOpen(false)}
						/>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);

	function CompTriggerItem(props: {
		mode: FunctionMode;
		itemName: string;
		icon: LucideIcon;
	}) {
		return (
			<SheetTrigger
				className="w-full"
				onClick={() => {
					setMode(props.mode);
					setOpen(true);
				}}
			>
				<DropdownMenuItem className="cursor-pointer">
					<props.icon className="mr-2 h-4 w-4" />
					<span>{props.itemName}</span>
				</DropdownMenuItem>
			</SheetTrigger>
		);
	}
}
