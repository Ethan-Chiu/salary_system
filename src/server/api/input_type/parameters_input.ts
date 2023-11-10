import { z } from "zod";
export const createBankSettingInput = z.object({
	bank_code: z.string(),
	bank_name: z.string(),
	org_code: z.string(),
	org_name: z.string(),
	start_date: z.date().nullable(),
	end_date: z.date().nullable(),
});

export const updateBankSettingInput = z
	.object({
		id: z.number(),
		bank_code: z.string().nullable(),
		bank_name: z.string().nullable(),
		org_code: z.string().nullable(),
		org_name: z.string().nullable(),
		start_date: z.date().nullable(),
		end_date: z.date().nullable(),
	})
	.partial();

export const createAttendanceSettingInput = z.object({
	personal_leave_dock: z.number(),
	sick_leave_dock: z.number(),
	rate_of_unpaid_leave: z.number(),
	unpaid_leave_compensatory_1: z.number(),
	unpaid_leave_compensatory_2: z.number(),
	unpaid_leave_compensatory_3: z.number(),
	unpaid_leave_compensatory_4: z.number(),
	unpaid_leave_compensatory_5: z.number(),
	overtime_by_local_workers_1: z.number(),
	overtime_by_local_workers_2: z.number(),
	overtime_by_local_workers_3: z.number(),
	local_worker_holiday: z.number(),
	overtime_by_foreign_workers_1: z.number(),
	overtime_by_foreign_workers_2: z.number(),
	overtime_by_foreign_workers_3: z.number(),
	foreign_worker_holiday: z.number(),
	start_date: z.date().nullable(),
	end_date: z.date().nullable(),
});

export const updateAttendanceSettingInput = z
	.object({
		id: z.number(),
		personal_leave_dock: z.number().nullable(),
		sick_leave_dock: z.number().nullable(),
		rate_of_unpaid_leave: z.number().nullable(),
		unpaid_leave_compensatory_1: z.number().nullable(),
		unpaid_leave_compensatory_2: z.number().nullable(),
		unpaid_leave_compensatory_3: z.number().nullable(),
		unpaid_leave_compensatory_4: z.number().nullable(),
		unpaid_leave_compensatory_5: z.number().nullable(),
		overtime_by_local_workers_1: z.number().nullable(),
		overtime_by_local_workers_2: z.number().nullable(),
		overtime_by_local_workers_3: z.number().nullable(),
		local_worker_holiday: z.number().nullable(),
		overtime_by_foreign_workers_1: z.number().nullable(),
		overtime_by_foreign_workers_2: z.number().nullable(),
		overtime_by_foreign_workers_3: z.number().nullable(),
		foreign_worker_holiday: z.number().nullable(),
		start_date: z.date().nullable(),
		end_date: z.date().nullable(),
	})
	.partial();

export const createInsuranceRateSettingInput = z.object({
	min_wage_rate: z.number(),
	l_i_accident_rate: z.number(),
	l_i_employment_premium_rate: z.number(),
	l_i_occupational_hazard_rate: z.number(),
	l_i_wage_replacement_rate: z.number(),
	h_i_standard_rate: z.number(),
	h_i_avg_dependents_count: z.number(),
	v2_h_i_supp_premium_rate: z.number(),
	v2_h_i_dock_tsx_thres: z.number(),
	start_date: z.date(),
	end_date: z.date().nullable(),
});

export const createBonusDepartmentInput = z.object({
	department: z.string(),
	multiplier: z.number(),
});

export const updateBonusDepartmentInput = z.object({
	id: z.number(),
	department: z.string().nullable(),
	multiplier: z.number().nullable(),
});

export const createBonusPositionInput = z.object({
	position: z.number(),
	position_type: z.string(),
	multiplier: z.number(),
});

export const updateBonusPositionInput = z.object({
	id: z.number(),
	position: z.number().nullable(),
	position_type: z.string().nullable(),
	multiplier: z.number().nullable(),
});

export const createBonusSeniorityInput = z.object({
	seniority: z.number(),
	multiplier: z.number(),
});

export const updateBonusSeniorityInput = z.object({
	id: z.number(),
	seniority: z.number().nullable(),
	multiplier: z.number().nullable(),
});

export const createBonusSettingInput = z.object({
	fixed_multiplier: z.number(),
	criterion_date: z.date(),
	base_on: z.string(),
	type: z.string(),
});

export const updateBonusSettingInput = z.object({
	id: z.number(),
	fixed_multiplier: z.number().nullable(),
	criterion_date: z.date().nullable(),
	base_on: z.string().nullable(),
	type: z.string().nullable(),
});