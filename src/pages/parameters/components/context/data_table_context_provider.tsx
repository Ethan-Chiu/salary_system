import React, { useState, type PropsWithChildren } from "react";
import dataTableContext from "./data_table_context";
import {
	type ParameterTableEnum,
	ParameterTableEnumValues,
} from "../../parameter_tables";
import { TabsEnum, type TabsEnumType } from "./tabs_enum";
import { type Table } from "@tanstack/react-table";

interface DataTableContextProviderProps {}

export type TableObject = {
	table: Table<any>;
};

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTableType, setSelectedTableType] =
		useState<ParameterTableEnum>(ParameterTableEnumValues[0]);
	const [selectedTab, setSelectedTab] = useState<TabsEnumType>(
		TabsEnum.Enum.current
	);
	const [selectedTable, setSelectedTable] = useState<TableObject | null>(
		null
	);

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
