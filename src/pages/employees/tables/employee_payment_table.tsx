import { LoadingSpinner } from "~/components/loading";
import { DataTableUpdate } from "../components/data_table_update";
import { api } from "~/utils/api";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { type EmployeePaymentFEType } from "~/server/api/types/employee_payment_type";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { useState } from "react";
import { type TFunction } from "i18next";
import { ColumnHeaderBaseComponent, ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import { Sheet } from "~/components/ui/sheet";
import { formatDate } from "~/lib/utils/format_date";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";

type FunctionsItem = {
	create: boolean;
	update: boolean;
	delete: boolean;
};
type FunctionMode = "create" | "update" | "delete" | "none";

export type RowItem = Omit<
	EmployeePaymentFEType,
	"start_date" | "end_date" | "long_service_allowance_type"
> & {
	long_service_allowance_type: string;
	start_date: Date | null;
	end_date: Date | null;
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
	"base_salary",
	"food_allowance",
	"supervisor_allowance",
	"occupational_allowance",
	"subsidy_allowance",
	"long_service_allowance",
	"long_service_allowance_type",
	"l_r_self",
	"l_i",
	"h_i",
	"l_r",
	"occupational_injury",
	"start_date",
	"end_date",
];

export const employee_payment_columns = ({
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

export function employeePaymentMapper(
	t: TFunction<[string], undefined>,
	employeePaymentData: EmployeePaymentFEType[]
): RowItem[] {
	return employeePaymentData.map((d) => {
		return {
			...d,
			long_service_allowance_type: t(
				`long_service_allowance_type.${d.long_service_allowance_type}`
			),
			start_date: d.start_date,
			end_date: d.end_date,
			functions: {
				create: d.creatable,
				update: d.updatable,
				delete: d.deletable,
			},
		};
	});
}

export function EmployeePaymentTable({ period_id }: any) {
	const { t } = useTranslation(["common"]);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

	const { isLoading, isError, data, error } =
		api.employeePayment.getCurrentEmployeePayment.useQuery({ period_id });

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
			{/* // TODO: figure out its type */}
			<DataTableUpdate
				columns={employee_payment_columns({
					t,
					setOpen,
					setMode,
					setData: () => {},
				})}
				columnNames={columnNames}
				data={employeePaymentMapper(t, data)}
				historyDataFunction={() =>
					api.employeePayment.getAllEmployeePayment.useQuery()
				}
				calendarDataFunction={() =>
					api.employeePayment.getAllEmployeePayment.useQuery()
				}
			/>
		</Sheet>
	);
}
