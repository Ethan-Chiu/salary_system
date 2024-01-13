import React from "react";
import { ShowTableEnum } from "../../shown_tables";

const dataTableContext = React.createContext<{
	selectedTable: ShowTableEnum | undefined;
	setSelectedTable: (table: ShowTableEnum) => void;
}>({
	selectedTable: undefined,
	setSelectedTable: (table: ShowTableEnum) => {},
});

export default dataTableContext;
