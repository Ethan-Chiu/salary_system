import { cn } from "~/lib/utils";
import { useState } from "react";
import { LucideIcon, PenSquare, Plus, PlusSquare, Trash2 } from "lucide-react";
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
import { Translate } from "~/lib/utils/translation";
import { ParameterForm } from "./parameter_form";
import { TableEnum, getTableName } from "../context/data_table_enum";
import { getSchema } from "../../schemas/get_schemas";
import { api } from "~/utils/api";
import { z } from "zod";
import { Level } from "~/server/database/entity/SALARY/level";
import { modeDescription } from "~/lib/utils/helper_function";
import { literal } from "sequelize";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
}

export type FunctionMode = "create" | "update" | "delete" | "none";

export function DataTableFunctions({
	tableType,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

	const { isLoading, isError, data, error } =
		(tableType === "TableLevelRange") ? api.parameters.getCurrentLevel.useQuery()
			: { isLoading: false, isError: false, data: { data: [] }, error: null };

	// ========================= Additional Condition for Schema =====================================
	let schema = getSchema(tableType);
	if (tableType === "TableLevelRange") {
		if (isLoading || isError) {
			return <></>;
		}
		else {
			const levelOptions: Array<z.ZodLiteral<number>> = 
				(data as Level[]).map((d: Level) => {
					return z.literal(d.level);
				})
			const levelDataAsTuple: readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]] = levelOptions as any as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]];
			const levelSchema = z.union(levelDataAsTuple);
			schema = schema.extend({
				// level_start: z.enum(levelDataAsTuple),
				level_start: levelSchema,
				level_end: levelSchema,
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
						<DropdownMenuLabel>{Translate("Functions")}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<CompTriggerItem
							mode={"update"}
							itemName={Translate("Update")}
							icon={PenSquare}
						/>
						<CompTriggerItem
							mode={"create"}
							itemName={Translate("Create")}
							icon={Plus}
						/>
						<CompTriggerItem
							mode={"delete"}
							itemName={Translate("Delete")}
							icon={Trash2}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				<SheetContent className="w-[50%]">
					<SheetHeader>
						<SheetTitle>
							{`${Translate(mode)!}${Translate(
								"form"
							)} (${getTableName(tableType)})`}
						</SheetTitle>
						<SheetDescription>
							{modeDescription(mode)}
						</SheetDescription>
					</SheetHeader>
					<ScrollArea className="h-[85%] w-full">
						<ParameterForm
							formSchema={schema!}
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
