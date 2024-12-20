import React from "react";
import {
	type ParameterTableEnum,
	ParameterTableEnumValues,
} from "../../parameter_tables";
import { TabsEnum, type TabsEnumType } from "./tabs_enum";
import { type TableObject } from "./data_table_context_provider";

export type FunctionMode = "create" | "update" | "delete" | "none";

const dataTableContext = React.createContext<{
	selectedTableType: ParameterTableEnum;
	setSelectedTableType: (table: ParameterTableEnum) => void;
	selectedTab: TabsEnumType;
	setSelectedTab: (tab: TabsEnumType) => void;
	selectedTable: TableObject | null;
	setSelectedTable: (table: TableObject | null) => void;
	mode: FunctionMode;
	setMode: (mode: FunctionMode) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	functionsItem: { create: boolean; update: boolean; delete: boolean };
	setFunctionsItem: (functions: { create: boolean; update: boolean; delete: boolean }) => void;
}>({
	selectedTableType: ParameterTableEnumValues[0],
	setSelectedTableType: (_: ParameterTableEnum) => undefined,
	selectedTab: TabsEnum.Enum.current,
	setSelectedTab: (_: TabsEnumType) => undefined,
	selectedTable: null,
	setSelectedTable: (_: TableObject | null) => undefined,
	mode: "none",
	setMode: (_: FunctionMode) => undefined,
	open: false,
	setOpen: (_: boolean) => undefined,
	functionsItem: { create: false, update: false, delete: false },
	setFunctionsItem: (_: { create: boolean; update: boolean; delete: boolean }) => undefined,
});

export default dataTableContext;
