import React from "react";
import { ShowTableEnum, ShowTableEnumValues } from "../../shown_tables";
import { TabsEnumType } from "./tabs_enum";

const dataTableContext = React.createContext<{
	selectedTable: ShowTableEnum;
	setSelectedTable: (table: ShowTableEnum) => void;
	selectedTab: TabsEnumType,
	setSelectedTab: (table: TabsEnumType) => void,
	filterValue: string,
	setFilterValue: (value: string) => void
}>({
	selectedTable: ShowTableEnumValues[0],
	setSelectedTable: (table: ShowTableEnum) => {},
	selectedTab: "now",
	setSelectedTab: (tab: TabsEnumType) => {},
	filterValue: "",
	setFilterValue: (value: string) => {},
});

export default dataTableContext;
