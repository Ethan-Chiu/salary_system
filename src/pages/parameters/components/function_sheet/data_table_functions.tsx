import { cn } from "~/lib/utils";
import { useState } from "react";
import { type LucideIcon, Download, EllipsisVertical, Plus, Upload } from "lucide-react";
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

import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { type TableEnum, getTableNameKey } from "../context/data_table_enum";
import { getSchema } from "../../schemas/get_schemas";
import { modeDescription } from "~/lib/utils/helper_function";
import { ExcelDownload } from "../excel_download/ExcelDownloader";
import { ExcelUpload } from "../excel_upload/ExcelUpload";
import { ParameterForm } from "./parameter_form";
import { ScrollArea } from "~/components/ui/scroll-area";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
}

// TODO: remove
type FunctionMode =
	"create"
	| "update"
	| "delete"
	| "excel_download"
	| "excel_upload"
	// | "initialize"
	| "none";

export function DataTableFunctions({
	tableType,
	className,
}: DataTableFunctionsProps) {
	const { t } = useTranslation(['common', 'nav']);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

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
							className="ml-auto h-8 lg:flex"
						>
							<EllipsisVertical className="cursor-pointer stroke-[1.5]" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[120px]">
						<DropdownMenuLabel>{t("others.functions")}</DropdownMenuLabel>
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
							mode={"create"}
							itemName={t("button.create")}
							icon={Plus}
						/>
						{/* <CompTriggerItem
							mode={"initialize"}
							itemName={t("button.initialize")}
							icon={RefreshCcw}
						/> */}
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				<DialogContent className={cn("h-[90vh]", mode == "excel_upload" ? "sm:max-w-[1000px]" : "sm:max-w-[600px]")}>
					<ScrollArea className="w-full h-full">
						<DialogHeader>
							<DialogTitle>
								{`${t(`button.${mode}`)!}${t("button.form")} (${t(getTableNameKey(tableType))})`}
							</DialogTitle>
							<DialogDescription>
								{modeDescription(t, mode)}
							</DialogDescription>
						</DialogHeader>
						{
							mode == "excel_download" ?
								<ExcelDownload
									table_name={tableType}
								/>
								:
								mode == "excel_upload" ?
									<ExcelUpload
										tableType={tableType}
										closeDialog={() => setOpen(false)}
									/>
									:
									mode == "create" ?
										<ParameterForm
											formSchema={schema}
											mode={"create"}
											closeSheet={() => setOpen(false)}
										/>
										:
										<></>
						}
					</ScrollArea>
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
