import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { useTranslation } from "react-i18next";
import { levelRangeFE } from "~/server/api/types/level_range_type";
import { z } from "zod";
import { formatDate } from "~/lib/utils/format_date";

export type RowItem = {
	type: string;
	level_start: number;
	level_end: number;
	start_date: string;
	end_date: string | null;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const level_range_columns = [
	columnHelper.accessor("type", {
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
							{t("table.type")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium">{`${row.original.type}`}</div>
		),
	}),
	columnHelper.accessor("level_start", {
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
							{t("table.level_start")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium">{`${row.original.level_start}`}</div>
			);
		},
	}),
	columnHelper.accessor("level_end", {
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
							{t("table.level_end")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium">{`${row.original.level_end}`}</div>
			);
		},
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

export function levelRangeMapper(levelRangeData: z.infer<typeof levelRangeFE>[]): RowItem[] {
	return levelRangeData.map((d) => {
		return {
			type: d.type,
			level_start: d.level_start,
			level_end: d.level_end,
			start_date: formatDate("day", d.start_date) ?? "",
			end_date: formatDate("day", d.end_date) ?? "",
		};
	});
}

interface LevelRangeTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function LevelRangeTable({ period_id, viewOnly }: LevelRangeTableProps) {
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

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={level_range_columns}
					data={levelRangeMapper(data!)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={level_range_columns}
					data={levelRangeMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
