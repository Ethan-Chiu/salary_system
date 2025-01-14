import React from "react";
import {
	type EmployeeTableEnum,
	EmployeeTableEnumValues,
} from "../../employee_tables";
import { type EmpTableObject } from "./data_table_context_provider";
import { EmpTabsEnum, type EmpTabsEnumType } from "./employee_tabs_enum";

export type FunctionMode =
	| "create"
	| "update"
	| "delete"
	| "excel_upload"
	| "excel_download"
	| "initialize"
	| "auto_calculate"
	| "none";

export type FunctionsItem = {
	creatable: boolean;
	updatable: boolean;
	deletable: boolean;
};

export interface DataWithFunctions {
	functions: FunctionsItem;
}

const dataTableContext = React.createContext<{
	selectedTableType: EmployeeTableEnum;
	setSelectedTableType: (table: EmployeeTableEnum) => void;
	selectedTab: EmpTabsEnumType;
	setSelectedTab: (tab: EmpTabsEnumType) => void;
	selectedTable: EmpTableObject | null;
	setSelectedTable: (table: EmpTableObject | null) => void;
	mode: FunctionMode;
	setMode: (mode: FunctionMode) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	data: any;
	setData: (data: any) => void;
}>({
	selectedTableType: EmployeeTableEnumValues[0],
	setSelectedTableType: (_: EmployeeTableEnum) => undefined,
	selectedTab: EmpTabsEnum.Enum.current,
	setSelectedTab: (_: EmpTabsEnumType) => undefined,
	selectedTable: null,
	setSelectedTable: (_: EmpTableObject | null) => undefined,
	mode: "none",
	setMode: (_: FunctionMode) => undefined,
	open: false,
	setOpen: (_: boolean) => undefined,
	data: null,
	setData: (_: any) => undefined,
});

export default dataTableContext;
