import { type ColumnDef } from "@tanstack/react-table";
import { WithDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { useEmployeeTableContext } from "../context/data_table_context_provider";
import { CurrentViewTable } from "~/components/data_table/current_view/current_view_table";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
}

export function CurrentView<TData>({
	columns,
	data,
}: DataTableProps<TData>) {
	const { setSelectedTable } = useEmployeeTableContext();

	return WithDataTableStandardState({
		columns: columns,
		data,
		props: {},
		WrappedComponent: CurrentViewTable,
		onUpdate: (table) => {
			setSelectedTable({ table: table });
		},
	});
}

