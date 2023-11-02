import { SettingItem } from "./parameter_table"
import { BankRow } from "../backup/bank_table";


export type DATA = {
    table_name: string;
    table_type: "typical";
    table_content: SettingItem[];
  } | {
    table_name: string;
    table_type: "bank";
    table_content: BankRow[];
  };
  
export const createDATA = (n: string, t: ("typical" | "bank"), c: any) => {
    if (t === "typical") {
      let data: DATA = {
        table_name: n,
        table_type: t,
        table_content: c
      }
      return data
    }
    else if (t === "bank") {
      let data: DATA = {
        table_name: n,
        table_type: t,
        table_content: c
      }
      return data
    }
    else
    {
      let data: DATA = {
        table_name: n,
        table_type: t,
        table_content: c
      }
      return data
    }
}
