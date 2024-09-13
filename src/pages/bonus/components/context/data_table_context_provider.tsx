import React, { useState, type PropsWithChildren } from "react";
import dataTableContext from "./data_table_context";
import {
	type BonusTableEnum,
	BonusTableEnumValues,
} from "../../bonus_tables";
import { type Table } from "@tanstack/react-table";

interface DataTableContextProviderProps { }

export type TableObject = {
	table: Table<any>;
};

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTableType, setSelectedTableType] =
		useState<BonusTableEnum>(BonusTableEnumValues[0]);
	const [selectedTable, setSelectedTable] = useState<TableObject | null>(
		null
	);

	return (
		<dataTableContext.Provider
			value={{
				selectedTableType,
				setSelectedTableType,
				selectedTable,
				setSelectedTable,
			}}
		>
			{children}
		</dataTableContext.Provider>
	);
}
