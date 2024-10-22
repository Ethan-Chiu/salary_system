import { type ParameterTableEnum } from "../parameter_tables";

export function hasHistory(tableType: ParameterTableEnum): boolean {
	switch (tableType) {
		case "TableAttendance":
		case "TableBankSetting":
		case "TableInsurance":
		case "TableLevelRange":
		case "TableLevel":
		case "TableTrustMoney":
		case "TableSalaryIncomeTax":
			return true;
		default:
			return false;
	}
}
