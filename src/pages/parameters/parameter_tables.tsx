import { type TableEnum } from "./components/context/data_table_enum";

export type ParameterTableEnum = Extract<
	TableEnum,
	(typeof ParameterTableEnumValues)[number]
>;

export const ParameterTableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableTrustMoney",
	"TableLevel",
	"TableLevelRange",
	"TableBonusSetting",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusPositionType",
	"TableBonusSeniority",
	"TablePerformanceLevel",
] as const;
