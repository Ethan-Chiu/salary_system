import React from "react";
import {
	type BonusTableEnum,
	BonusTableEnumValues,
} from "../../bonus_tables";
import { type TableObject } from "./data_table_context_provider";

const dataTableContext = React.createContext<{
	selectedTableType: BonusTableEnum;
	setSelectedTableType: (table: BonusTableEnum) => void;
	selectedTable: TableObject | null;
	setSelectedTable: (table: TableObject | null) => void;
}>({
	selectedTableType: BonusTableEnumValues[0],
	setSelectedTableType: (_: BonusTableEnum) => undefined,
	selectedTable: null,
	setSelectedTable: (_: TableObject | null) => undefined,
});

export default dataTableContext;
