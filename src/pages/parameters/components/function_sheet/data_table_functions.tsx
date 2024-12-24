import { cn } from "~/lib/utils";
import { useState } from "react";
import { type LucideIcon, Copy, Download, EllipsisVertical, RefreshCcw, Upload } from "lucide-react";
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
import { ParameterForm } from "./parameter_form";
import { LevelBatchCreateForm } from "./level_batch_create_form";
import { type TableEnum, getTableNameKey } from "../context/data_table_enum";
import { getSchema } from "../../schemas/get_schemas";
import { api } from "~/utils/api";
import { z } from "zod";
import { modeDescription } from "~/lib/utils/helper_function";
import { ExcelDownload } from "../excel_download/ExcelDownloader";
import { ExcelUpload } from "../excel_upload/ExcelUpload";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
}

// TODO: remove
type FunctionMode =
	"create"
	| "batch_create"
	| "update"
	| "delete"
	| "excel_download"
	| "excel_upload"
	| "initialize"
	| "none";

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

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Dialog open={open} onOpenChange={setOpen}>
				{/* Dropdown */}
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="ml-auto hidden h-8 lg:flex"
						>
							<EllipsisVertical className="cursor-pointer stroke-[1.5]" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[120px]">
						<DropdownMenuLabel>{t("others.functions")}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{tableType == "TableLevel" && <CompTriggerItem
							mode={"batch_create"}
							itemName={t("button.batch_create")}
							icon={Copy}
						/>}
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
							mode={"initialize"}
							itemName={t("button.initialize")}
							icon={RefreshCcw}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				<DialogContent className={mode == "excel_upload" ? "sm:max-w-[1000px]" : "sm:max-w-[600px]"}>
					<DialogHeader>
						<DialogTitle>
							{`${t(`button.${mode}`)!}${t("button.form")} (${t(getTableNameKey(tableType))})`}
						</DialogTitle>
						<DialogDescription>
							{modeDescription(t, mode)}
						</DialogDescription>
					</DialogHeader>
					{	
						mode == "batch_create" ?
						<LevelBatchCreateForm
							formSchema={z.object({ content: z.array(schema) })}
							mode={mode}
							closeSheet={() => setOpen(false)}
						/>
						:
						mode == "excel_download" ? 
							<ExcelDownload 
								table_name={tableType}
							/>
						:
						mode == "excel_upload" ?
							<ExcelUpload 
								closeDialog={() => setOpen(false)}
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
