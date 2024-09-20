import React from "react";
import {
	type BonusTableEnum,
	BonusTableEnumValues,
} from "../../bonus_tables";
import { type TableObject } from "./data_table_context_provider";
import { BonusTypeEnum, BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

const dataTableContext = React.createContext<{
	selectedTableType: BonusTableEnum;
	setSelectedTableType: (table: BonusTableEnum) => void;
	selectedBonusType: BonusTypeEnumType;
	setSelectedBonusType: (bonus_type: BonusTypeEnumType) => void;
	selectedTable: TableObject | null;
	setSelectedTable: (table: TableObject | null) => void;
}>({
	selectedTableType: BonusTableEnumValues[0],
	setSelectedTableType: (_: BonusTableEnum) => undefined,
	selectedBonusType: Object.values(BonusTypeEnum.Enum)[0]!,
	setSelectedBonusType: (_: BonusTypeEnumType) => undefined,
	selectedTable: null,
	setSelectedTable: (_: TableObject | null) => undefined,
});

export default dataTableContext;
