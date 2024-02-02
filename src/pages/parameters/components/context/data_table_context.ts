import React from "react";
import { ShowTableEnum, ShowTableEnumValues } from "../../shown_tables";
import { TabsEnum, TabsEnumType } from "./tabs_enum";
import { Table } from "@tanstack/react-table";
import { TableWithKey } from "./data_table_context_provider";

const dataTableContext = React.createContext<{
	selectedTableType: ShowTableEnum;
	setSelectedTableType: (table: ShowTableEnum) => void;
	selectedTab: TabsEnumType;
	setSelectedTab: (tab: TabsEnumType) => void;
	selectedTable: TableWithKey | null;
	setSelectedTable: (table: TableWithKey | null) => void;
}>({
	selectedTableType: ShowTableEnumValues[0],
	setSelectedTableType: (table: ShowTableEnum) => {},
	selectedTab: TabsEnum.Enum.current,
	setSelectedTab: (tab: TabsEnumType) => {},
	selectedTable: null,
	setSelectedTable: (value: TableWithKey | null) => {},
});

export default dataTableContext;
