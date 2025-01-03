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

type FunctionsItem = {
	creatable: boolean;
	updatable: boolean;
	deletable: boolean;
};
export type RowItem = Omit<EmployeeTrustFEType, "start_date" | "end_date"> & {
	start_date: string;
	end_date: string | null;
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
				switch (key) {
					default:
						return (
							<div className="text-center font-medium">{`${row.original[key]?.toString()}`}</div>
						);
				}
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
	t: TFunction<[string], undefined>,
	employeeTrustData: EmployeeTrustFEType[]
): RowItem[] {
	return employeeTrustData.map((d) => {
		return {
			...d,
			start_date: formatDate("day", d.start_date) ?? "",
			end_date: formatDate("day", d.end_date) ?? "",
			functions: d.functions,
		};
	});
}

export function EmployeeTrustTable({ period_id }: any) {
	const { t } = useTranslation(["common"]);
	const { setOpen, setMode, setData } =
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
			<DataTableUpdate
				columns={employee_trust_columns({
					t,
					setOpen,
					setMode,
          setData,
				})}
				columnNames={columnNames}
				data={employeeTrustMapper(t, data)}
				historyDataFunction={() =>
					api.employeeTrust.getAllEmployeeTrust.useQuery()
				}
				calendarDataFunction={() =>
					api.employeeTrust.getAllEmployeeTrust.useQuery()
				}
			/>
		);
	}
	return <div />;
}
