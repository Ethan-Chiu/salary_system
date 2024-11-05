import { z } from "zod";

import { Id, DateAPI, DateService, User } from "./common_type";
import { BonusTypeEnum } from "./bonus_type_enum";
import { WorkTypeEnum } from "./work_type_enum";

export const createUserAPI = User.merge(DateAPI);
export const createUserService = User.merge(DateService);
export const updateUserAPI = User.merge(DateAPI).partial().merge(Id);
export const updateUserService = User.merge(DateService).partial().merge(Id);

const BankSetting = z.object({
	bank_code: z.string(),
	bank_name: z.string(),
	org_code: z.string(),
	org_name: z.string(),
});

export const createBankSettingAPI = BankSetting.merge(DateAPI);
export const createBankSettingService = BankSetting.merge(DateService);
export const updateBankSettingAPI = BankSetting.merge(DateAPI).partial().merge(Id);
export const updateBankSettingService = BankSetting.merge(DateService).partial().merge(Id);

const AttendanceSetting = z.object({
	// personal_leave_deduction: z.number(),
	// sick_leave_deduction: z.number(),
	// rate_of_unpaid_leave: z.number(),
	// unpaid_leave_compensatory_1: z.number(),
	// unpaid_leave_compensatory_2: z.number(),
	// unpaid_leave_compensatory_3: z.number(),
	// unpaid_leave_compensatory_4: z.number(),
	// unpaid_leave_compensatory_5: z.number(),
	overtime_by_local_workers_1: z.number(),
	overtime_by_local_workers_2: z.number(),
	overtime_by_local_workers_3: z.number(),
	overtime_by_local_workers_4: z.number(),
	overtime_by_local_workers_5: z.number(),
	// local_worker_holiday: z.number(),
	overtime_by_foreign_workers_1: z.number(),
	overtime_by_foreign_workers_2: z.number(),
	overtime_by_foreign_workers_3: z.number(),
	overtime_by_foreign_workers_4: z.number(),
	overtime_by_foreign_workers_5: z.number(),
	// foreign_worker_holiday: z.number(),
});

export const createAttendanceSettingAPI = AttendanceSetting.merge(DateAPI);
export const createAttendanceSettingService =
	AttendanceSetting.merge(DateService);
export const updateAttendanceSettingAPI = AttendanceSetting.merge(DateAPI).partial().merge(Id);
export const updateAttendanceSettingService = AttendanceSetting.merge(DateService).partial().merge(Id);

const BasicInfo = z.object({
	issue_date: z.date(),
	announcement: z.string(),
});

export const createBasicInfoAPI = BasicInfo;
export const createBasicInfoService = BasicInfo;
export const updateBasicInfoAPI = BasicInfo.partial().merge(Id);
export const updateBasicInfoService = BasicInfo.partial().merge(Id);

const InsuranceRateSetting = z.object({
	min_wage_rate: z.number(),
	l_i_accident_rate: z.number(),
	l_i_employment_pay_rate: z.number(),
	l_i_occupational_injury_rate: z.number(),
	l_i_wage_replacement_rate: z.number(),
	h_i_standard_rate: z.number(),
	h_i_avg_dependents_count: z.number(),
	v2_h_i_supp_pay_rate: z.number(),
	v2_h_i_deduction_tsx_thres: z.number(),
	v2_h_i_multiplier: z.number(),
});
export const createInsuranceRateSettingAPI =
	InsuranceRateSetting.merge(DateAPI);
export const createInsuranceRateSettingService =
	InsuranceRateSetting.merge(DateService);
export const updateInsuranceRateSettingAPI = InsuranceRateSetting.merge(DateAPI).partial().merge(Id);
export const updateInsuranceRateSettingService = InsuranceRateSetting.merge(DateService).partial().merge(Id);

const BonusAll = z.object({
	period_id: z.number(),
	bonus_type: BonusTypeEnum,
	multiplier: z.number(),
});

