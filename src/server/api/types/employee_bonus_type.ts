import { z } from "zod";
import { EmpData, Id } from "./common_type";
import { BonusTypeEnum } from "./bonus_type_enum";

export const employeeBonus = z.object({
	period_id: z.number(),
	bonus_type: BonusTypeEnum,
	emp_no: z.string(),
	special_multiplier_enc: z.string(),
	multiplier_enc: z.string(),
	fixed_amount_enc: z.string(),
	bud_effective_salary_enc: z.string(),
	bud_amount_enc: z.string(),
	sup_performance_level_enc: z.string(),
	sup_effective_salary_enc: z.string(),
	sup_amount_enc: z.string(),
	app_performance_level_enc: z.string(),
	app_effective_salary_enc: z.string(),
	app_amount_enc: z.string(),
});

export const employeeBonusFE = z.object({
	id: z.coerce.number(),
	period_id: z.coerce.number(),
	bonus_type: BonusTypeEnum,
	department: z.coerce.string(),
	emp_no: z.coerce.string(),
	emp_name: z.coerce.string(),
	registration_date: z.coerce.string(),
	seniority: z.coerce.number(),
	position_position_type: z.coerce.string(),
	work_status: z.coerce.string(),
	base_salary: z.coerce.number(),
	supervisor_allowance: z.coerce.number().nullable(),
	subsidy_allowance: z.coerce.number(),
	occupational_allowance: z.coerce.number(),
	food_allowance: z.coerce.number(),
	long_service_allowance: z.coerce.number(),
	total: z.coerce.number(),
	special_multiplier: z.coerce.number(),
	multiplier: z.coerce.number(),
	fixed_amount: z.coerce.number(),
	bud_effective_salary: z.coerce.number(), // 預算績效比率
	bud_amount: z.coerce.number(),
	sup_performance_level: z.coerce.string().nullable(),
	sup_effective_salary: z.coerce.number().nullable(),
	sup_amount: z.coerce.number().nullable(),
	app_performance_level: z.coerce.string().nullable(),
	app_effective_salary: z.coerce.number().nullable(),
	app_amount: z.coerce.number().nullable(),
}).merge(EmpData);


export type EmployeeBonusFEType = z.infer<typeof employeeBonusFE>
export type EmployeeBonusType = z.infer<typeof employeeBonus>

export const createEmployeeBonusAPI = employeeBonusFE;
export const createEmployeeBonusService = employeeBonus;
export const updateEmployeeBonusAPI = employeeBonusFE.partial().merge(Id);
export const updateEmployeeBonusService = employeeBonus.partial().merge(Id);
