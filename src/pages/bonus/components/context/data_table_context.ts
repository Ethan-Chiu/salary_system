import React from "react";
import {
	BonusTableEnumValues,
} from "../../bonus_tables";
import { type TableObject } from "./data_table_context_provider";
import { bonusTypeEnum, type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { type TableEnum } from "./data_table_enum";

const dataTableContext = React.createContext<{
	selectedTableType: TableEnum;
	setSelectedTableType: (table: TableEnum) => void;
	selectedBonusType: BonusTypeEnumType;
	setSelectedBonusType: (bonus_type: BonusTypeEnumType) => void;
	selectedTable: TableObject | null;
	setSelectedTable: (table: TableObject | null) => void;
}>({
	selectedTableType: BonusTableEnumValues[0],
	setSelectedTableType: (_: TableEnum) => undefined,
	selectedBonusType: Object.values(bonusTypeEnum.Enum)[0]!,
	setSelectedBonusType: (_: BonusTypeEnumType) => undefined,
	selectedTable: null,
	setSelectedTable: (_: TableObject | null) => undefined,
});

export default dataTableContext;
