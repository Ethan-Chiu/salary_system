import * as TABLE_NAMES from "../../table_names";
import {attendanceSchema} from "./attendanceSchema"
import { bankSchema } from "./bankSchema"


export function getSchema(table_name: string) {
    switch(table_name) {
        case TABLE_NAMES.TABLE_ATTENDANCE:
            return attendanceSchema;
        case TABLE_NAMES.TABLE_BANK_SETTING:
            return bankSchema;
        default:
            return null
    }
}