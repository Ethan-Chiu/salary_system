import { type BonusTableEnum } from "../bonus_tables";

export function hasHistory(tableType: BonusTableEnum): boolean {
	switch (tableType) {
		// case "TableAttendance":
		// case "TableBankSetting":
		// case "TableInsurance":
		// case "TableBonusSetting":
		// case "TableBonusDepartment":
		// case "TableBonusPosition":
		// case "TableBonusPositionType":
		// case "TableBonusSeniority":
		// case "TableLevelRange":
		// case "TableLevel":
		// case "TablePerformanceLevel":
			// return true;
		default:
			return false;
	}
}