export const createBonusAllAPI = BonusAll;
export const createBonusAllService = BonusAll;
export const updateBonusAllAPI = BonusAll.partial().merge(Id);
export const updateBonusAllService = BonusAll.partial().merge(Id);
export const batchCreateBonusAllAPI = z.array(createBonusAllAPI);

const BonusWorkType = z.object({
	period_id: z.number(),
	bonus_type: BonusTypeEnum,
	work_type: WorkTypeEnum,
	multiplier: z.number(),
});

export const createBonusWorkTypeAPI = BonusWorkType;
export const createBonusWorkTypeService = BonusWorkType;
export const updateBonusWorkTypeAPI = BonusWorkType.partial().merge(Id);
export const updateBonusWorkTypeService = BonusWorkType.partial().merge(Id);
export const batchCreateBonusWorkTypeAPI = z.array(createBonusWorkTypeAPI);

const BonusDepartment = z.object({
	period_id: z.number(),
	bonus_type: BonusTypeEnum,
	department: z.string(),
	multiplier: z.number(),
});

export const createBonusDepartmentAPI = BonusDepartment;
export const createBonusDepartmentService = BonusDepartment;
export const updateBonusDepartmentAPI = BonusDepartment.partial().merge(Id);
export const updateBonusDepartmentService = BonusDepartment.partial().merge(Id)
export const batchCreateBonusDepartmentAPI = z.array(createBonusDepartmentAPI);

const BonusPosition = z.object({
	period_id: z.number(),
	bonus_type: BonusTypeEnum,
	position: z.number(),
	position_multiplier: z.number(),
	position_type: z.string(),
	position_type_multiplier: z.number(),
});

export const createBonusPositionAPI = BonusPosition;
export const createBonusPositionService = BonusPosition;
export const updateBonusPositionAPI = BonusPosition.partial().merge(Id);
export const updateBonusPositionService = BonusPosition.partial().merge(Id);
export const batchCreateBonusPositionAPI = z.array(createBonusPositionAPI);

const BonusPositionType = z.object({
	period_id: z.number(),
	bonus_type: BonusTypeEnum,
	position_type: z.string(),
	multiplier: z.number(),
});

export const createBonusPositionTypeAPI = BonusPositionType;
export const createBonusPositionTypeService = BonusPositionType;
export const updateBonusPositionTypeAPI = BonusPositionType.partial().merge(Id);
export const updateBonusPositionTypeService = BonusPositionType.partial().merge(Id);
export const batchCreateBonusPositionTypeAPI = z.array(
	createBonusPositionTypeAPI
);

const BonusSeniority = z.object({
	period_id: z.number(),
	bonus_type: BonusTypeEnum,
	seniority: z.number(),
	multiplier: z.number(),
});

export const createBonusSeniorityAPI = BonusSeniority;
export const createBonusSeniorityService = BonusSeniority;
export const updateBonusSeniorityAPI = BonusSeniority.partial().merge(Id);
export const updateBonusSeniorityService = BonusSeniority.partial().merge(Id);
export const batchCreateBonusSeniorityAPI = z.array(createBonusSeniorityAPI);

const BonusSetting = z.object({
	fixed_multiplier: z.number(),
	criterion_date: z.date(),
	base_on: z.string(),
	type: z.string(),
});

export const createBonusSettingAPI = BonusSetting;
export const createBonusSettingService = BonusSetting;
export const updateBonusSettingAPI = BonusSetting.partial().merge(Id);
export const updateBonusSettingService = BonusSetting.partial().merge(Id);

const Level = z.object({
	level: z.number(),
});

export const createLevelAPI = Level.merge(DateAPI);
export const createLevelService = Level.merge(DateService);
export const updateLevelAPI = Level.merge(DateAPI).partial().merge(Id);
export const updateLevelService = Level.merge(DateService).partial().merge(Id);

const PerformanceLevel = z.object({
	performance_level: z.string(),
	multiplier: z.number(),
});

