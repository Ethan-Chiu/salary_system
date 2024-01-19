export const TableEnumValues = [
    "TableAttendance",
    "TableBankSetting",
    "TableInsurance",
    "TableBonusSetting",
    "TableBonusDepartment",
    "TableBonusPosition",
    "TableBonusPositionType",
    "TableBonusSeniority",
    "TableLevel",
    "TableLevelRange",
    "TablePerformanceLevel",
    "TableTrustMoney",
    "TableBasicInfo"
] as const;

type TableEnum = typeof TableEnumValues[number];

export function getTableName(table: TableEnum) {
    switch (table) {
        case "TableAttendance": return "請假加班";
        case "TableBankSetting": return "銀行";
        case "TableInsurance": return "勞健保費率";
        case "TableBonusSetting": return "獎金";
        case "TableBonusDepartment": return "獎金部門";
        case "TableBonusPosition": return "獎金職等";
        case "TableBonusPositionType": return "獎金職級";
        case "TableBonusSeniority": return "獎金年資";
        case "TableLevel": return "級距";
        case "TableLevelRange": return "級距類別範圍";
        case "TablePerformanceLevel": return "績效等級比例";
        case "TableTrustMoney": return "信託金";
        case "TableBasicInfo": return "基本資訊";
    }
}

export default TableEnum