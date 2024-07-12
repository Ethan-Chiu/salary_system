import { useContext } from "react";
import { LoadingSpinner } from "~/components/loading";
import dataTableContext from "~/pages/parameters/components/context/data_table_context";

interface DataTableToolbarProps<TData> {
	filterColumnKey?: keyof TData;
}

export function DataTableToolbar<TData>({}: DataTableToolbarProps<TData>) {
	const { selectedTable } = useContext(dataTableContext);
	const table = selectedTable?.table;

	if (!table) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}
}
