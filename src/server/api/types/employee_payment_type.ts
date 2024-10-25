import { z } from "zod";
import { DateAPI, DateService, EmpData, Id } from "./common_type";
import { LongServiceeEnum } from "./long_service_enum";

export const EmployeePayment = z.object({
	emp_no: z.string(),
	base_salary_enc: z.string(),
	food_allowance_enc: z.string(),
	supervisor_allowance_enc: z.string(),
	occupational_allowance_enc: z.string(),
	subsidy_allowance_enc: z.string(),
	long_service_allowance_enc: z.string(),
	long_service_allowance_type: LongServiceeEnum,
	l_r_self_enc: z.string(),
	l_i_enc: z.string(),
	h_i_enc: z.string(),
	l_r_enc: z.string(),
	occupational_injury_enc: z.string(),
}).merge(DateService);

export const EmployeePaymentFE = z.object({
	emp_no: z.string(),
	base_salary: z.number(),
	food_allowance: z.number(),
	supervisor_allowance: z.number(),
	occupational_allowance: z.number(),
	subsidy_allowance: z.number(),
	long_service_allowance: z.number(),
	long_service_allowance_type: LongServiceeEnum,
	l_r_self: z.number(),
	l_i: z.number(),
	h_i: z.number(),
	l_r: z.number(),
	occupational_injury: z.number(),
}).merge(EmpData).merge(DateAPI);

export type EmployeePaymentFEType = z.infer<typeof EmployeePaymentFE>
export type EmployeePaymentType = z.infer<typeof EmployeePayment>

export const createEmployeePaymentAPI = EmployeePaymentFE.omit({ l_i: true, h_i: true, l_r: true, occupational_injury: true });
export const createEmployeePaymentService = EmployeePayment;
export const updateEmployeePaymentAPI = EmployeePaymentFE.partial().merge(Id);
export const updateEmployeePaymentService = EmployeePayment.partial().merge(Id);
