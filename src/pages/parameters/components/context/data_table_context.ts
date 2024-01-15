import React from "react";
import { ShowTableEnum, ShowTableEnumValues } from "../../shown_tables";

const dataTableContext = React.createContext<{
	selectedTable: ShowTableEnum;
	setSelectedTable: (table: ShowTableEnum) => void;
}>({
	selectedTable: ShowTableEnumValues[0],
	setSelectedTable: (table: ShowTableEnum) => {},
});

export default dataTableContext;
