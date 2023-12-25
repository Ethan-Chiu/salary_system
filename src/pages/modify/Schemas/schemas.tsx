import * as z from "zod";
import * as TABLE_NAMES from "../../table_names";
import { Translate } from "~/pages/develop_parameters/utils/translation";
import { createSchema } from "./createSchema";
// JSON Configs
import attendanceConfig from "./configurations/attendance.json"
import bankConfig from "./configurations/bank.json"
import insuranceConfig from "./configurations/insurance.json"
import bonusSettingConfig from "./configurations/bonus.json"
import bonusDepartmentConfig from "./configurations/bonusDepartment.json"
import bonusPositionConfig from "./configurations/bonusPosition.json"
import bonusPositionTypeConfig from "./configurations/bonusPositionType.json"
import bonusSeniorityConfig from "./configurations/bonusSeniority.json"



const attendanceSchema = (mode: string) => {
	return createSchema(attendanceConfig, mode);
}

const bankSchema = (mode: string) => {
	return createSchema(bankConfig, mode);
}

const insuranceSchema = (mode: string) => {
	return createSchema(insuranceConfig, mode);
}

const bonusSettingSchema = (mode: string) => {
	return createSchema(bonusSettingConfig, mode);
}

const bonusDepartmentSchema = (mode: string) => {
    return createSchema(bonusDepartmentConfig, mode);
}

const bonusPositionSchema = (mode: string) => {
    return createSchema(bonusPositionConfig, mode);
}

const bonusPositionTypeSchema = (mode: string) => {
    return createSchema(bonusPositionTypeConfig, mode);
}

const bonusSenioritySchema = (mode: string) => {
    return createSchema(bonusSeniorityConfig, mode);
}

export function getSchema(table_name: string) {
    switch(table_name) {
        case TABLE_NAMES.TABLE_ATTENDANCE:
            return attendanceSchema;
        case TABLE_NAMES.TABLE_BANK_SETTING:
            return bankSchema;
		case TABLE_NAMES.TABLE_INSURANCE:
			return insuranceSchema;
        case TABLE_NAMES.TABLE_BONUS_SETTING:
            return bonusSettingSchema;
        case TABLE_NAMES.TABLE_BONUS_DEPARTMENT:
            return bonusDepartmentSchema;
        case TABLE_NAMES.TABLE_BONUS_POSITION:
            return bonusPositionSchema;
        case TABLE_NAMES.TABLE_BONUS_POSITION_TYPE:
            return bonusPositionTypeSchema;
        case TABLE_NAMES.TABLE_BONUS_SENIORITY:
            return bonusSenioritySchema;
        default:
            return null
    }
}