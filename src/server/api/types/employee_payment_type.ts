import { z } from "zod";
import { DateAPI, EmpData, Id } from "./common_type";
import { LongServiceEnum } from "./long_service_enum";
import { optionalNumDefaultZero } from "./z_utils";

const employeePaymentUpdate = z
	.object({
		emp_no: z.string(),
		base_salary: optionalNumDefaultZero,
		food_allowance: optionalNumDefaultZero,
		supervisor_allowance: optionalNumDefaultZero,
		occupational_allowance: optionalNumDefaultZero,
		subsidy_allowance: optionalNumDefaultZero,
		long_service_allowance: optionalNumDefaultZero,
		long_service_allowance_type: LongServiceEnum,
		l_r_self: optionalNumDefaultZero,
		l_i: optionalNumDefaultZero,
		h_i: optionalNumDefaultZero,
		l_r: optionalNumDefaultZero,
		occupational_injury: optionalNumDefaultZero,
	})
	.merge(DateAPI);

const employeePaymentCreate = z
	.object({
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
	})
	.merge(DateAPI);

export const employeePaymentFE = z
  .object({
    id: z.number(),
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
  })
  .merge(EmpData)
  .merge(DateAPI);

export const employeePaymentCreateAPI = employeePaymentCreate.omit({
	l_i: true,
	h_i: true,
	l_r: true,
	occupational_injury: true,
});
export const employeePaymentCreateService = employeePaymentCreate;

export const updateEmployeePaymentAPI = employeePaymentUpdate.partial().merge(Id);
export const updateEmployeePaymentService = employeePaymentUpdate.partial().merge(Id);

export type EmployeePaymentFEType = z.infer<typeof employeePaymentFE>;
