export const TableEnumValues = [
	// "TableBonusSetting",
	"TableBonusAll",
	"TableBonusWorkType",
	"TableBonusDepartment",
	"TableBonusPosition",
	// "TableBonusPositionType",
	"TableBonusSeniority",
	"TableEmployeeBonus",
	// "TablePerformanceLevel",
] as const;

export type TableEnum = (typeof TableEnumValues)[number];

function getTableName(table: TableEnum) {
	switch (table) {
		// case "TableBonusSetting":
		// 	return "bonusSetting";
		case "TableBonusAll":
			return "bonusAll";
		case "TableBonusWorkType":
			return "bonusWorkType";
		case "TableBonusDepartment":
			return "bonusDepartment";
		case "TableBonusPosition":
			return "bonusPosition";
		// case "TableBonusPositionType":
		// 	return "bonusPositionType";
		case "TableBonusSeniority":
			return "bonusSeniority";
		case "TableEmployeeBonus":
			return "employeeBonus";
		// case "TablePerformanceLevel":
		// 	return "performanceLevel";
	}
}

export function getTableNameKey(table: TableEnum) {
	return `table_name.${getTableName(table)}`
}
