import { type TableEnum } from "../components/context/data_table_enum";
import { bonusSchema } from "./configurations/bonus_schema";
import { bonusDepartmentSchema } from "./configurations/bonus_department_schema";
import { bonusPositionSchema } from "./configurations/bonus_position_schema";
import { bonusPositionTypeSchema } from "./configurations/bonus_position_type_schema";
import { bonusSenioritySchema } from "./configurations/bonus_seniority_schema";

export function getSchema(table: TableEnum) {
	switch (table) {
		// bonus
		// case "TableBonusSetting":
		// 	return bonusSchema;
		case "TableBonusDepartment":
			return bonusDepartmentSchema;
		case "TableBonusPosition":
			return bonusPositionSchema;
		case "TableBonusPositionType":
			return bonusPositionTypeSchema;
		case "TableBonusSeniority":
			return bonusSenioritySchema;
		// level
		// case "TablePerformanceLevel":
		// 	return performanceLevelSchema;
		default:
			throw Error("Table not found");
	}
}
