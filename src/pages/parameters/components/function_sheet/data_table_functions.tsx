import { cn } from "~/lib/utils";
import { useState } from "react";
import { type LucideIcon, PenSquare, Plus, PlusSquare, Trash2, Copy } from "lucide-react";
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
import { ParameterForm } from "./parameter_form";
import { LevelBatchCreateForm } from "./level_batch_create_form";
import { type TableEnum, getTableNameKey } from "../context/data_table_enum";
import { getSchema } from "../../schemas/get_schemas";
import { api } from "~/utils/api";
import { z } from "zod";
import { type Level } from "~/server/database/entity/SALARY/level";
import { modeDescription } from "~/lib/utils/helper_function";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
}

export type FunctionMode = "create" | "batch_create" | "update" | "delete" | "none";

export function DataTableFunctions({
	tableType,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const { t } = useTranslation(['common', 'nav']);

	const { isLoading, isError, data, error } = api.parameters.getAllLevel.useQuery();

	// ========================= Additional Condition for Schema =====================================
	let schema = getSchema(tableType);
	if (tableType === "TableLevelRange") {
		if (isLoading || isError) {
			return <></>;
		}
		else {
			const levelOptions: Array<z.ZodLiteral<number>> =
				(data as Level[]).map((d: Level) => {
					return d.level;
				}).map((d: number) => z.literal(d));
			const levelDataAsTuple: readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]] = levelOptions as any as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]];
			const levelSchema = z.union(levelDataAsTuple);
			schema = schema.extend({
				level_start: levelSchema,
				level_end: levelSchema,
				start_date: zodRequiredDate("start_date"),
				// end_date: zodOptionalDate(),
			})
		}
	}

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
						<DropdownMenuLabel>{t("others.functions")}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<CompTriggerItem
							mode={"create"}
							itemName={t("button.create")}
							icon={Plus}
						/>
						{tableType == "TableLevel" && <CompTriggerItem
							mode={"batch_create"}
							itemName={t("button.batch_create")}
							icon={Copy}
						/>}
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
							{`${t(`button.${mode}`)!}${t("button.form")} (${t(getTableNameKey(tableType))})`}
						</SheetTitle>
						<SheetDescription>
							{modeDescription(t, mode)}
						</SheetDescription>
					</SheetHeader>
					{mode == "batch_create" ?
						<LevelBatchCreateForm
							formSchema={z.object({ content: z.array(schema) })}
							mode={mode}
							closeSheet={() => setOpen(false)}
						/>
						:
						<ScrollArea className="h-full w-full">
							<ParameterForm
								formSchema={schema}
								mode={mode}
								closeSheet={() => setOpen(false)}
							/>
							<ScrollBar orientation="horizontal" />
						</ScrollArea>
					}
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
