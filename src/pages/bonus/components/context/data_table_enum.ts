export const TableEnumValues = [
	// "TableBonusSetting",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusPositionType",
	"TableBonusSeniority",
	// "TablePerformanceLevel",
] as const;

export type TableEnum = (typeof TableEnumValues)[number];

function getTableName(table: TableEnum) {
	switch (table) {
		// case "TableBonusSetting":
		// 	return "bonusSetting";
		case "TableBonusDepartment":
			return "bonusDepartment";
		case "TableBonusPosition":
			return "bonusPosition";
		case "TableBonusPositionType":
			return "bonusPositionType";
		case "TableBonusSeniority":
			return "bonusSeniority";
		// case "TablePerformanceLevel":
		// 	return "performanceLevel";
	}
}

export function getTableNameKey(table: TableEnum) {
  return `table_name.${getTableName(table)}`
}
