import { api } from "~/utils/api";
import { createColumnHelper } from "@tanstack/react-table";
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
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { Sheet } from "~/components/ui/sheet";
import dataTableContext, {
	type FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { ColumnHeaderBaseComponent, ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";

export type RowItem = {
	bank_name: string;
	bank_code: string;
	org_name: string;
	org_code: string;
	start_date: Date | null;
	end_date: Date | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();
const f = ["bank_name", "org_name", "start_date", "end_date"] as const;

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
	...f.map((key) =>
		columnHelper.accessor(key, {
			header: ({ column }) => {
				return (
					<ColumnHeaderComponent column={column}>
						{t(`table.${key}`)}
					</ColumnHeaderComponent>
				);
			},
			cell: ({ row }) => {
				let content = "";
				switch (key) {
					case "bank_name":
						content = `(${row.original.bank_code})${row.original.bank_name}`;
						break;
					case "org_name":
						content = `(${row.original.org_code})${row.original.org_name}`;
						break;
					case "start_date":
						content = `${
							formatDate("day", row.original.start_date) ?? ""
						}`;
						break;
					case "end_date":
						content = `${
							formatDate("day", row.original.end_date) ?? ""
						}`;
						break;
				}
				return <ColumnCellComponent>{content}</ColumnCellComponent>;
			},
		})
	),
	columnHelper.accessor("functions", {
		header: () => {
			return (
				<ColumnHeaderBaseComponent>
					{t(`others.functions`)}
				</ColumnHeaderBaseComponent>
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
			id: d.id,
			bank_name: d.bank_name,
			bank_code: d.bank_code,
			org_name: d.org_name,
			org_code: d.org_code,
			start_date: d.start_date,
			end_date: d.end_date,
			functions: d.functions,
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
	const { open, setOpen, mode, setMode, setData } =
		useContext(dataTableContext);

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
		<ParameterToolbarFunctionsProvider
			selectedTableType={"TableBankSetting"}
			period_id={period_id}
		>
			<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
				<DataTableWithFunctions
					columns={bank_columns({ t, setOpen, setMode, setData })}
					data={bankSettingMapper(data!)}
					filterColumnKey={filterKey}
				/>
				<FunctionsSheetContent t={t} period_id={period_id}>
					<ParameterForm
						formSchema={bankSchema}
						formConfig={[{ key: "id", config: { hidden: true } }]}
						mode={mode}
						closeSheet={() => {
							setOpen(false);
						}}
					/>
				</FunctionsSheetContent>
			</Sheet>
			<ConfirmDialog
				open={open && mode === "delete"}
				onOpenChange={setOpen}
				schema={bankSchema}
			/>
		</ParameterToolbarFunctionsProvider>
	) : (
		<DataTableWithoutFunctions
			columns={bank_columns({ t, setOpen, setMode, setData })}
			data={bankSettingMapper(data!)}
			filterColumnKey={filterKey}
		/>
	);
}
