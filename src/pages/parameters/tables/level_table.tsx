import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { useTranslation } from "react-i18next";
import { formatDate } from "~/lib/utils/format_date";
import { LevelFEType } from "~/server/api/types/level_type";

export type RowItem = {
	level: number;
	start_date: string;
	end_date: string | null;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const level_columns = [
	columnHelper.accessor("level", {
		header: ({ column }) => {
			const { t } = useTranslation(["common"]);
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
							{t("table.level")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium">{`${row.original.level}`}</div>
		),
	}),
	columnHelper.accessor("start_date", {
		header: ({ column }) => {
			const { t } = useTranslation(["common"]);
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
							{t("table.start_date")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium">{`${row.original.start_date
					}`}</div>
			);
		},
	}),
	columnHelper.accessor("end_date", {

		header: ({ column }) => {
			const { t } = useTranslation(["common"]);
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
							{t("table.end_date")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => {
			return row.original.end_date ? (
				<div className="text-center font-medium">{`${row.original.end_date}`}</div>
			) : (
				<div className="text-center font-medium"></div>
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
		};
	});
}

interface LevelTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function LevelTable({ period_id, viewOnly }: LevelTableProps) {
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

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={level_columns}
					data={levelMapper(data!)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={level_columns}
					data={levelMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
