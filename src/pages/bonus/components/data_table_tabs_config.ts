import { TableEnum } from "./context/data_table_enum";

export function hasHistory(tableType: TableEnum): boolean {
	switch (tableType) {
		case "TableBonusAll":
		case "TableBonusWorkType":
		case "TableBonusDepartment":
		case "TableBonusPosition":
		case "TableBonusSeniority":
			return true;
		default:
			return false;
	}
}
