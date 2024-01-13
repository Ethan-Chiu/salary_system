import TableEnum from "./components/context/data_table_enum";

export type ShowTableEnum = Extract<TableEnum, (typeof ShowTableEnumValues)[number]>;

export  const ShowTableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableBonusSetting",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusPositionType",
	"TableBonusSeniority",
] as const;