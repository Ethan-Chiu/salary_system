import { type TableEnum } from "./components/context/data_table_enum";

export type ParameterTableEnum = Extract<TableEnum, (typeof ParameterTableEnumValues)[number]>;

export  const ParameterTableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableBonusSetting",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusPositionType",
	"TableBonusSeniority",
	"TableLevelRange",
	"TableLevel",
	"TablePerformanceLevel",
] as const;
