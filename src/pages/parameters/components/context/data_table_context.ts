import React from "react";
import {
	type ParameterTableEnum,
	ParameterTableEnumValues,
} from "../../parameter_tables";
import { TabsEnum, type TabsEnumType } from "./tabs_enum";
import { type TableObject } from "./data_table_context_provider";

const dataTableContext = React.createContext<{
	selectedTableType: ParameterTableEnum;
	setSelectedTableType: (table: ParameterTableEnum) => void;
	selectedTab: TabsEnumType;
	setSelectedTab: (tab: TabsEnumType) => void;
	selectedTable: TableObject | null;
	setSelectedTable: (table: TableObject | null) => void;
}>({
	selectedTableType: ParameterTableEnumValues[0],
	setSelectedTableType: (_: ParameterTableEnum) => undefined,
	selectedTab: TabsEnum.Enum.current,
	setSelectedTab: (_: TabsEnumType) => undefined,
	selectedTable: null,
	setSelectedTable: (_: TableObject | null) => undefined,
});

export default dataTableContext;
