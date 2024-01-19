import React from "react";
import { ShowTableEnum, ShowTableEnumValues } from "../../shown_tables";
import { TabsEnumType } from "./tabs_enum";
import { Table } from "@tanstack/react-table";

const dataTableContext = React.createContext<{
	selectedTableType: ShowTableEnum;
	setSelectedTableType: (table: ShowTableEnum) => void;
	selectedTab: TabsEnumType;
	setSelectedTab: (table: TabsEnumType) => void;
	selectedTable: Table<any> | null;
	setSelectedTable: (table: Table<any>) => void;
}>({
	selectedTableType: ShowTableEnumValues[0],
	setSelectedTableType: (table: ShowTableEnum) => {},
	selectedTab: "now",
	setSelectedTab: (tab: TabsEnumType) => {},
	selectedTable: null,
	setSelectedTable: (value: Table<any>) => {},
});

export default dataTableContext;
