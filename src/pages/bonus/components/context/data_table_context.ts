import React from "react";
import {
	BonusTableEnumValues,
} from "../../bonus_tables";
import { type TableObject } from "./data_table_context_provider";
import { bonusTypeEnum, type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { type TableEnum } from "./data_table_enum";

// export type FunctionMode = "create" | "update" | "delete" | "none";

export type FunctionMode =
	| "create"
	| "create_with_blank"
	| "batch_create"
	| "update"
	| "batch_update"
	| "delete"
	| "auto_calculate"
	| "excel_download"
	| "excel_upload"
	| "initialize"
	| "none";

export type FunctionsItem = {
	create: boolean;
	update: boolean;
	delete: boolean;
};

export interface DataWithFunctions {
	functions: FunctionsItem;
}

const dataTableContext = React.createContext<{
	selectedTableType: TableEnum;
	setSelectedTableType: (table: TableEnum) => void;
	selectedBonusType: BonusTypeEnumType;
	setSelectedBonusType: (bonus_type: BonusTypeEnumType) => void;
	selectedTable: TableObject | null;
	setSelectedTable: (table: TableObject | null) => void;
	mode: FunctionMode;
	setMode: (mode: FunctionMode) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	data: any;
	setData: (data: any) => void;
}>({
	selectedTableType: BonusTableEnumValues[0],
	setSelectedTableType: (_: TableEnum) => undefined,
	selectedBonusType: Object.values(bonusTypeEnum.Enum)[0]!,
	setSelectedBonusType: (_: BonusTypeEnumType) => undefined,
	selectedTable: null,
	setSelectedTable: (_: TableObject | null) => undefined,
	mode: "none",
	setMode: (_: FunctionMode) => undefined,
	open: false,
	setOpen: (_: boolean) => undefined,
	data: null,
	setData: (_: any) => undefined,
});

export default dataTableContext;
