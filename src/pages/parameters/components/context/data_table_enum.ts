export const TableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableTrustMoney",
	"TableLevel",
	"TableLevelRange",
	"TableTrustMoney",
	"TableBasicInfo",
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
		case "TableLevel":
			return "level";
		case "TableLevelRange":
			return "levelRange";
		case "TableTrustMoney":
			return "trustMoney";
		case "TableBasicInfo":
			return "basicInfo";
	}
}

export function getTableNameKey(table: TableEnum) {
  return `table_name.${getTableName(table)}`
}