export const createPerformanceLevelAPI = PerformanceLevel;
export const createPerformanceLevelService = PerformanceLevel;
export const updatePerformanceLevelAPI = PerformanceLevel.partial().merge(Id);
export const updatePerformanceLevelService = PerformanceLevel.partial().merge(Id);

const SalaryIncomeTax = z.object({
	salary_start: z.number(),
	salary_end: z.number(),
	dependent: z.number(),
	tax_amount: z.number(),
});
export const createSalaryIncomeTaxAPI = SalaryIncomeTax.merge(DateAPI);
export const createSalaryIncomeTaxService = SalaryIncomeTax.merge(DateService);
export const updateSalaryIncomeTaxAPI = SalaryIncomeTax.merge(DateAPI).partial().merge(Id);
export const updateSalaryIncomeTaxService = SalaryIncomeTax.merge(DateService).partial().merge(Id);
export const batchCreateSalaryIncomeTaxAPI = z.array(createSalaryIncomeTaxAPI);
//MARK:trust
const TrustMoney = z.object({
	position: z.number(),
	position_type: z.string(),
	org_trust_reserve_limit: z.number(),
	org_special_trust_incent_limit: z.number(),
});

export const createTrustMoneyAPI = TrustMoney.merge(DateAPI);
export const createTrustMoneyService = TrustMoney.merge(DateService);
export const updateTrustMoneyAPI = TrustMoney.merge(DateAPI).partial().merge(Id);
export const updateTrustMoneyService = TrustMoney.merge(DateService).partial().merge(Id);
//MARK:account
const EmployeeAccount = z.object({
	emp_no: z.string(),
	bank_account: z.string(),
	ratio: z.number(),
});

export const createEmployeeAccountAPI = EmployeeAccount;
export const createEmployeeAccountService = EmployeeAccount;
export const updateEmployeeAccountAPI = EmployeeAccount.partial().merge(Id);
export const updateEmployeeAccountService = EmployeeAccount.partial().merge(Id);

// const EmployeeBonus = z.object({
// 	period_id: z.number(),
// 	bonus_type: BonusTypeEnum,
// 	emp_no: z.string(),
// 	special_multiplier_enc: z.string(),
// 	multiplier_enc: z.string(),
// 	fixed_amount_enc: z.string(),
// 	bud_effective_salary_enc: z.string(),
// 	bud_amount_enc: z.string(),
// 	sup_performance_level_enc: z.string(),
// 	sup_effective_salary_enc: z.string(),
// 	sup_amount_enc: z.string(),
// 	app_performance_level_enc: z.string(),
// 	app_effective_salary_enc: z.string(),
// 	app_amount_enc: z.string(),
// });

// export const createEmployeeBonusAPI = EmployeeBonus;
// export const createEmployeeBonusService = EmployeeBonus;
// export const updateEmployeeBonusAPI = EmployeeBonus.partial().merge(Id);
// export const updateEmployeeBonusByEmpNoAPI = EmployeeBonus.partial();
// export const updateEmployeeBonusService = EmployeeBonus.partial().merge(Id);
// export const updateEmployeeBonusByEmpNoService = EmployeeBonus.partial();

// MARK: Holidays Type
const HolidaysType = z.object({
	pay_id: z.number(),
	holidays_name: z.string(),
	multiplier: z.number(),
	pay_type: z.number(),
});
export const updateHolidaysTypeInput = z
	.object({
		id: z.number(),
		pay_id: z.number().nullable(),
		holidays_name: z.string().nullable(),
		multiplier: z.number().nullable(),
		pay_type: z.number().nullable(),
	})
	.partial();

export const createHolidaysTypeAPI = HolidaysType;
export const createHolidaysTypeService = HolidaysType;
export const updateHolidaysTypeAPI = HolidaysType.partial().merge(Id);
export const updateHolidaysTypeService = HolidaysType.partial().merge(Id);
