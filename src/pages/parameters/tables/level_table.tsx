import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { type LevelFEType } from "~/server/api/types/level_type";
import {
	FunctionsComponent,
} from "~/components/data_table/functions_component";
import { type TFunction } from "i18next";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { levelSchema } from "../schemas/configurations/level_schema";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import dataTableContext, {
	FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";

export type RowItem = {
	level: number;
	start_date: Date | null;
	end_date: Date | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const level_columns = ({
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
		...["level", "start_date", "end_date"].map((key: string) =>
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
						case "start_date":
							return (
								<div className="text-center font-medium">{`${formatDate("day", row.original.start_date) ?? ""}`}</div>
							);
						case "end_date":
							return (
								<div className="text-center font-medium">{`${formatDate("day", row.original.end_date) ?? ""}`}</div>
							);
						default:
							return (
								<div className="text-center font-medium">{`${row.original[
									key as RowItemKey
								]?.toString()}`}</div>
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

export function levelMapper(levelData: LevelFEType[]): RowItem[] {
	return levelData.map((d) => {
		return {
			id: d.id,
			level: d.level,
			start_date: d.start_date,
			end_date: d.end_date,
			functions: d.functions,
		};
	});
}

interface LevelTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function LevelTable({ period_id, viewOnly }: LevelTableProps) {
	const { t } = useTranslation(["common"]);
	const { mode, setMode, open, setOpen, setData } = useContext(dataTableContext);

	const { isLoading, isError, data, error } =
		api.parameters.getCurrentLevel.useQuery({ period_id });
	const filterKey: RowItemKey = "level";

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

	return !viewOnly ? (
		<ParameterToolbarFunctionsProvider
			selectedTableType={"TableLevel"}
			period_id={period_id}
		>
			<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
				<DataTableWithFunctions
					columns={level_columns({
						t,
						setOpen,
						setMode,
						setData,
					})}
					data={levelMapper(data!)}
					filterColumnKey={filterKey}
				/>
				<FunctionsSheetContent t={t} period_id={period_id}>
					<ParameterForm
						formSchema={levelSchema}
						formConfig={[{ key: "id", config: { hidden: true } }]}
						mode={mode}
						closeSheet={() => setOpen(false)}
					/>
				</FunctionsSheetContent>
			</Sheet>
			<ConfirmDialog open={open && mode === "delete"} onOpenChange={setOpen} schema={levelSchema} />
		</ParameterToolbarFunctionsProvider>
	) : (
		<DataTableWithoutFunctions
			columns={level_columns({
				t,
				setOpen,
				setMode,
				setData,
			})}
			data={levelMapper(data!)}
			filterColumnKey={filterKey}
		/>
	);
}
