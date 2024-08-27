import { type ColumnDef } from "@tanstack/react-table";
import { type ParameterTableEnum } from "../parameter_tables";
import { attendanceMapper, attendance_columns } from "./attendance_table";
import { bankSettingMapper, bank_columns } from "./bank_table";
import {
	insuranceRateMapper,
	insurance_rate_columns,
} from "./insurance_rate_table";
import { trustMoneyMapper, trust_money_columns } from "./trust_money_table";
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
import { levelMapper, level_columns } from "./level_table";
import { levelRangeMapper, level_range_columns } from "./level_range_table";
import { performaceLevelMapper,  performance_level_columns } from "./performance_level_table";
import { type TFunction } from "i18next";

export function getTableColumn(
	selectedTableType: ParameterTableEnum,
  t: TFunction<[string], undefined>
): ColumnDef<any, any>[] {
	switch (selectedTableType) {
		case "TableAttendance":
			return attendance_columns({t: t});
		case "TableBankSetting":
			return bank_columns;
		case "TableInsurance":
			return insurance_rate_columns;
		case "TableTrustMoney":
			return trust_money_columns({t: t});
		case "TableBonusDepartment":
			return bonus_department_columns;
		case "TableBonusPosition":
			return bonus_position_columns;
		case "TableBonusPositionType":
			return bonus_position_type_columns;
		case "TableBonusSeniority":
			return bonus_seniority_columns;
		case "TableBonusSetting":
			return bonus_columns;
		case "TableLevelRange":
			return level_range_columns;
		case "TableLevel":
			return level_columns;
		case "TablePerformanceLevel":
			return performance_level_columns;
	}
}

export function getTableMapper(selectedTableType: ParameterTableEnum) {
	switch (selectedTableType) {
		case "TableAttendance":
			return attendanceMapper;
		case "TableBankSetting":
			return bankSettingMapper;
		case "TableInsurance":
			return insuranceRateMapper;
		case "TableTrustMoney":
			return trustMoneyMapper;
		case "TableBonusDepartment":
			return bonusDepartmentMapper;
		case "TableBonusPosition":
			return bonusPositionMapper;
		case "TableBonusPositionType":
			return bonusPositionTypeMapper;
		case "TableBonusSeniority":
			return bonusSeniorityMapper;
		case "TableBonusSetting":
			return bonusMapper;
		case "TableLevelRange":
			return levelRangeMapper;
		case "TableLevel":
			return levelMapper;
		case "TablePerformanceLevel":
			return performaceLevelMapper;
	}
}
