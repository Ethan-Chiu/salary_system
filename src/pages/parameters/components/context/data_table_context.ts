import React from "react";
import TableEnum from "./data_table_enum";

const dataTableContext = React.createContext<{
	selectedTable: TableEnum | undefined;
	setSelectedTable: (table: TableEnum) => void;
}>({
	selectedTable: "TableAttendance",
	setSelectedTable: (table: TableEnum) => {},
});

export default dataTableContext;
