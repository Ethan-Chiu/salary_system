import React from "react";
import { type ShowTableEnum, ShowTableEnumValues } from "../../shown_tables";
import { TabsEnum, type TabsEnumType } from "./tabs_enum";
import { type TableWithKey } from "./data_table_context_provider";

const dataTableContext = React.createContext<{
	selectedTableType: ShowTableEnum;
	setSelectedTableType: (table: ShowTableEnum) => void;
	selectedTab: TabsEnumType;
	setSelectedTab: (tab: TabsEnumType) => void;
	selectedTable: TableWithKey | null;
	setSelectedTable: (table: TableWithKey | null) => void;
}>({
	selectedTableType: ShowTableEnumValues[0],
	setSelectedTableType: (_: ShowTableEnum) => undefined,
	selectedTab: TabsEnum.Enum.current,
	setSelectedTab: (_: TabsEnumType) => undefined,
	selectedTable: null,
	setSelectedTable: (_: TableWithKey | null) => undefined,
});

export default dataTableContext;
