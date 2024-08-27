import { z } from "zod";
import { DateAPI, DateService, EmpData, Id } from "./common_type";

export const EmployeePayment = z.object({
	emp_no: z.string(),
	base_salary_enc: z.string(),
	food_allowance_enc: z.string(),
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
	l_r_self: z.number(),
	l_i: z.number(),
	h_i: z.number(),
	l_r: z.number(),
	occupational_injury: z.number(),
}).merge(EmpData).merge(DateAPI);

export const createEmployeePaymentAPI = EmployeePaymentFE;
export const createEmployeePaymentService = EmployeePayment;
export const updateEmployeePaymentAPI = EmployeePaymentFE.merge(Id)
	.partial();
export const updateEmployeePaymentService = EmployeePayment.merge(Id)
	.partial();