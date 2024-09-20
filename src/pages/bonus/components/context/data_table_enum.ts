export const TableEnumValues = [
	// "TableBonusSetting",
	"TableBonusWorkType",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusPositionType",
	"TableBonusSeniority",
	"TableSalaryIncomeTax",
	// "TablePerformanceLevel",
] as const;

export type TableEnum = (typeof TableEnumValues)[number];

function getTableName(table: TableEnum) {
	switch (table) {
		// case "TableBonusSetting":
		// 	return "bonusSetting";
		case "TableBonusWorkType":
			return "bonusWorkType";
		case "TableBonusDepartment":
			return "bonusDepartment";
		case "TableBonusPosition":
			return "bonusPosition";
		case "TableBonusPositionType":
			return "bonusPositionType";
		case "TableBonusSeniority":
			return "bonusSeniority";
		case "TableSalaryIncomeTax":
			return "salaryIncomeTax";
		// case "TablePerformanceLevel":
		// 	return "performanceLevel";
	}
}

export function getTableNameKey(table: TableEnum) {
  return `table_name.${getTableName(table)}`
}
