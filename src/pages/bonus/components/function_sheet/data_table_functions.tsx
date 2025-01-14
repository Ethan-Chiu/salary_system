import { cn } from "~/lib/utils";
import { useContext, useState } from "react";
import {
	type LucideIcon,
	PenSquare,
	Plus,
	PlusSquare,
	Trash2,
	Copy,
	NotebookPen,
	RefreshCcw,
	EllipsisVertical,
	Download,
	Upload,
	Calculator,
	CirclePlus,
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog"

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
import { BonusTableEnumValues } from "../../bonus_tables";
import { bonusToolbarFunctionsContext } from "./bonus_functions_context";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Input } from "~/components/ui/input";

import { BonusBatchUpdateForm } from "./batch_update_form";
import { FunctionMode } from "../context/data_table_context";
import { ExcelDownload } from "../excel_download/ExcelDownloader";
import { ExcelUpload } from "../excel_upload/ExcelUpload";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
	bonusType: BonusTypeEnumType;
}

// export type FunctionMode =
// 	| "create"
// 	| "batch_create"
// 	| "update"
// 	| "batch_update"
// 	| "delete"
// 	| "auto_calculate"
// 	| "excel_download"
// 	| "excel_upload"
// 	| "initialize"
// 	| "none";

export function DataTableFunctions({
	tableType,
	bonusType,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const { t } = useTranslation(["common", "nav"]);
	const functions = useContext(bonusToolbarFunctionsContext);
	const queryFunction = functions.queryFunction;
	const updateFunction = functions.updateFunction;
	const batchUpdateFunction = functions.batchUpdateFunction;
	const createFunction = functions.createFunction;
	const batchCreateFunction = functions.batchCreateFunction;
	const deleteFunction = functions.deleteFunction;
	const autoCalculateFunction = functions.autoCalculateFunction;

	// ========================= Additional Condition for Schema =====================================
	let schema = getSchema(tableType);

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Dialog open={open} onOpenChange={setOpen}>
				{/* Dropdown */}
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="ml-auto h-8"
						>
							<EllipsisVertical className="cursor-pointer stroke-[1.5]" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[120px]">
						<DropdownMenuLabel>
							{t("others.functions")}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<CompTriggerItem
							mode={"excel_download"}
							itemName={t("button.excel_download")}
							icon={Download}
						/>
						<CompTriggerItem
							mode={"excel_upload"}
							itemName={t("button.excel_upload")}
							icon={Upload}
						/>
						<CompTriggerItem
							mode={"create_with_blank"}
							itemName={t("button.create_with_blank")}
							icon={CirclePlus}
						/>
						{batchUpdateFunction && (
							<CompTriggerItem
								mode={"batch_update"}
								itemName={t("button.batch_update")}
								icon={NotebookPen}
							/>
						)}
						{autoCalculateFunction && (
							<CompTriggerItem
								mode={"auto_calculate"}
								itemName={t("button.auto_calculate")}
								icon={Calculator}
							/>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				<DialogContent className="w-[60%]">
					<DialogHeader>
						<DialogTitle>
							{`${t(`button.${mode}`)!}${t("button.form")} (${t(
								getTableNameKey(tableType)
							)})`}
						</DialogTitle>
						<DialogDescription>
							{modeDescription(t, mode)}
						</DialogDescription>
					</DialogHeader>

					{mode == "batch_create" ? (
						<BatchCreateForm
							bonusType={bonusType}
							tableType={tableType}
							schema={schema}
							setOpen={setOpen}
						/>
					) : mode == "batch_update" ? (
						<BonusBatchUpdateForm
							bonusType={bonusType}
							tableType={tableType}
							setOpen={setOpen}
						/>
					) : mode == "excel_download" ? (
						<ExcelDownload
							table_name={tableType}
							bonus_type={bonusType}
						/>
					) : mode == "excel_upload" ? (
						<ExcelUpload
							tableType={tableType}
							closeDialog={() => setOpen(false)}
						/>
					) : (
						<ScrollArea className="h-full w-full">
							<BonusForm
								formSchema={schema}
								formConfig={[{ key: "id", config: { hidden: true } }]}
								mode={mode}
								// bonus_type={bonusType}
								closeSheet={() => setOpen(false)}
							/>
							<ScrollBar orientation="horizontal" />
						</ScrollArea>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);

	function CompTriggerItem(props: {
		mode: FunctionMode;
		itemName: string;
		icon: LucideIcon;
	}) {
		return (
			<DialogTrigger
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
			</DialogTrigger>
		);
	}
}

function BatchCreateForm({
	tableType,
	bonusType,
	schema,
	setOpen,
}: {
	tableType: TableEnum;
	bonusType: BonusTypeEnumType;
	schema: any;
	setOpen: (open: boolean) => void;
}) {
	const mode = "batch_create";
	if (tableType == "TableBonusWorkType")
		return (
			<BonusWorkTypeBatchCreateForm
				bonusType={bonusType}
				formSchema={z.object({ content: z.array(schema) })}
				mode={mode}
				closeSheet={() => setOpen(false)}
			/>
		);
	if (tableType == "TableBonusDepartment")
		return (
			<BonusDepartmentBatchCreateForm
				bonusType={bonusType}
				formSchema={z.object({ content: z.array(schema) })}
				mode={mode}
				closeSheet={() => setOpen(false)}
			/>
		);
	if (tableType == "TableBonusPosition")
		return (
			<BonusPositionBatchCreateForm
				bonusType={bonusType}
				formSchema={z.object({ content: z.array(schema) })}
				mode={mode}
				closeSheet={() => setOpen(false)}
			/>
		);
	// if (tableType == "TableBonusPositionType") return <BonusPositionTypeBatchCreateForm
	// 	bonusType={bonusType}
	// 	formSchema={z.object({ content: z.array(schema) })}
	// 	mode={mode}
	// 	closeSheet={() => setOpen(false)}
	// />;
	if (tableType == "TableBonusSeniority")
		return (
			<BonusSeniorityBatchCreateForm
				bonusType={bonusType}
				formSchema={z.object({ content: z.array(schema) })}
				mode={mode}
				closeSheet={() => setOpen(false)}
			/>
		);
}



