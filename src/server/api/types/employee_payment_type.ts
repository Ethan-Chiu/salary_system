import { z } from "zod";
import { DateAPI, DateService, EmpData, Id } from "./common_type";
import { LongServiceEnum } from "./long_service_enum";

const employeePayment = z.object({
	emp_no: z.string(),
	base_salary: z.string(),
	food_allowance: z.string(),
	supervisor_allowance: z.string(),
	occupational_allowance: z.string(),
	subsidy_allowance: z.string(),
	long_service_allowance: z.string(),
	long_service_allowance_type: LongServiceEnum,
	l_r_self: z.string(),
	l_i: z.string(),
	h_i: z.string(),
	l_r: z.string(),
	occupational_injury: z.string(),
}).merge(DateAPI);

export const employeePaymentFE = z.object({
	emp_no: z.string(),
	base_salary: z.number(),
	food_allowance: z.number(),
	supervisor_allowance: z.number(),
	occupational_allowance: z.number(),
	subsidy_allowance: z.number(),
	long_service_allowance: z.number(),
	long_service_allowance_type: LongServiceEnum,
	l_r_self: z.number(),
	l_i: z.number(),
	h_i: z.number(),
	l_r: z.number(),
	occupational_injury: z.number(),
}).merge(EmpData).merge(DateAPI);

export type EmployeePaymentFEType = z.infer<typeof employeePaymentFE>

export const employeePaymentCreateAPI = employeePaymentFE.omit({ l_i: true, h_i: true, l_r: true, occupational_injury: true });
export const employeePaymentCreateService = employeePayment;
export type EmployeePaymentCreateAPIType = z.infer<typeof employeePaymentCreateAPI>;
export type EmployeePaymentCreateServiceType = z.infer<typeof employeePaymentCreateService>;

export const updateEmployeePaymentAPI = employeePaymentFE.partial().merge(Id);
export const updateEmployeePaymentService = employeePayment.partial().merge(Id);

