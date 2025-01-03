import { LoadingSpinner } from "~/components/loading";
import { DataTableUpdate } from "../components/data_table_update";
import { api } from "~/utils/api";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { type EmployeeTrustFEType } from "~/server/api/types/employee_trust_type";
import { formatDate } from "~/lib/utils/format_date";
import {
	FunctionsComponent,
} from "~/components/data_table/functions_component";
import { TFunction } from "i18next";
import { FunctionMode } from "../components/function_sheet/data_table_functions";
import { useContext, useState } from "react";
import { ColumnHeaderBaseComponent, ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import dataTableContext from "../components/context/data_table_context";
import { Sheet } from "~/components/ui/sheet";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";

type FunctionsItem = {
	creatable: boolean;
	updatable: boolean;
	deletable: boolean;
};
export type RowItem = EmployeeTrustFEType & {
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columnNames: RowItemKey[] = [
	"department",
	"emp_no",
	"emp_name",
	"position",
	"position_type",
	"emp_trust_reserve",
	"org_trust_reserve",
	"emp_special_trust_incent",
	"org_special_trust_incent",
	"start_date",
	"end_date",
];

export const employee_trust_columns = ({
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
	...columnNames.map((key) =>
		columnHelper.accessor(key, {
			header: ({ column }) => {
				return (
					<ColumnHeaderComponent column={column}>
						{t(`table.${key}`)}
					</ColumnHeaderComponent>
				);
			},
			cell: ({ row }) => {
				let content = row.original[key]?.toString() ?? "";
				switch (key) {
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

export function employeeTrustMapper(
	employeeTrustData: EmployeeTrustFEType[]
): RowItem[] {
	return employeeTrustData.map((d) => {
		return {
			...d,
			start_date: d.start_date,
			end_date: d.end_date,
			functions: d.functions,
		};
	});
}

export function EmployeeTrustTable({ period_id }: any) {
	const { t } = useTranslation(["common"]);
	const { open, setOpen, mode, setMode, setData } =
		useContext(dataTableContext);

	const { isLoading, isError, data, error } =
		api.employeeTrust.getCurrentEmployeeTrust.useQuery({
			period_id: period_id,
		});

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		// TODO: figure out its type
		return (
		<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
			<DataTableUpdate
				columns={employee_trust_columns({
					t,
					setOpen,
					setMode,
          setData,
				})}
				columnNames={columnNames}
				data={employeeTrustMapper(data)}
				historyDataFunction={() =>
					api.employeeTrust.getAllEmployeeTrust.useQuery()
				}
				calendarDataFunction={() =>
					api.employeeTrust.getAllEmployeeTrust.useQuery()
				}
			/>
      </Sheet>
		);
	}
	return <div />;
}
