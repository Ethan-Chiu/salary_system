import React, {
	useState,
	PropsWithChildren,
} from "react";
import dataTableContext from "./data_table_context";
import { ShowTableEnum, ShowTableEnumValues } from "../../shown_tables";
import { TabsEnumType } from "./tabs_enum";

interface DataTableContextProviderProps {}

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTable, setSelectedTable] = useState<ShowTableEnum>(ShowTableEnumValues[0]);
	const [selectedTab, setSelectedTab] = useState<TabsEnumType>("now");
	const [filterValue, setFilterValue] = useState<string>("");

	return (
		<dataTableContext.Provider
			value={{
				selectedTable,
				setSelectedTable,
				selectedTab,
				setSelectedTab,	
				filterValue,
				setFilterValue,
			}}
		>
			{children}
		</dataTableContext.Provider>
	);
}
