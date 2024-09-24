import React, { useState, type PropsWithChildren } from "react";
import dataTableContext from "./data_table_context";
import {
	type EmployeeTableEnum,
	EmployeeTableEnumValues,
} from "../../employee_tables";
import { type Table } from "@tanstack/react-table";
import { EmpTabsEnum, type EmpTabsEnumType } from "./employee_tabs_enum";

interface DataTableContextProviderProps {}

export type EmpTableObject = {
	table: Table<any>;
};

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTableType, setSelectedTableType] =
		useState<EmployeeTableEnum>(EmployeeTableEnumValues[0]);

	const [selectedTab, setSelectedTab] = useState<EmpTabsEnumType>(
		EmpTabsEnum.Enum.current
	);

	const [selectedTable, setSelectedTable] = useState<EmpTableObject | null>(
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
