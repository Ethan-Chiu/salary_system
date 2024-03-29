import { type ParameterTableEnum } from "../parameter_tables";

export function hasHistory(tableType: ParameterTableEnum): boolean {
	switch (tableType) {
		// case "TableAttendance":
		// case "TableBankSetting":
		// case "TableInsurance":
		// case "TableBonusSetting":
		case "TableBonusDepartment":
		case "TableBonusPosition":
		case "TableBonusPositionType":
		case "TableBonusSeniority":
			return false;
		default:
			return true;
	}
}
