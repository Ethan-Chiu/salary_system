import * as z from "zod";
import * as TABLE_NAMES from "../../table_names";
import { Translate } from "~/pages/develop_parameters/utils/translation";
import { createSchema } from "./createSchema";
// JSON Configs
import attendanceConfig from "./configurations/attendance.json"
import bankConfig from "./configurations/bank.json"
import insuranceConfig from "./configurations/insurance.json"
import bonusSettingConfig from "./configurations/bonus.json"

function getTranslate(key: string) {
	return Translate(key) ?? "Not found"
}

function getRequiredError(key: string) {
	return {required_error: getTranslate(key) + " is required."}
}

function getInvalidNumberError(key: string) {
	return {invalid_type_error: getTranslate(key) + " must be a number.",};
}

export const attendanceSchema = (mode: string) => {
	return createSchema(attendanceConfig, mode);
}

export const bankSchema = (mode: string) => {
	return createSchema(bankConfig, mode);
}

export const insuranceSchema = (mode: string) => {
	return createSchema(insuranceConfig, mode);
}

export const bonusSettingSchema = (mode: string) => {
	return createSchema(bonusSettingConfig, mode);
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
        default:
            return null
    }
}