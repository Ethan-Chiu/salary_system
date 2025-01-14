import { LoadingSpinner } from "~/components/loading";
import { DataTableUpdate } from "../components/data_table_update";
import { api } from "~/utils/api";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { type EmployeeTrustFEType } from "~/server/api/types/employee_trust_type";
import { formatDate } from "~/lib/utils/format_date";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { type TFunction } from "i18next";
import {
	ColumnHeaderBaseComponent,
	ColumnHeaderComponent,
} from "~/components/data_table/column_header_component";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import {
	EmployeeTrustFunctionContextProvider,
	type TrustRowItem,
	type TrustRowItemKey,
	useTrustFunctionContext,
} from "./providers/employee_trust_provider";

const columnHelper = createColumnHelper<TrustRowItem>();

const columnNames: TrustRowItemKey[] = [
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
}: {
	t: TFunction<[string], undefined>;
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
			return <TrustFunctionComponent t={t} data={row.original} />;
		},
	}),
];

function TrustFunctionComponent({
	t,
	data,
}: {
	t: TFunction<[string], undefined>;
	data: TrustRowItem;
}) {
	const { setOpen, setMode, setData } = useTrustFunctionContext();

	return (
		<FunctionsComponent
			t={t}
			setOpen={setOpen}
			setMode={setMode}
			data={data}
			setData={setData}
		/>
	);
}

export function employeeTrustMapper(
	employeeTrustData: EmployeeTrustFEType[]
): TrustRowItem[] {
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

	// TODO: figure out data's type
	if (data) {
		return (
			<EmployeeTrustFunctionContextProvider>
				<DataTableUpdate
					columns={employee_trust_columns({ t })}
					columnNames={columnNames}
					data={employeeTrustMapper(data)}
					historyDataFunction={() =>
						api.employeeTrust.getAllEmployeeTrust.useQuery()
					}
					calendarDataFunction={() =>
						api.employeeTrust.getAllEmployeeTrust.useQuery()
					}
				/>
			</EmployeeTrustFunctionContextProvider>
		);
	}
	return <div />;
}
