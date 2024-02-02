import React, { useState, PropsWithChildren } from "react";
import dataTableContext from "./data_table_context";
import { ShowTableEnum, ShowTableEnumValues } from "../../shown_tables";
import { TabsEnumType } from "./tabs_enum";
import { Table } from "@tanstack/react-table";

interface DataTableContextProviderProps {}

export type TableWithKey = {
	table: Table<any>;
	key: string;
}

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTableType, setSelectedTableType] = useState<ShowTableEnum>(
		ShowTableEnumValues[0]
	);
	const [selectedTab, setSelectedTab] = useState<TabsEnumType>("now");
	const [selectedTable, setSelectedTable] = useState<TableWithKey | null>(null);

	return (
		<dataTableContext.Provider
			value={{
				selectedTableType,
				setSelectedTableType,
				selectedTab,
				setSelectedTab,
				selectedTable,
				setSelectedTable,
			}}
		>
			{children}
		</dataTableContext.Provider>
	);
}
