import { type ColumnDef } from "@tanstack/react-table";
import {
	bonusDepartmentMapper,
	bonus_department_columns,
} from "./bonus_department_table";
import {
	bonusPositionMapper,
	bonus_position_columns,
} from "./bonus_position_table";
import {
	bonusPositionTypeMapper,
	bonus_position_type_columns,
} from "./bonus_position_type_table";
import {
	bonusSeniorityMapper,
	bonus_seniority_columns,
} from "./bonus_seniority_table";
import { bonusMapper, bonus_columns } from "./bonus_table";
import { performaceLevelMapper,  performance_level_columns } from "./performance_level_table";
import { type TFunction } from "i18next";
import { BonusTableEnum } from "../bonus_tables";

export function getTableColumn(
	selectedTableType: BonusTableEnum,
  t: TFunction<[string], undefined>
): ColumnDef<any, any>[] {
	switch (selectedTableType) {
		case "TableBonusDepartment":
			return bonus_department_columns;
		case "TableBonusPosition":
			return bonus_position_columns;
		case "TableBonusPositionType":
			return bonus_position_type_columns;
		case "TableBonusSeniority":
			return bonus_seniority_columns;
		// case "TableBonusSetting":
		// 	return bonus_columns;
		// case "TablePerformanceLevel":
		// 	return performance_level_columns;
	}
}

export function getTableMapper(selectedTableType: BonusTableEnum) {
	switch (selectedTableType) {
		case "TableBonusDepartment":
			return bonusDepartmentMapper;
		case "TableBonusPosition":
			return bonusPositionMapper;
		case "TableBonusPositionType":
			return bonusPositionTypeMapper;
		case "TableBonusSeniority":
			return bonusSeniorityMapper;
		// case "TableBonusSetting":
		// 	return bonusMapper;
		// case "TablePerformanceLevel":
		// 	return performaceLevelMapper;
	}
}
