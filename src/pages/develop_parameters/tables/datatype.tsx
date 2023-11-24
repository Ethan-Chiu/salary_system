import { SettingItem } from "./parameter_table"
import { BankRow } from "./bank_table";
import { BonusDepartmentRow } from "./bonus_department";
import { BonusPositionRow } from "./bonus_position";
import { BonusSeniorityRow } from "./bonus_seniority";

export type DATA = {
    table_name: string;
    table_type: "typical";
    table_content: SettingItem[];
  } | {
    table_name: string;
    table_type: "bank";
    table_content: BankRow[];
  } | {
    table_name: string;
    table_type: "bonus_department";
    table_content: BonusDepartmentRow[];
  } | {
    table_name: string;
    table_type: "bonus_position";
    table_content: BonusPositionRow[];
  } | {
    table_name: string;
    table_type: "bonus_seniority";
    table_content: BonusSeniorityRow[];
  };
  
export const createDATA = (n: string, t: ("typical" | "bank" | "bonus_department" | "bonus_position" | "bonus_seniority"), c: any) => {
    let data: DATA = {
      table_name: n,
      table_type: t,
      table_content: c
    }
    return data
}
