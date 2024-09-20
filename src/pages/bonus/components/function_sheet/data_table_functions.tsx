import { cn } from "~/lib/utils";
import { useContext, useState } from "react";
import {
	type LucideIcon,
	PenSquare,
	Plus,
	PlusSquare,
	Trash2,
	Copy,
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
import { BonusForm } from "./bonus_form";
import { type TableEnum, getTableNameKey } from "../context/data_table_enum";
import { getSchema } from "../../schemas/get_schemas";
import { modeDescription } from "~/lib/utils/helper_function";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

import z from "zod";
import { BonusWorkTypeBatchCreateForm } from "./batch_create_form/bonus_work_type_batch_create_form";
import { BonusDepartmentBatchCreateForm } from "./batch_create_form/bonus_department_batch_create_form";
import { BonusPositionBatchCreateForm } from "./batch_create_form/bonus_position_batch_create_form";
import { BonusPositionTypeBatchCreateForm } from "./batch_create_form/bonus_position_type_batch_create_form";
import { BonusSeniorityBatchCreateForm } from "./batch_create_form/bonus_seniority_batch_create_form";


interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
	bonusType: BonusTypeEnumType;
}

export type FunctionMode =
	| "create"
	| "batch_create"
	| "update"
	| "delete"
	| "none";

export function DataTableFunctions({
	tableType,
	bonusType,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const { t } = useTranslation(["common", "nav"]);

	// ========================= Additional Condition for Schema =====================================
	let schema = getSchema(tableType);

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
					<DropdownMenuContent align="end" className="w-[120px]">
						<DropdownMenuLabel>
							{t("others.functions")}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<CompTriggerItem
							mode={"create"}
							itemName={t("button.create")}
							icon={Plus}
						/>
						<CompTriggerItem
							mode={"batch_create"}
							itemName={t("button.batch_create")}
							icon={Copy}
						/>
						<CompTriggerItem
							mode={"update"}
							itemName={t("button.update")}
							icon={PenSquare}
						/>
						<CompTriggerItem
							mode={"delete"}
							itemName={t("button.delete")}
							icon={Trash2}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				<SheetContent className="w-[50%]">
					<SheetHeader>
						<SheetTitle>
							{`${t(`button.${mode}`)!}${t("button.form")} (${t(
								getTableNameKey(tableType)
							)})`}
						</SheetTitle>
						<SheetDescription>
							{modeDescription(t, mode)}
						</SheetDescription>
					</SheetHeader>

					{mode == "batch_create" ? (
						<BatchCreateForm 
							bonusType={bonusType}
							tableType={tableType} 
							schema={schema}
							setOpen={setOpen}
						/>
					) : (
						<ScrollArea className="h-full w-full">
							<BonusForm
								formSchema={schema}
								mode={mode}
								bonus_type={bonusType}
								closeSheet={() => setOpen(false)}
							/>
							<ScrollBar orientation="horizontal" />
						</ScrollArea>
					)}
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

function BatchCreateForm({ tableType, bonusType, schema, setOpen }: { tableType: TableEnum, bonusType: BonusTypeEnumType, schema: any, setOpen: (open: boolean) => void }) {
	const mode = "batch_create";
	if (tableType == "TableBonusWorkType") return <BonusWorkTypeBatchCreateForm
		bonusType={bonusType}
		formSchema={z.object({ content: z.array(schema) })}
		mode={mode}
		closeSheet={() => setOpen(false)}
	/>;
	if (tableType == "TableBonusDepartment") return <BonusDepartmentBatchCreateForm
		bonusType={bonusType}
		formSchema={z.object({ content: z.array(schema) })}
		mode={mode}
		closeSheet={() => setOpen(false)}
	/>;
	if (tableType == "TableBonusPosition") return <BonusPositionBatchCreateForm
		bonusType={bonusType}
		formSchema={z.object({ content: z.array(schema) })}
		mode={mode}
		closeSheet={() => setOpen(false)}
	/>;
	if (tableType == "TableBonusPositionType") return <BonusPositionTypeBatchCreateForm
		bonusType={bonusType}
		formSchema={z.object({ content: z.array(schema) })}
		mode={mode}
		closeSheet={() => setOpen(false)}
	/>;
	if (tableType == "TableBonusSeniority")  return <BonusSeniorityBatchCreateForm
		bonusType={bonusType}
		formSchema={z.object({ content: z.array(schema) })}
		mode={mode}
		closeSheet={() => setOpen(false)}
	/>;
}
