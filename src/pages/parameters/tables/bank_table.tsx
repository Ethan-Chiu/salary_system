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
import { type BankSettingFEType } from "~/server/api/types/bank_setting_type";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { useContext } from "react";
import { bankSchema } from "../schemas/configurations/bank_schema";
import {
	FunctionsComponent,
} from "~/components/data_table/functions_component";
import { Sheet } from "~/components/ui/sheet";
import dataTableContext, {
	FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";

export type RowItem = {
	bank_name: string;
	bank_code: string;
	org_name: string;
	org_code: string;
	start_date: string;
	end_date: string | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bank_columns = ({
	t,
	setOpen,
	setMode,
	setData,
}: {
	t: TFunction<[string], undefined>;
	setOpen: (open: boolean) => void;
	setMode: (mode: FunctionMode) => void;
	setData: (data: RowItem) => void;
}) => [
		...["bank_name", "org_name", "start_date", "end_date"].map((key: string) =>
			columnHelper.accessor(key as RowItemKey, {
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
							return (
								<div className="text-center font-medium">{`(${row.original.bank_code})${row.original.bank_name}`}</div>
							);
						case "org_name":
							return (
								<div className="text-center font-medium">{`(${row.original.org_code})${row.original.org_name}`}</div>
							);
						default:
							return (
								<div className="text-center font-medium">{`${row.original[key as RowItemKey]?.toString()
									}`}</div>
							);
					}
				},
			})
		),
		columnHelper.accessor("functions", {
			header: () => {
				return (
					<div className="flex justify-center">
						<div className="text-center font-medium">
							{t(`others.functions`)}
						</div>
					</div>
				);
			},
			cell: ({ row }) => {
				return (
					<FunctionsComponent
						t={t}
						setOpen={setOpen}
						setMode={setMode}
						data={row.original}
						setData={setData}
					/>
				);
			},
		}),
	];

export function bankSettingMapper(
	bankSettingData: BankSettingFEType[]
): RowItem[] {
	return bankSettingData.map((d) => {
		return {
			bank_name: d.bank_name,
			bank_code: d.bank_code,
			org_name: d.org_name,
			org_code: d.org_code,
			start_date: formatDate("day", d.start_date) ?? "",
			end_date: formatDate("day", d.end_date) ?? "",
			functions: {
				create: d.creatable,
				update: d.updatable,
				delete: d.deletable,
			},
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
	const { open, setOpen, mode, setMode, setData } = useContext(dataTableContext);

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
		return emptyError ? (
			<EmptyTable
				err_msg={err_msg}
				selectedTableType="TableBankSetting"
			/>
		) : (
			<></>
		);
	}

	return !viewOnly ? (
		<Sheet open={open} onOpenChange={setOpen}>
			<DataTableWithFunctions
				columns={bank_columns({ t, setOpen, setMode, setData })}
				data={bankSettingMapper(data!)}
				filterColumnKey={filterKey}
			/>
			<FunctionsSheetContent t={t} period_id={period_id}>
				<ParameterForm
					formSchema={bankSchema}
					mode={mode}
					closeSheet={() => {
						setOpen(false);
					}}
				/>
			</FunctionsSheetContent>
		</Sheet>
	) : (
		<DataTableWithoutFunctions
			columns={bank_columns({ t, setOpen, setMode, setData })}
			data={bankSettingMapper(data!)}
			filterColumnKey={filterKey}
		/>
	);
}
