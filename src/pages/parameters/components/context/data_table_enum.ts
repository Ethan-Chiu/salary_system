export const TableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableBonusSetting",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusPositionType",
	"TableBonusSeniority",
	"TableLevel",
	"TableLevelRange",
	"TablePerformanceLevel",
	"TableTrustMoney",
	"TableBasicInfo",
	"TableEmployeePayment",
	"TableEmployeeTrust",
] as const;

export type TableEnum = (typeof TableEnumValues)[number];

function getTableName(table: TableEnum) {
	switch (table) {
		case "TableAttendance":
			return "attendanceSetting";
		case "TableBankSetting":
			return "bankSetting";
		case "TableInsurance":
			return "insuranceRateSetting";
		case "TableBonusSetting":
			return "bonusSetting";
		case "TableBonusDepartment":
			return "bonusDepartmentSetting";
		case "TableBonusPosition":
			return "bonusPosition";
		case "TableBonusPositionType":
			return "bonusPositionType";
		case "TableBonusSeniority":
			return "bonusSeniority";
		case "TableLevel":
			return "level";
		case "TableLevelRange":
			return "levelRange";
		case "TablePerformanceLevel":
			return "performanceLevel";
		case "TableTrustMoney":
			return "trustMoney";
		case "TableBasicInfo":
			return "basicInfo";
		case "TableEmployeePayment":
			return "員工薪資";
		case "TableEmployeeTrust":
			return "員工信託";
	}
}

export function getTableNameKey(table: TableEnum) {
  return `table_name.${getTableName(table)}`
}
