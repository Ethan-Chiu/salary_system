import * as z from "zod";
import * as TABLE_NAMES from "../../table_names";
import { Translate } from "~/lib/utils/translation";

// JSON Configs
import attendanceConfig from "./configurations/attendance.json"
import bankConfig from "./configurations/bank.json"
import insuranceConfig from "./configurations/insurance.json"

import bonusSettingConfig from "./configurations/bonus.json"
import bonusDepartmentConfig from "./configurations/bonusDepartment.json"
import bonusPositionConfig from "./configurations/bonusPosition.json"
import bonusPositionTypeConfig from "./configurations/bonusPositionType.json"
import bonusSeniorityConfig from "./configurations/bonusSeniority.json"

import levelConfig from "./configurations/level.json"
import levelRangeConfig from "./configurations/levelRange.json"
// import {levelRangeConfig} from "./configurations/levelRange"

import performanceLevelConfig from "./configurations/performanceLevel.json"
import trustMoneyConfig from "./configurations/trustMoney.json"
import { createSchema } from "./create_schema";
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

// const attendanceSchema = (mode: string) => {
// 	return createSchema(attendanceConfig, mode);
// }

// const bankSchema = (mode: string) => {
// 	return createSchema(bankConfig, mode);
// }

// const insuranceSchema = (mode: string) => {
// 	return createSchema(insuranceConfig, mode);
// }

// const bonusSettingSchema = (mode: string) => {
// 	return createSchema(bonusSettingConfig, mode);
// }

// const bonusDepartmentSchema = (mode: string) => {
//     return createSchema(bonusDepartmentConfig, mode);
// }

// const bonusPositionSchema = (mode: string) => {
//     return createSchema(bonusPositionConfig, mode);
// }

// const bonusPositionTypeSchema = (mode: string) => {
//     return createSchema(bonusPositionTypeConfig, mode);
// }

// const bonusSenioritySchema = (mode: string) => {
//     return createSchema(bonusSeniorityConfig, mode);
// }

// const levelSchema = (mode: string) => {
//     return createSchema(levelConfig, mode);
// }

// const levelRangeSchema = (mode: string) => {
//     return createSchema(levelRangeConfig, mode);
// }

// const performanceLevelSchema = (mode: string) => {
//     return createSchema(performanceLevelConfig, mode);
// }

// const trustMoneySchema = (mode: string) => {
//     return createSchema(trustMoneyConfig, mode);
// }

export function getSchema(table: TableEnum) {
    switch(table) {
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
            return null
    }
}