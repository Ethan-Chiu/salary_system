import { type TableEnum } from "./components/context/data_table_enum";

export type BonusTableEnum = Extract<
	TableEnum,
	(typeof BonusTableEnumValues)[number]
>;

export const BonusTableEnumValues = [
	// "TableBonusSetting",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusPositionType",
	"TableBonusSeniority",
	// "TablePerformanceLevel",
] as const;
