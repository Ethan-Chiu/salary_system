import { z } from "zod";

export const syncInput = z.object({
  emp_no: z.string(),
  keys: z.string().array(),
});
export type SyncInputType = z.infer<typeof syncInput>;


export const QuitDateEnum = z.enum(["null", "past", "current", "future"])
export type QuitDateEnumType = z.infer<typeof QuitDateEnum>;


export interface DataComparison<ValueT = any> {
	key: string;
	salary_value: ValueT;
	ehr_value: ValueT;
	is_different: boolean;
}

export class SyncData {
	emp_no: DataComparison<string>;
	name: DataComparison<string>;
	department: DataComparison<string>;
	english_name: DataComparison;
	comparisons: Array<DataComparison>;

  constructor({
    emp_no,
    name,
    department,
    english_name,
    comparisons
  }: {
    emp_no: DataComparison<string>;
    name: DataComparison<string>;
    department: DataComparison<string>;
    english_name: DataComparison;
    comparisons: Array<DataComparison>;
  }) {
    this.emp_no = emp_no;
    this.name = name;
    this.department = department;
    this.english_name = english_name;
    this.comparisons = comparisons;
  }
}

export interface PaidEmployee {
	emp_no: string;
	name: string;
	department: string;
	work_status: string;
	quit_date: string | null;
	bug?: string;
}
