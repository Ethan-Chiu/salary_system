import TableEnum from "../components/context/data_table_enum";
import { attendanceSchema } from "./configurations/attendance_schema";
import { bankSchema } from "./configurations/bank_schema";
import { insuranceSchema } from "./configurations/insurance_schema";
import { bonusSchema } from "./configurations/bonus_schema";
import { bonusDepartmentSchema } from "./configurations/bonus_department_schema";
import { bonusPositionSchema } from "./configurations/bonus_position_schema";
import { bonusPositionTypeSchema } from "./configurations/bonus_position_type_schema";
import { bonusSenioritySchema } from "./configurations/bonus_seniority_schema";
import { levelSchema } from "./configurations/level_schema";
import { levelRangeSchema } from "./configurations/level_range_schema";
import { performanceLevelSchema } from "./configurations/performance_level_schema";
import { trustMoneySchema } from "./configurations/trust_money_schema";

export function getSchema(table: TableEnum) {
	switch (table) {
		case "TableAttendance":
			return attendanceSchema;
		case "TableBankSetting":
			return bankSchema;
		case "TableInsurance":
			return insuranceSchema;
		// bonus
		case "TableBonusSetting":
			return bonusSchema;
		case "TableBonusDepartment":
			return bonusDepartmentSchema;
		case "TableBonusPosition":
			return bonusPositionSchema;
		case "TableBonusPositionType":
			return bonusPositionTypeSchema;
		case "TableBonusSeniority":
			return bonusSenioritySchema;
		// level
		case "TableLevel":
			return levelSchema;
		case "TableLevelRange":
			return levelRangeSchema;
		case "TablePerformanceLevel":
			return performanceLevelSchema;
		case "TableTrustMoney":
			return trustMoneySchema;
		default:
			throw Error("Table not found");
	}
}
