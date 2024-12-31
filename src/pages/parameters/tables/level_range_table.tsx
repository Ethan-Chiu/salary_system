import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { useTranslation } from "react-i18next";
import { type LevelRangeFEType } from "~/server/api/types/level_range_type";
import { formatDate } from "~/lib/utils/format_date";
import { type TFunction } from "i18next";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { levelRangeSchema } from "../schemas/configurations/level_range_schema";
import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { SelectLevelField } from "../components/function_sheet/form_fields/select_level_field";
import dataTableContext, {
	type FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { useContext } from "react";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";

export type RowItem = {
	type: string;
	level_start: number;
	level_end: number;
	start_date: Date | null;
	end_date: Date | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const level_range_columns = ({
	t,
	setOpen,
	setMode,
	setData,
}: {
	t: TFunction<[string], undefined>;
	period_id: number;
	setOpen: (open: boolean) => void;
	setMode: (mode: FunctionMode) => void;
	setData: (data: RowItem) => void;
}) => {
	const f: RowItemKey[] = [
		"type",
		"level_start",
		"level_end",
		"start_date",
		"end_date",
	];
	return [
		...f.map((key) =>
			columnHelper.accessor(key, {
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
						case "start_date":
							return (
								<div className="text-center font-medium">{`${formatDate(
									"day",
									row.original.start_date
								) ?? ""
									}`}</div>
							);
						case "end_date":
							return (
								<div className="text-center font-medium">{`${formatDate("day", row.original.end_date) ??
									""
									}`}</div>
							);
						default:
							return (
								<div className="text-center font-medium">{`${row.original[key]}`}</div>
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
};

export function levelRangeMapper(
	levelRangeData: LevelRangeFEType[]
): RowItem[] {
	return levelRangeData.map((d) => {
		return {
			id: d.id,
			type: d.type,
			level_start: d.level_start,
			level_end: d.level_end,
			start_date: d.start_date,
			end_date: d.end_date,
			functions: d.functions,
		};
	});
}

interface LevelRangeTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function LevelRangeTable({ period_id, viewOnly }: LevelRangeTableProps) {
	const { t } = useTranslation(["common"]);
	const { mode, setMode, open, setOpen, setData, data: dd } =
		useContext(dataTableContext);
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentLevelRange.useQuery({ period_id });
	const filterKey: RowItemKey = "type";

	if (isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	const columns = level_range_columns({
		t,
		period_id,
		setOpen,
		setMode,
		setData,
	});

	return !viewOnly ? (
		<ParameterToolbarFunctionsProvider
			selectedTableType={"TableLevelRange"}
			period_id={period_id}
		>
			<Sheet open={open && mode !== "delete"} onOpenChange={setOpen} aria-hidden={false}>
				<DataTableWithFunctions
					columns={columns}
					data={levelRangeMapper(data!)}
					filterColumnKey={filterKey}
				/>
				<FunctionsSheetContent t={t} period_id={period_id}>
					<ParameterForm
						formSchema={levelRangeSchema}
						formConfig={[
							{ key: "id", config: { hidden: true } },
							{
								key: "level_start",
								config: {
									render: SelectLevelField,
								},
							},
							{
								key: "level_end",
								config: {
									render: SelectLevelField,
								},
							},
						]}
						mode={mode}
						closeSheet={() => setOpen(false)}
					/>
				</FunctionsSheetContent>
			</Sheet>
			<ConfirmDialog open={open && mode === "delete"} onOpenChange={setOpen} schema={levelRangeSchema} />
		</ParameterToolbarFunctionsProvider>
	) : (
		<DataTableWithoutFunctions
			columns={columns}
			data={levelRangeMapper(data!)}
			filterColumnKey={filterKey}
		/>
	);
}
/* defaultValue={{start_date: new Date()}} */
