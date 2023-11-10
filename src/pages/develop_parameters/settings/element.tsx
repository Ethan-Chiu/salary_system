import { BankRow } from "../tables/bank_table"
import { SettingItem } from "../tables/parameter_table"
import { isDate, isNumber, isString } from "../utils/checkType"

export function Element({table_type, data}: {table_type: string, data: SettingItem | BankRow}) {
    switch(table_type) {
        case "typical":
            return <>
                
                {isDate(data.)}
            </>
    }
}