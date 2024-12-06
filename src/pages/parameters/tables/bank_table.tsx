import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { EmptyTable } from "./empty_table";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { BankSettingFEType } from "~/server/api/types/bank_setting_type";
import { PenSquare, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { useState } from "react";
import { FunctionMode } from "../components/function_sheet/data_table_functions";
import { bankSchema } from "../schemas/configurations/bank_schema";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { cn } from "~/lib/utils";

export type RowItem = {
	bank_name: string;
	bank_code: string;
	org_name: string;
	org_code: string;
	start_date: string;
	end_date: string | null;
	create: boolean;
	update: boolean;
	delete: boolean;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bank_columns = ({ t, period_id, open, setOpen, mode, setMode }: { t: TFunction<[string], undefined>, period_id: number, open: boolean, setOpen: (open: boolean) => void, mode: FunctionMode, setMode: (mode: FunctionMode) => void }) => [
	...["bank_name", "org_name", "start_date", "end_date"].map(
		(key: string) => columnHelper.accessor(key as RowItemKey, {
			header: ({ column }) => {
				return (
					<div className="flex justify-center">
						<div className="text-center font-medium">
							<Button
								variant="ghost"
								onClick={() =>
									column.toggleSorting(
										column.getIsSorted() === "asc"
									)
								}
							>
								{t(`table.${key}`)}
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				);
			},
			cell: ({ row }) => {
				switch (key) {
					case "bank_name":
						return <div className="text-center font-medium">{`(${row.original.bank_code})${row.original.bank_name}`}</div>
					case "org_name":
						return <div className="text-center font-medium">{`(${row.original.org_code})${row.original.org_name}`}</div>
					case "end_date":
						return row.original.end_date ? (
							<div className="text-center font-medium">{`${row.original.end_date}`}</div>
						) : (
							<div className="text-center font-medium"></div>
						);
					default:
						return <div className="text-center font-medium">{`${row.original[key as RowItemKey]}`}</div>
				}
			}
		})),
	...["create", "update", "delete"].map(
		(key: string) => columnHelper.accessor(key as RowItemKey, {
			header: ({ column }) => {

				return (
					<div className="flex justify-center">
						<div className="text-center font-medium">
							{t(`button.${key}`)}
						</div>
					</div>
				);
			},
			cell: ({ row }) => {
				return (
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger
							className="w-full"
							onClick={() => {
								setMode(key as FunctionMode);
								setOpen(true);
							}}
							disabled={!row.original[key as RowItemKey]}
						>
							<div className="flex justify-center">
								{key == "create" && <Plus className={cn(!row.original[key as RowItemKey] && "stroke-muted")} />}
								{key == "update" && <PenSquare className={cn(!row.original[key as RowItemKey] && "stroke-muted")} />}
								{key == "delete" && <Trash2 className={cn(!row.original[key as RowItemKey] && "stroke-muted")} />}
							</div>
						</SheetTrigger>
						<SheetContent className="w-[50%]">
							<ParameterToolbarFunctionsProvider
								selectedTableType={"TableBankSetting"}
								period_id={period_id}
							>
								<ParameterForm
									formSchema={bankSchema}
									mode={mode}
									closeSheet={() => setOpen(false)}
								/>
							</ParameterToolbarFunctionsProvider>
						</SheetContent>
					</Sheet>
				);
			},
		}))
];

export function bankSettingMapper(bankSettingData: BankSettingFEType[]): RowItem[] {
	return bankSettingData.map((d) => {
		return {
			bank_name: d.bank_name,
			bank_code: d.bank_code,
			org_name: d.org_name,
			org_code: d.org_code,
			start_date: formatDate("day", d.start_date) ?? "",
			end_date: formatDate("day", d.end_date) ?? "",
			create: true,
			update: true,
			delete: false,
		};
	});
}

interface BankTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BankTable({ period_id, viewOnly }: BankTableProps) {
	const { t } = useTranslation(["common"]);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBankSetting.useQuery({ period_id });
	const filterKey: RowItemKey = "bank_name";

	if (isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		// return <span>Error: {error.message}</span>; // TODO: Error element with toast
		const err_msg = error.message;
		const emptyError = true;
		return emptyError ? <EmptyTable err_msg={err_msg} selectedTableType="TableBankSetting" /> : <></>;
	}

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={bank_columns({ t, period_id, open, setOpen, mode, setMode })}
					data={bankSettingMapper(data!)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bank_columns({ t, period_id, open, setOpen, mode, setMode })}
					data={bankSettingMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
