import React, {
	useState,
	PropsWithChildren,
} from "react";
import dataTableContext from "./data_table_context";
import { ShowTableEnum, ShowTableEnumValues } from "../../shown_tables";

interface DataTableContextProviderProps {}

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTable, setSelectedTable] = useState<ShowTableEnum>(ShowTableEnumValues[0]);

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
