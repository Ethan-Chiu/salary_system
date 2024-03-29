import React from "react";
import {
	EmployeeTableEnum,
	EmployeeTableEnumValues,
} from "../../employee_tables";
const dataTableContext = React.createContext<{
	selectedTableType: EmployeeTableEnum;
	setSelectedTableType: (table: EmployeeTableEnum) => void;
}>({
	selectedTableType: EmployeeTableEnumValues[0],
	setSelectedTableType: (_: EmployeeTableEnum) => undefined,
});

export default dataTableContext;
