import React from "react";
import {
	type EmployeeTableEnum,
	EmployeeTableEnumValues,
} from "../../employee_tables";
import { type EmpTableObject } from "./data_table_context_provider";

const dataTableContext = React.createContext<{
	selectedTableType: EmployeeTableEnum;
	setSelectedTableType: (table: EmployeeTableEnum) => void;
	selectedTable: EmpTableObject | null;
	setSelectedTable: (table: EmpTableObject | null) => void;
}>({
	selectedTableType: EmployeeTableEnumValues[0],
	setSelectedTableType: (_: EmployeeTableEnum) => undefined,
	selectedTable: null,
	setSelectedTable: (_: EmpTableObject | null) => undefined,
});

export default dataTableContext;
