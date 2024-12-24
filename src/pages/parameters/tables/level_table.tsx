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
	type FunctionsItem,
} from "~/components/data_table/functions_component";
import { type TFunction } from "i18next";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { levelSchema } from "../schemas/configurations/level_schema";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { type FunctionMode } from "../components/function_sheet/data_table_functions";
import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";

export type RowItem = {
	level: number;
	start_date: string;
	end_date: string | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const level_columns = ({
	t,
	setOpen,
	setMode,
}: {
	t: TFunction<[string], undefined>;
	setOpen: (open: boolean) => void;
	setMode: (mode: FunctionMode) => void;
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
					functionsItem={row.original.functions}
				/>
			);
		},
	}),
];

export function levelMapper(levelData: LevelFEType[]): RowItem[] {
	return levelData.map((d) => {
		return {
			level: d.level,
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

interface LevelTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function LevelTable({ period_id, viewOnly }: LevelTableProps) {
	const { t } = useTranslation(["common"]);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

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
		<Sheet open={open} onOpenChange={setOpen}>
			<DataTableWithFunctions
				columns={level_columns({
					t,
					setOpen,
					setMode,
				})}
				data={levelMapper(data!)}
				filterColumnKey={filterKey}
			/>
			<FunctionsSheetContent t={t} period_id={period_id}>
				<ParameterForm
					formSchema={levelSchema}
					mode={mode}
					closeSheet={() => setOpen(false)}
				/>
			</FunctionsSheetContent>
		</Sheet>
	) : (
		<DataTableWithoutFunctions
			columns={level_columns({
				t,
				setOpen,
				setMode,
			})}
			data={levelMapper(data!)}
			filterColumnKey={filterKey}
		/>
	);
}
