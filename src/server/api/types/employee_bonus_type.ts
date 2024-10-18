import { z } from "zod";
import { DateAPI, DateService, EmpData, Id } from "./common_type";
import { BonusTypeEnum } from "./bonus_type_enum";

export const EmployeeBonus = z.object({
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
	disabled: z.boolean()
});

export const EmployeeBonusFE = z.object({
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
	budget_effective_salary: z.coerce.number(), // 預算績效比率
	budget_amount: z.coerce.number(),
	supervisor_performance_level: z.coerce.string().nullable(),
	supervisor_effective_salary: z.coerce.number().nullable(),
	supervisor_amount: z.coerce.number().nullable(),
	approved_performance_level: z.coerce.string().nullable(),
	approved_effective_salary: z.coerce.number().nullable(),
	approved_amount: z.coerce.number().nullable(),
	disabled: z.boolean(),
}).merge(EmpData);


export type EmployeeBonusFEType = z.infer<typeof EmployeeBonusFE>
export type EmployeeBonusType = z.infer<typeof EmployeeBonus>

export const createEmployeeBonusAPI = EmployeeBonusFE;
export const createEmployeeBonusService = EmployeeBonus;
export const updateEmployeeBonusAPI = EmployeeBonus.merge(Id)
	.partial();
export const updateEmployeePaymentService = EmployeeBonus.merge(Id)
	.partial();
