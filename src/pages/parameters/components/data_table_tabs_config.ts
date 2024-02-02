import { ShowTableEnum } from "../shown_tables";

export function hasCalendarTabs(tableType: ShowTableEnum): boolean {
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