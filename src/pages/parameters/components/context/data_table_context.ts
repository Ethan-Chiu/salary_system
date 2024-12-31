import React from "react";
import {
	type ParameterTableEnum,
	ParameterTableEnumValues,
} from "../../parameter_tables";
import { TabsEnum, type TabsEnumType } from "./tabs_enum";
import { type TableObject } from "./data_table_context_provider";

export type FunctionMode = "create" | "update" | "delete" | "none";

export type FunctionsItem = {
	creatable: boolean;
	updatable: boolean;
	deletable: boolean;
};

export interface DataWithFunctions {
	functions: FunctionsItem;
}

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
	data: any;
	setData: (data: any) => void;
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
	data: null,
	setData: (_: any) => undefined,
});

export default dataTableContext;
