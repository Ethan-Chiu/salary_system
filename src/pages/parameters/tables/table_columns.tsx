import { ShowTableEnum } from "../shown_tables";
import { attendance_columns } from "./attendance_table";
import { bank_columns } from "./bank_table";
import { bonus_department_columns } from "./bonus_department_table";
import { bonus_position_columns } from "./bonus_position_table";
import { bonus_position_type_columns } from "./bonus_position_type_table";
import { bonus_seniority_columns } from "./bonus_seniority_table";
import { bonus_columns } from "./bonus_table";
import { insurance_rate_columns } from "./insurance_rate_table";

export function getTableColumn(selectedTable: ShowTableEnum) {
    switch(selectedTable) {
        case "TableAttendance": return attendance_columns;
        case "TableBankSetting": return bank_columns;
        case "TableBonusDepartment": return bonus_department_columns;
        case "TableBonusPosition": return bonus_position_columns;
        case "TableBonusPositionType": return bonus_position_type_columns;
        case "TableBonusSeniority": return bonus_seniority_columns;
        case "TableBonusSetting": return bonus_columns;
        case "TableInsurance": return insurance_rate_columns;
    }
}