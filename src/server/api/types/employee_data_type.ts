import { z } from "zod";

import { Id, DateAPI, DateService, User } from "./common_type";
import { BonusTypeEnum } from "./bonus_type_enum";
import { WorkTypeEnum } from "./work_type_enum";
//MARK:employee_data
const EmployeeData = z.object({
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

export const createEmployeeDataAPI = EmployeeData;
export const createEmployeeDataService = EmployeeData;
export const updateEmployeeDataAPI = EmployeeData.partial().merge(Id);
export const updateEmployeeDataByEmpNoAPI = EmployeeData.partial();
export const updateEmployeeDataService = EmployeeData.partial().merge(Id);
export const updateEmployeeDataByEmpNoService = EmployeeData.partial();

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

const EmployeeDataFE = z.object({
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
    trust_date: z.string(),});