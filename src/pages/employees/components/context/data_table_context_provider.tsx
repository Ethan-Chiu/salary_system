import React, { useState, type PropsWithChildren } from "react";
import dataTableContext from "./data_table_context";
import {
	type EmployeeTableEnum,
	EmployeeTableEnumValues,
} from "../../employee_tables";

interface DataTableContextProviderProps {}

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTableType, setSelectedTableType] =
		useState<EmployeeTableEnum>(EmployeeTableEnumValues[0]);

	return (
		<dataTableContext.Provider
			value={{
				selectedTableType,
				setSelectedTableType,
			}}
		>
			{children}
		</dataTableContext.Provider>
	);
}
