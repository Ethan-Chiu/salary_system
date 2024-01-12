import React, {
	useState,
	PropsWithChildren,
} from "react";
import dataTableContext from "./data_table_context";
import TableEnum from "./data_table_enum";

interface DataTableContextProviderProps {}

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTable, setSelectedTable] = useState<TableEnum | undefined>("TableAttendance");
	
	

	return (
		<dataTableContext.Provider
			value={{
				selectedTable,
				setSelectedTable,
			}}
		>
			{children}
		</dataTableContext.Provider>
	);
}
