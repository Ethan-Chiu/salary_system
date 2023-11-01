import { SettingItem } from "./parameter_table"
import { BankRow } from "./bank_table";
import { BankSetting } from "~/server/database/entity/bank_setting";


export type DATA = {
    table_name: string;
    table_type: "typical";
    table_content: SettingItem[];
  } | {
    table_name: string;
    table_type: "bank";
    table_content: BankSetting[];
  };
  
