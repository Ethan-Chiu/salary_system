import { z } from "zod";
import { DateAPI, DateService, EmpData, Id } from "./common_type";

export const EmployeePayment = z.object({
	emp_no: z.string(),
	base_salary: z.number(),
	food_allowance: z.number().nullable(),
	supervisor_allowance: z.number().nullable(),
	occupational_allowance: z.number().nullable(),
	subsidy_allowance: z.number().nullable(),
	professional_cert_allowance: z.number().nullable(),
	l_r_self: z.number(),
	l_i: z.number(),
	h_i: z.number(),
	l_r: z.number(),
	occupational_injury: z.number(),
});

export const EmployeePaymentFE = EmployeePayment.merge(EmpData);

export const createEmployeePaymentAPI = EmployeePayment.merge(DateAPI);
export const createEmployeePaymentService = EmployeePayment.merge(DateService);
export const updateEmployeePaymentAPI = EmployeePayment.merge(Id)
	.merge(DateAPI)
	.partial();
export const updateEmployeePaymentService = EmployeePayment.merge(Id)
	.merge(DateService)
	.partial();