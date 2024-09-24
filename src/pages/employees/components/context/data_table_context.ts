import React from "react";
import {
	type EmployeeTableEnum,
	EmployeeTableEnumValues,
} from "../../employee_tables";
import { type EmpTableObject } from "./data_table_context_provider";
import { EmpTabsEnum, type EmpTabsEnumType } from "./employee_tabs_enum";

const dataTableContext = React.createContext<{
	selectedTableType: EmployeeTableEnum;
	setSelectedTableType: (table: EmployeeTableEnum) => void;
	selectedTab: EmpTabsEnumType;
	setSelectedTab: (tab: EmpTabsEnumType) => void;
	selectedTable: EmpTableObject | null;
	setSelectedTable: (table: EmpTableObject | null) => void;
}>({
	selectedTableType: EmployeeTableEnumValues[0],
	setSelectedTableType: (_: EmployeeTableEnum) => undefined,
	selectedTab: EmpTabsEnum.Enum.current,
	setSelectedTab: (_: EmpTabsEnumType) => undefined,
	selectedTable: null,
	setSelectedTable: (_: EmpTableObject | null) => undefined,
});

export default dataTableContext;
