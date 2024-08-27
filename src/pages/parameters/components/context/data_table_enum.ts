export const TableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableTrustMoney",
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
		case "TableTrustMoney":
			return "trustMoney";
		case "TableBonusSetting":
			return "bonusSetting";
		case "TableBonusDepartment":
			return "bonusDepartment";
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
			return "employeePayment";
		case "TableEmployeeTrust":
			return "employeeTrust";
	}
}

export function getTableNameKey(table: TableEnum) {
  return `table_name.${getTableName(table)}`
}
