import { z } from "zod";

import { Id } from "./common_type";
import { WorkTypeEnum } from "./work_type_enum";

//MARK:employee_data
const employeeData = z.object({
	period_id: z.number(),
	emp_no: z.string(),
	emp_name: z.string(),
	position: z.number(),
	position_type: z.string(),
	group_insurance_type: z.string(),
	department: z.string(),
	work_type: WorkTypeEnum,
	work_status: z.string(),
	disabilty_level: z.string().nullable(),
	sex_type: z.string(),
	dependents: z.number().nullable(),
	healthcare_dependents: z.number().nullable(),
	registration_date: z.string(),
	quit_date: z.string().nullable(),
	license_id: z.string().nullable(),
	bank_account: z.string(),
	// received_elderly_benefits: z.boolean(),
});

export const createEmployeeDataAPI = employeeData;
export const createEmployeeDataService = employeeData;
export type CreateEmployeeDataType = z.infer<typeof createEmployeeDataService>;


export const updateEmployeeDataAPI = employeeData.partial().merge(Id);
export const updateEmployeeDataByEmpNoAPI = employeeData.partial();
export const updateEmployeeDataService = employeeData.partial().merge(Id);
export const updateEmployeeDataByEmpNoService = employeeData.partial();

// const EmployeeDataMut = z.object({
// 	emp_no: z.string(),
// 	trust_date: z.string(),
// 	start_date: z.string(),
// 	end_date: z.string().nullable(),
// });
// export const createEmployeeDataMutAPI = EmployeeDataMut;
// export const createEmployeeDataMutService = EmployeeDataMut;
// export const updateEmployeeDataMutAPI = EmployeeDataMut.partial().merge(Id);
// export const updateEmployeeDataMutByEmpNoAPI = EmployeeDataMut.partial();
// export const updateEmployeeDataMutService = EmployeeDataMut.partial().merge(Id);
// export const updateEmployeeDataMutByEmpNoService = EmployeeDataMut.partial();

const employeeDataFE = z.object({
	emp_no: z.string(),
	emp_name: z.string(),
	position: z.number(),
	position_type: z.string(),
	group_insurance_type: z.string(),
	department: z.string(),
	work_type: WorkTypeEnum,
	work_status: z.string(),
	disabilty_level: z.string().nullable(),
	sex_type: z.string(),
	dependents: z.number().nullable(),
	healthcare_dependents: z.number().nullable(),
	registration_date: z.string(),
	quit_date: z.string().nullable(),
	license_id: z.string().nullable(),
	bank_account: z.string(),
	trust_date: z.string(),
});
