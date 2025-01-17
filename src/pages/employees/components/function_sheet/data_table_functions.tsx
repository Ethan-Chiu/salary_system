import { cn } from "~/lib/utils";
import { useContext } from "react";
import {
	Calculator,
	Download,
	EllipsisVertical,
	type LucideIcon,
	RefreshCcw,
	Upload,
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
import { employeeToolbarFunctionsContext } from "./employee_functions_context";
import { ConfirmDialog } from "./confirm_dialog";
import { useTrustFunctionContext } from "../../tables/employee_trust/employee_trust_provider";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
}

export type FunctionMode =
	| "create"
	| "update"
	| "delete"
	| "excel_download"
	| "excel_upload"
	| "initialize"
	| "auto_calculate"
	| "none";

export function DataTableFunctions({
	tableType,
	className,
}: DataTableFunctionsProps) {
	const { open, setOpen, mode, setMode } = useTrustFunctionContext();

	const { t } = useTranslation(["common", "nav"]);
	const functions = useContext(employeeToolbarFunctionsContext);
	const autoCalculateFunction = functions.autoCalculateFunction;

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
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
					<DropdownMenuContent align="end" className="w-[150px]">
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
							mode={"initialize"}
							itemName={t("button.initialize")}
							icon={RefreshCcw}
						/>
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
				<SheetContent className="w-[50%]">
					{mode !== "none" && (
						<>
							<SheetHeader>
								<SheetTitle>
									{`${t(`button.${mode}`)!}${t(
										"button.form"
									)} (${t(getTableNameKey(tableType))})`}
								</SheetTitle>
								<SheetDescription>
									{modeDescription(t, mode)}
								</SheetDescription>
							</SheetHeader>
							<ScrollArea className="h-full w-full">
								<EmployeeForm
									formSchema={getSchema(tableType)!}
									formConfig={[
										{ key: "id", config: { hidden: true } },
									]}
									mode={mode}
									closeSheet={() => setOpen(false)}
								/>
								<ScrollBar orientation="horizontal" />
							</ScrollArea>
						</>
					)}
				</SheetContent>
				<ConfirmDialog
					open={open && mode === "delete"}
					onOpenChange={setOpen}
					schema={getSchema(tableType)!}
				/>
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
